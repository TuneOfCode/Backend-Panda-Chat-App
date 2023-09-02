import { Request } from 'express';

export enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ISort {
  sort_field: string;
  sort_type?: SortType;
}

export interface IPaginate {
  page: number | string;
  per_page: number | string;
}

export enum FilterOperatorType {
  AND = '$and',
  OR = '$or',
}

export interface IFilter {
  operator_type?: FilterOperatorType;
  [key: string]: any;
}

export interface IParameter {
  filters?: IFilter;
  sort?: ISort;
  paginate?: IPaginate;
}

export interface RequestWithQuery extends Request {
  queryParams?: IParameter;
}
