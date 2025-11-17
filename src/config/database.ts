import mongoose from 'mongoose';
import { config } from './env';
import logger from '../utils/logger';

class Database {
  private static instance: Database;
  private retries = 0;
  private maxRetries = 5;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      mongoose.set('strictQuery', false);

      await mongoose.connect(config.mongodb.uri, {
        maxPoolSize: config.mongodb.maxPoolSize,
        minPoolSize: config.mongodb.minPoolSize,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info('MongoDB connected');
      this.retries = 0;
      this.setupEvents();
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      await this.retry();
    }
  }

  private setupEvents(): void {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected');
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private async retry(): Promise<void> {
    if (this.retries < this.maxRetries) {
      this.retries++;
      const delay = Math.min(1000 * Math.pow(2, this.retries - 1), 30000);
      logger.warn(`Retrying connection (${this.retries}/${this.maxRetries}) in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      await this.connect();
    } else {
      logger.error('Max retries reached. Exiting.');
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
  }

  public getConnectionStatus(): string {
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export default Database.getInstance();
