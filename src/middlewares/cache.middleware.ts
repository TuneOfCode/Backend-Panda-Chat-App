import { getCache } from '@/utils/util';
import { NextFunction, Request, Response } from 'express';

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = req.originalUrl;
  const isMethodGet = req.method.toLowerCase() === 'get';
  const data = await getCache(cacheKey);

  // check if cache exists
  if (isMethodGet && data) {
    return res.status(200).json({ data, message: `Cache data of ${cacheKey}` });
  }

  next();
};

export default cacheMiddleware;
