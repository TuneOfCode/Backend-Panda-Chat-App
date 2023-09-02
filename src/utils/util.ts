import { connectToRedis } from '@/cache';
import { redisConst } from '@/constants';
import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};
/**
 *
 * @param {string} id
 * @returns {boolean} true & false
 * @description this value is Mongo ObjectId Check
 */
export const isMongoObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
/**
 *
 * @param {string} key
 * @param {string | object} value
 * @param {number} expiredTime
 * @returns {Promise<void>}
 * @description redis cache set
 */
export const setCache = async (key: string, value: string | object, expiredTime?: number) => {
  const client = await connectToRedis();

  const formatValue = typeof value === 'object' ? JSON.stringify(value) : value;
  await client.setEx(key, expiredTime ?? redisConst.EXPIRED_TIME, formatValue);

  await client.disconnect().then(() => {
    logger.info('Redis client disconnected in setCache');
  });
};
/**
 *
 * @param {string} key
 * @returns {Promise}
 * @description redis cache get
 */
export const getCache = async (key: string) => {
  const client = await connectToRedis();

  const cacheData = await client.get(key);
  const result = cacheData ? JSON.parse(cacheData) : null;

  await client.disconnect().then(() => {
    logger.info('Redis client disconnected in getCache');
  });

  return result;
};
/**
 *
 * @param {string[]} keys
 * @returns {Promise<void>}
 * @description redis cache delete
 */
export const delCache = async (keys: string[]) => {
  const client = await connectToRedis();

  keys.forEach(async key => {
    if (key) {
      await client.del(key);
      logger.info(`delete cache key: ${key}`);
    }
  });

  // await client.disconnect().then(() => {
  //   logger.info('Redis client disconnected in delCache');
  // });
};
