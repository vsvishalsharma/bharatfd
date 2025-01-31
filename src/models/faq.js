const mongoose = require('mongoose');
const translationService = require('../services/translationService');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String
    },
    default: {}
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'bn', 'fr']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  methods: {
    async getTranslatedContent(targetLanguage) {
      // If translation exists, return it
      if (this.translations.get(targetLanguage)) {
        return this.translations.get(targetLanguage);
      }

      // If no translation, attempt to generate
      try {
        const translatedQuestion = await translationService.translate(
          this.question, 
          'en', 
          targetLanguage
        );
        
        const translatedAnswer = await translationService.translate(
          this.answer, 
          'en', 
          targetLanguage
        );

        // Cache the translation
        this.translations.set(targetLanguage, {
          question: translatedQuestion,
          answer: translatedAnswer
        });

        await this.save();

        return {
          question: translatedQuestion,
          answer: translatedAnswer
        };
      } catch (error) {
        // Fallback to original content
        return {
          question: this.question,
          answer: this.answer
        };
      }
    }
  }
});

module.exports = mongoose.model('FAQ', faqSchema);