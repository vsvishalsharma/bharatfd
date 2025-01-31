const redis = require('redis');
const logger = require('../utils/logger');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async set(key, value, options = {}) {
    await this.connect();
    return this.client.set(key, JSON.stringify(value), options);
  }

  async get(key) {
    await this.connect();
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key) {
    await this.connect();
    return this.client.del(key);
  }

  async close() {
    await this.client.quit();
  }
}

module.exports = new RedisClient();