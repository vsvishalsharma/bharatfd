const { Translate } = require('@google-cloud/translate').v2;
const redisClient = require('../config/redis');

class TranslationService {
  constructor() {
    // Initialize Google Translate client
    this.translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    });
  }

  async translate(text, sourceLanguage, targetLanguage) {
    // Check cache first
    const cacheKey = `translation:${sourceLanguage}:${targetLanguage}:${text}`;
    
    try {
      // Check Redis cache
      const cachedTranslation = await redisClient.get(cacheKey);
      if (cachedTranslation) {
        return cachedTranslation;
      }

      // Perform translation
      const [translation] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage
      });

      // Cache the translation for future use
      await redisClient.set(cacheKey, translation, {
        EX: 60 * 60 * 24 // Expire in 24 hours
      });

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService();