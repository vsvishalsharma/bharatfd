const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mocking external services
jest.mock('../src/services/translationService', () => ({
  translate: jest.fn((text, source, target) => Promise.resolve(text)),
  detectLanguage: jest.fn((text) => Promise.resolve('en'))
}));