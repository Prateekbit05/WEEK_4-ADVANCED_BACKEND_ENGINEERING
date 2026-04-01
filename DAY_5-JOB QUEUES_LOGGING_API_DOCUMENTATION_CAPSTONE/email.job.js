/**
 * @fileoverview Email Worker
 * @description Background worker for processing email jobs
 */

require('dotenv').config();
const { Worker } = require('bullmq');
const logger = require('../utils/logger');

// Redis connection config
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

const QUEUE_NAME = 'email-queue';

// Log startup
console.log('📧 Email Worker Starting...');
console.log(`📧 Connecting to Redis: ${redisConfig.host}:${redisConfig.port}`);

// Create email worker
const emailWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { to, subject, text, html } = job.data;

    console.log(`📧 Processing email job ${job.id}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Attempt: ${job.attemptsMade + 1}`);

    try {
      // Simulate email sending (replace with actual nodemailer in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 [DEV MODE] Email would be sent to: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Text: ${text}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`✅ Email job ${job.id} completed successfully`);
        return { success: true, messageId: `dev-${Date.now()}` };
      }

      // Production: Use nodemailer
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to,
        subject,
        text,
        html: html || text,
      });

      console.log(`✅ Email job ${job.id} completed: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error(`❌ Email job ${job.id} failed:`, error.message);
      throw error; // Will trigger retry
    }
  },
  {
    connection: redisConfig,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// Event listeners
emailWorker.on('ready', () => {
  console.log('📧 Email worker ready and waiting for jobs...');
});

emailWorker.on('completed', (job, result) => {
  console.log(`✅ Email job ${job.id} completed`, result);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job?.id} failed after ${job?.attemptsMade} attempts:`, err.message);
});

emailWorker.on('error', (err) => {
  console.error('❌ Email worker error:', err.message);
});

emailWorker.on('stalled', (jobId) => {
  console.warn(`⚠️ Email job ${jobId} stalled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📧 Email worker shutting down...');
  await emailWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📧 Email worker shutting down...');
  await emailWorker.close();
  process.exit(0);
});

console.log('📧 Email Worker Started Successfully!');
console.log(`📧 Listening for jobs on queue: ${QUEUE_NAME}`);

module.exports = emailWorker;
