const { GoogleGenerativeAI } = require("@google/generative-ai");

class TranslationService {
  constructor() {
    // Ensure you have set GOOGLE_API_KEY in your .env file
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro"});
  }

  async translate(text, sourceLanguage, targetLanguage) {
    const languageMap = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali',
      'fr': 'French'
    };

    try {
      const prompt = `Translate the following text from ${languageMap[sourceLanguage] || 'English'} to ${languageMap[targetLanguage] || 'English'}. 
      Text: "${text}"
      
      Provide only the translated text without any additional commentary.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of the following text and respond with the two-letter language code:
      "${text}"
      
      Respond with only the language code (en, hi, bn, fr, etc.)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const detectedLanguage = response.text().trim().toLowerCase();

      // Validate detected language
      const validLanguages = ['en', 'hi', 'bn', 'fr'];
      return validLanguages.includes(detectedLanguage) ? detectedLanguage : 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }
}

module.exports = new TranslationService();