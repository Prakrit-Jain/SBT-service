import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import logger from './utils/logger';
import database from './config/database';

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin === '*' ? '*' : config.cors.origin.split(','),
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req: Request) => req.path === '/health',
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(requestLogger);

app.get('/health', (req: Request, res: Response) => {
  try {
    const dbStatus = database.getConnectionStatus();
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: config.env,
      database: {
        status: dbStatus,
        connected: dbStatus === 'connected',
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      version: '1.0.0',
    };
    res.status(dbStatus === 'connected' ? 200 : 503).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
