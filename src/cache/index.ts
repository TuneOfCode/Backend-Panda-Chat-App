import { CACHE_HOST, CACHE_PORT } from '@/config';
import { ICacheConnection } from '@/interfaces/config.interface';
import { logger } from '@/utils/logger';
import { createClient } from 'redis';

export const cacheConnection: ICacheConnection = {
  url: `redis://${CACHE_HOST}:${CACHE_PORT}`,
  options: {
    socket: {
      host: CACHE_HOST,
      port: Number(CACHE_PORT),
      tls: false,
    },
  },
};

export const connectToRedis = async () => {
  const client = createClient({
    url: cacheConnection.url,
    socket: cacheConnection.options.socket,
  });

  client.on('error', error => {
    logger.error(`Redis connection error: ${error}`);
  });

  await client.connect().then(() => {
    logger.info('Redis client connected');
  });

  return client;
};
