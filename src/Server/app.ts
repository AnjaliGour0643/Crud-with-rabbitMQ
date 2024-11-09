import express from 'express';
import { db } from '../Config/db.config';
import { router } from '../Routes/post.routes';
import morgan from 'morgan';
import { logger } from '../Config/logger';
import redisClient from '../Config/redisClient';
import { createChannel } from '../utils/rabbitmq';
import { startUserRegistrationConsumer } from '../Consumers/registrationConsumer';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Morgan to log HTTP requests
app.use(morgan('combined', { 
    stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.use('/api/v1/posts', router);

// DB connection and server connection
db.then(async () => {
    try {
        // Start server
        app.listen(7070, async () => {
            logger.info('Server is listening on port 7070');

            // Connect to Redis and log success
            try {
                await redisClient.connect();
                logger.info('Connected to Redis on port 6379');
            } catch (error) {
                logger.error('Failed to connect to Redis:', error);
            }

            // Connect to RabbitMQ and start the consumer
            await connectRabbitMQ();
            startUserRegistrationConsumer(); // Start consuming registration messages
            logger.info('Connected to RabbitMQ and consumer started.');
        });
    } catch (error) {
        logger.error('Failed to initialize server or connections:', error);
    }
});

// Function to connect to RabbitMQ (calls the `createChannel` utility)
async function connectRabbitMQ() {
    try {
        const channel = await createChannel();
        logger.info('Successfully connected to RabbitMQ');
        
        // Here you could also perform any initial setup on the channel if needed, like asserting queues
        await channel.assertQueue('user_registration_queue', { durable: true });

    } catch (error) {
        logger.error('Error connecting to RabbitMQ:', error);
    }
}

// Gracefully handle shutdown to close Redis and RabbitMQ connections
process.on('SIGINT', async () => {
    logger.info('Shutting down server...');

    // Close Redis connection
    try {
        await redisClient.disconnect();
        logger.info('Redis client disconnected.');
    } catch (error) {
        logger.error('Error disconnecting Redis client:', error);
    }

    process.exit(0);
});
