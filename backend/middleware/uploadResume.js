import multer from 'multer';

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new Error('Only PDF, DOC and DOCX resumes are allowed.'),
        false
      );
    }

    return callback(null, true);
  },
});

export const handleResumeUpload = (req, res, next) => {
  uploadResume.single('resume')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Resume size must be 5MB or less.',
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to process resume upload.',
    });
  });
};

export default uploadResume;
