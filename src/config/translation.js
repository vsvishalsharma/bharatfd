module.exports = {
    SUPPORTED_LANGUAGES: {
      en: 'English',
      hi: 'Hindi',
      bn: 'Bengali',
      fr: 'French'
    },
    
    DEFAULT_LANGUAGE: 'en',
    
    TRANSLATION_CACHE_DURATION: 60 * 60 * 24, // 24 hours
    
    TRANSLATION_PROVIDERS: {
      GOOGLE: 'google',
      DEEPL: 'deepl',
      MICROSOFT: 'microsoft'
    },
    
    FALLBACK_STRATEGY: {
      DEFAULT_LANGUAGE: 'en',
      PARTIAL_TRANSLATION: true,
      LOG_TRANSLATION_FAILURES: true
    }
  };