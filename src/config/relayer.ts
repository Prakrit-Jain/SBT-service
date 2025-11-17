import axios, { AxiosInstance } from 'axios';
import { config } from './env';
import logger from '../utils/logger';

class RelayerClient {
  private static instance: RelayerClient;
  public client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: config.relayer.baseUrl,
      timeout: config.relayer.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): RelayerClient {
    if (!RelayerClient.instance) {
      RelayerClient.instance = new RelayerClient();
    }
    return RelayerClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Relayer API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Relayer API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Relayer API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest._retryCount) {
          originalRequest._retryCount = 0;
        }

        // Retry logic for network errors
        if (
          error.code === 'ECONNABORTED' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ENOTFOUND' ||
          error.code === 'ECONNREFUSED'
        ) {
          if (originalRequest._retryCount < config.relayer.maxRetries) {
            originalRequest._retryCount++;
            logger.warn(
              `Retrying Relayer API request (${originalRequest._retryCount}/${config.relayer.maxRetries})`
            );

            const retryDelay = Math.min(1000 * Math.pow(2, originalRequest._retryCount), 10000);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));

            return this.client(originalRequest);
          }
        }

        logger.error('Relayer API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        return Promise.reject(error);
      }
    );
  }
}

export default RelayerClient.getInstance();
