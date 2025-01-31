const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app.js');
const FAQ = require('../src/models/faq');

describe('FAQ Tests', () => {
  let mongoServer;

  // Increase Jest timeout
  jest.setTimeout(30000);

  beforeAll(async () => {
    // Use MongoDB Memory Server for more reliable testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  });

  afterAll(async () => {
    // Disconnect and stop the in-memory server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database before each test
    await FAQ.deleteMany({});
  });

  describe('FAQ Model', () => {
    it('should create a new FAQ', async () => {
      const faqData = {
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime environment',
        language: 'en',
      };

      const validFAQ = new FAQ(faqData);
      const savedFAQ = await validFAQ.save();

      expect(savedFAQ._id).toBeDefined();
      expect(savedFAQ.question).toBe(faqData.question);
      expect(savedFAQ.answer).toBe(faqData.answer);
    });

    it('should fail creating FAQ without required fields', async () => {
      const invalidFAQ = new FAQ({});

      await expect(invalidFAQ.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should support multilingual translations', async () => {
      const faqData = {
        question: 'What is programming?',
        answer: 'Programming is writing computer instructions',
        language: 'en',
        translations: new Map([
          ['hi', {
            question: 'प्रोग्रामिंग क्या है?',
            answer: 'प्रोग्रामिंग कंप्यूटर निर्देश लिखना है',
          }],
        ]),
      };

      const faq = new FAQ(faqData);
      const savedFAQ = await faq.save();

      expect(savedFAQ.translations.get('hi')).toBeDefined();
      expect(savedFAQ.translations.get('hi').question).toBe('प्रोग्रामिंग क्या है?');
    });
  });

  describe('FAQ Controller', () => {
    it('should create a new FAQ', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          question: 'Test Question',
          answer: 'Test Answer',
          language: 'en'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.question).toBe('Test Question');
    });

    it('should retrieve FAQs', async () => {
      await FAQ.create([
        { 
          question: 'Q1', 
          answer: 'A1', 
          language: 'en' 
        },
        { 
          question: 'Q2', 
          answer: 'A2', 
          language: 'en' 
        }
      ]);

      const response = await request(app).get('/api/faqs');

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should retrieve FAQs in specific language', async () => {
      const response = await request(app).get('/api/faqs?lang=hi');

      expect(response.statusCode).toBe(200);
    });
  });
});