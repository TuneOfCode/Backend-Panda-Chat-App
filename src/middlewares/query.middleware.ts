import { IParameter, RequestWithQuery, SortType } from '@/interfaces/parameters.interface';
import { NextFunction, Response } from 'express';

const queryMiddleware = (req: RequestWithQuery, res: Response, next: NextFunction) => {
  const sortType = req.query.sort_type?.toString() === SortType.ASC ? SortType.ASC : SortType.DESC;
  const params: IParameter = {
    sort: {
      sort_field: req.query.sort_field?.toString(),
      sort_type: sortType,
    },
    paginate: {
      page: req.query.page?.toString(),
      per_page: req.query.per_page?.toString(),
    },
  };

  req.queryParams = params;
  next();
};

export default queryMiddleware;
