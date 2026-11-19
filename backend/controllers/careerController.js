import mongoose from 'mongoose';
import Career from '../models/Career.js';

const options = {
  jobType: ['Full Time', 'Part Time', 'Contract', 'Internship'],
  workMode: ['On Site', 'Hybrid', 'Remote'],
  status: ['Open', 'Closed'],
};

const clean = (value = '') => String(value).trim();
const bool = (value) => String(value).toLowerCase() === 'true';
const list = (value) =>
  Array.isArray(value)
    ? value.map(clean).filter(Boolean)
    : clean(value)
        .split('\n')
        .map(clean)
        .filter(Boolean);
const slugify = (value = '') =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const uniqueSlug = async (value, excludeId) => {
  const base = slugify(value) || `career-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (
    await Career.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${counter++}`;
  }

  return slug;
};

// Return only current schema fields, including for records created before schema changes.
const careerFields = Object.keys(Career.schema.paths).join(' ');

const payload = async (body, current = null) => {
  const title = clean(body.title ?? current?.title);
  const department = clean(body.department ?? current?.department);
  const location = clean(body.location ?? current?.location);
  const description = clean(body.description ?? current?.description);
  const published = body.published === undefined ? current?.published ?? false : bool(body.published);

  if (!title || !department || !location || !description) {
    throw new Error('Title, department, location and description are required.');
  }

  const result = {
    title,
    slug: await uniqueSlug(clean(body.slug || current?.slug || title), current?._id),
    department,
    location,
    jobType: body.jobType ?? current?.jobType ?? 'Full Time',
    workMode: body.workMode ?? current?.workMode ?? 'On Site',
    experience: clean(body.experience ?? current?.experience),
    salary: clean(body.salary ?? current?.salary),
    openings: Math.max(Number(body.openings ?? current?.openings ?? 1) || 1, 1),
    shortDescription: clean(body.shortDescription ?? current?.shortDescription),
    description,
    responsibilities: body.responsibilities === undefined ? current?.responsibilities || [] : list(body.responsibilities),
    requirements: body.requirements === undefined ? current?.requirements || [] : list(body.requirements),
    skills: body.skills === undefined ? current?.skills || [] : list(body.skills),
    status: body.status ?? current?.status ?? 'Open',
    published,
    publishedAt: published ? current?.publishedAt || new Date() : current?.publishedAt || null,
    metaTitle: clean(body.metaTitle ?? current?.metaTitle),
    metaDescription: clean(body.metaDescription ?? current?.metaDescription),
  };

  if (!options.jobType.includes(result.jobType) || !options.workMode.includes(result.workMode) || !options.status.includes(result.status)) {
    throw new Error('One or more career options are invalid.');
  }

  return result;
};

export const getCareers = async (req, res) => {
  try {
    const { published, status, department, jobType, location, search, publicOnly } = req.query;
    const filter = {};

    if (bool(publicOnly)) {
      filter.published = true;
    } else if (published !== undefined) {
      filter.published = bool(published);
    }

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = { $regex: clean(department), $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (location) {
      filter.location = { $regex: clean(location), $options: 'i' };
    }

    if (search?.trim()) {
      filter.$or = ['title', 'department', 'location', 'shortDescription', 'description'].map((field) => ({
        [field]: { $regex: clean(search), $options: 'i' },
      }));
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 100);
    const total = await Career.countDocuments(filter);
    const careers = await Career.find(filter, careerFields).sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

    return res.json({ success: true, careers, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
  } catch (error) {
    console.error('Get careers error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load careers.' });
  }
};

export const getCareerBySlug = async (req, res) => {
  try {
    const slug = clean(req.params.slug).toLowerCase();

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Career slug is required.' });
    }

    const career = await Career.findOne({
      slug,
      published: true,
    }, careerFields);

    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found.' });
    }

    return res.json({ success: true, career });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to load career.' });
  }
};

export const createCareer = async (req, res) => {
  try {
    return res.status(201).json({ success: true, message: 'Career created successfully.', career: await Career.create(await payload(req.body)) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unable to create career.' });
  }
};

export const updateCareer = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid career ID.' });
    const career = await Career.findById(req.params.id, careerFields);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found.' });
    Object.assign(career, await payload(req.body, career));
    await career.save();
    return res.json({ success: true, message: 'Career updated successfully.', career });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unable to update career.' });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid career ID.' });
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found.' });
    return res.json({ success: true, message: 'Career deleted successfully.' });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to delete career.' });
  }
};
