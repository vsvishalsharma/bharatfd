const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const languageValidator = (languages = ['en', 'hi', 'bn', 'fr']) => {
  return (req, res, next) => {
    const { lang } = req.query;
    if (lang && !languages.includes(lang)) {
      return res.status(400).json({
        message: 'Invalid language',
        supportedLanguages: languages
      });
    }
    next();
  };
};

module.exports = {
  validateRequest,
  languageValidator
};