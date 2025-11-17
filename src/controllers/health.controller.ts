import { Request, Response } from 'express';
import database from '../config/database';
import logger from '../utils/logger';

/**
 * Health check endpoint
 * GET /health
 */
export const healthCheck = (req: Request, res: Response): void => {
  try {
    const databaseStatus = database.getConnectionStatus();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: databaseStatus,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      version: '1.0.0',
    };

    const statusCode = databaseStatus === 'connected' ? 200 : 503;

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Error in health check:', error);

    res.status(500).json({
      status: 'unhealthy',
      error: 'Failed to check health',
      timestamp: new Date().toISOString(),
    });
  }
};
