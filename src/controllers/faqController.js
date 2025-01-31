const FAQ = require('../models/faq');
const { validationResult } = require('express-validator');

class FAQController {
  async createFAQ(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { question, answer, language = 'en' } = req.body;

      // Create FAQ with automatic translations
      const faq = new FAQ({
        question,
        answer,
        language
      });

      // Auto-generate translations for supported languages
      const supportedLanguages = process.env.SUPPORTED_LANGUAGES.split(',');
      for (const lang of supportedLanguages) {
        if (lang !== language) {
          const translatedContent = await faq.getTranslatedContent(lang);
          faq.translations.set(lang, translatedContent);
        }
      }

      await faq.save();

      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating FAQ', 
        error: error.message 
      });
    }
  }

  async  getFAQs(req, res) {
    try {
      const { lang = 'en' } = req.query;
      
      // Validate language parameter
      const supportedLanguages = ['en', 'hi', 'bn', 'fr'];
      if (!supportedLanguages.includes(lang)) {
        return res.status(400).json({
          message: `Invalid language code. Supported languages are: ${supportedLanguages.join(', ')}`
        });
      }
  
      // Fetch all FAQs
      const faqs = await FAQ.find()
        .sort({ createdAt: -1 });
  
      // Translate FAQs to requested language
      const translatedFAQs = await Promise.all(
        faqs.map(async (faq) => {
          // Get translated content (will be cached if already exists)
          const translatedContent = await faq.getTranslatedContent(lang);
          
          return {
            id: faq._id,
            question: translatedContent.question,
            answer: translatedContent.answer,
            originalLanguage: faq.language,
            createdAt: faq.createdAt
          };
        })
      );
  
      res.json({
        language: lang,
        count: translatedFAQs.length,
        faqs: translatedFAQs
      });
  
    } catch (error) {
      console.error('FAQ fetch error:', error);
      res.status(500).json({ 
        message: 'Error fetching FAQs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  
  async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { question, answer, language } = req.body;

      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
      }

      // Update base content
      faq.question = question || faq.question;
      faq.answer = answer || faq.answer;
      faq.language = language || faq.language;

      // Clear existing translations to regenerate
      faq.translations.clear();

      await faq.save();

      res.json(faq);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating FAQ', 
        error: error.message 
      });
    }
  }
}

module.exports = new FAQController();