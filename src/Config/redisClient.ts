import { createClient } from 'redis';
import { logger } from './logger';

const client = createClient({
    url: 'redis://localhost:6379',  // Update URL if Redis is hosted remotely
});

client.on('error', (err) => logger.error('Redis Client Error', err));
client.connect()
    .then(() => logger.info('Connected to Redis'))
    .catch(err => logger.error('Failed to connect to Redis', err));

export default client;
