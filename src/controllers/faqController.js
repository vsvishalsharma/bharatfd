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

  async getFAQs(req, res) {
    try {
      const { lang = 'en' } = req.query;

      // Fetch FAQs
      const faqs = await FAQ.find();

      // Translate FAQs to requested language
      const translatedFAQs = await Promise.all(
        faqs.map(async (faq) => {
          const translatedContent = await faq.getTranslatedContent(lang);
          return {
            _id: faq._id,
            ...translatedContent
          };
        })
      );

      res.json(translatedFAQs);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching FAQs', 
        error: error.message 
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