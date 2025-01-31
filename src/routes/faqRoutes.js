const express = require('express');
const { body, param } = require('express-validator');
const FAQController = require('../controllers/faqController');

const router = express.Router();

// Validation middleware for FAQ creation
const validateFAQ = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('language')
    .optional()
    .isIn(['en', 'hi', 'bn', 'fr'])
    .withMessage('Invalid language')
];

// Create new FAQ
router.post('/', validateFAQ, FAQController.createFAQ);

// Get all FAQs (with optional language parameter)
router.get('/', FAQController.getFAQs);

// Update an existing FAQ
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid FAQ ID'),
  ...validateFAQ
], FAQController.updateFAQ);

module.exports = router;