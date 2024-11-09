import { createChannel } from '../utils/rabbitmq';

const queueName = 'registrationQueue';

export async function startUserRegistrationConsumer() {
  try {
    const channel = await createChannel();

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in queue: ${queueName}`);

    // Consume messages from the queue
    channel.consume(queueName, async (message) => {
      if (message) {
        const userData = JSON.parse(message.content.toString());
        console.log('Received user registration message:', userData);

        await processUserRegistration(userData); // Process the user registration message

        channel.ack(message); // Acknowledge message after processing
      }
    });
  } catch (error) {
    console.error('Error in RabbitMQ consumer:', error);
  }
}

// Function to handle processing of the received message
async function processUserRegistration(userData: any) {
  console.log(`Received user registration message for ${userData.email}`);
  console.log(`Message details:`, userData);

  console.log('Starting processing of registration data...');
  
  console.log(`Sending welcome email to ${userData.fname} ${userData.lname} at ${userData.email}`);
  
  // Simulate a delay in sending the welcome email (processing)
  await new Promise((resolve) => setTimeout(resolve, 10000));
  
  console.log(`Welcome email sent to ${userData.fname} at ${userData.email}`);  
  console.log(`Completed processing for user registration: ${userData.email}`);
}
