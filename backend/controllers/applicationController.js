import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Application from '../models/Application.js';
import Career from '../models/Career.js';

const APPLICATION_STATUSES = [
  'New',
  'Reviewed',
  'Shortlisted',
  'Rejected',
  'Hired',
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_FOLDER = 'perroqueta/careers/resumes';
const allowedResumeMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const allowedResumeExtensions = new Set(['pdf', 'doc', 'docx']);

const clean = (value = '') => String(value).trim();
const cleanLower = (value = '') => clean(value).toLowerCase();

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const isValidPhone = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

const getExtension = (filename = '') => {
  const segments = String(filename).split('.');

  if (segments.length < 2) {
    return '';
  }

  return segments.pop().toLowerCase();
};

const isCareerOpenForApplications = (career) => {
  if (!career) return false;

  if (career.published === false) {
    return false;
  }

  if (career.status !== 'Open') {
    return false;
  }

  if (!career.applicationDeadline) {
    return true;
  }

  return new Date(career.applicationDeadline).getTime() >= Date.now();
};

const uploadResumeToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: RESUME_FOLDER,
        resource_type: 'raw',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

const destroyResumeFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
  } catch (error) {
    console.error('Cloudinary resume cleanup error:', error);
  }
};

const validateResumeFile = (file) => {
  if (!file) {
    return 'Resume is required.';
  }

  if (file.size > MAX_RESUME_BYTES) {
    return 'Resume size must be 5MB or less.';
  }

  if (!allowedResumeMimeTypes.has(file.mimetype)) {
    return 'Only PDF, DOC and DOCX resumes are allowed.';
  }

  const extension = getExtension(file.originalname);

  if (!allowedResumeExtensions.has(extension)) {
    return 'Only PDF, DOC and DOCX resumes are allowed.';
  }

  return '';
};

const getCareerId = (body) => clean(body.career || body.careerId || '');
const getCareerTitle = (body, career) => clean(body.careerTitle || body.jobTitle || career?.title || '');
const getPhone = (body) => clean(body.phone || body.mobileNumber || '');
const getCurrentLocation = (body) => clean(body.currentLocation || body.location || '');

export const createApplication = async (req, res) => {
  let uploadedResume = null;

  try {
    const careerId = getCareerId(req.body);
    const fullName = clean(req.body.fullName || '');
    const email = cleanLower(req.body.email || '');
    const phone = getPhone(req.body);
    const experience = clean(req.body.experience || '');
    const currentLocation = getCurrentLocation(req.body);
    const currentCompany = clean(req.body.currentCompany || '');
    const message = clean(req.body.message || '');
    const resumeError = validateResumeFile(req.file);

    if (!careerId || !mongoose.isValidObjectId(careerId)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid career opportunity.',
      });
    }

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number.',
      });
    }

    if (resumeError) {
      return res.status(400).json({
        success: false,
        message: resumeError,
      });
    }

    const career = await Career.findById(careerId);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found.',
      });
    }

    if (!isCareerOpenForApplications(career)) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications.',
      });
    }

    uploadedResume = await uploadResumeToCloudinary(req.file);

    const application = await Application.create({
      career: career._id,
      careerTitle: getCareerTitle(req.body, career),
      fullName,
      email,
      phone,
      experience,
      currentCompany,
      currentLocation,
      message,
      resume: {
        url: uploadedResume.secure_url,
        publicId: uploadedResume.public_id,
        originalName: req.file.originalname,
      },
      status: 'New',
      appliedAt: new Date(),
    });

    const populatedApplication = await Application.findById(application._id).populate(
      'career',
      'title slug status applicationDeadline'
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: populatedApplication || application,
    });
  } catch (error) {
    console.error('Create application error:', error);

    if (uploadedResume?.public_id) {
      await destroyResumeFromCloudinary(uploadedResume.public_id);
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to submit application.',
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const search = clean(req.query.search || '');
    const status = clean(req.query.status || '');
    const careerId = clean(req.query.careerId || req.query.career || '');
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    const filter = {};

    if (status) {
      if (!APPLICATION_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Please select a valid application status.',
        });
      }

      filter.status = status;
    }

    if (careerId) {
      if (!mongoose.isValidObjectId(careerId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid career ID.',
        });
      }

      filter.career = careerId;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { careerTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, overallTotal, newCount, reviewedCount, shortlistedCount, rejectedCount, hiredCount, applications] =
      await Promise.all([
        Application.countDocuments(filter),
        Application.countDocuments({}),
        Application.countDocuments({ status: 'New' }),
        Application.countDocuments({ status: 'Reviewed' }),
        Application.countDocuments({ status: 'Shortlisted' }),
        Application.countDocuments({ status: 'Rejected' }),
        Application.countDocuments({ status: 'Hired' }),
        Application.find(filter)
          .populate('career', 'title slug status applicationDeadline')
          .sort({ appliedAt: -1, createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit).lean(),
      ]);

    return res.status(200).json({
      success: true,
      applications,
      total,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      limit,
      stats: {
        total: overallTotal,
        new: newCount,
        reviewed: reviewedCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount,
        hired: hiredCount,
      },
    });
  } catch (error) {
    console.error('Get applications error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load applications.',
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID.',
      });
    }

    const application = await Application.findById(id).populate(
      'career',
      'title slug status applicationDeadline'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Get application by id error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load application.',
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = clean(req.body.status || '');

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID.',
      });
    }

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid application status.',
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.status = status;
    await application.save();

    const populatedApplication = await Application.findById(application._id).populate(
      'career',
      'title slug status applicationDeadline'
    );

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully.',
      application: populatedApplication || application,
    });
  } catch (error) {
    console.error('Update application status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update application status.',
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID.',
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const resumePublicId = application.resume?.publicId || '';

    await application.deleteOne();
    await destroyResumeFromCloudinary(resumePublicId);

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error) {
    console.error('Delete application error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete application.',
    });
  }
};

