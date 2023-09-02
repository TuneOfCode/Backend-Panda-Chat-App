import { FilterOperatorType } from '@/interfaces/parameters.interface';
import { Request } from 'express';

class BaseFilter {
  protected fieldsInModel: string[];
  protected allowedFields: string[];
  protected relations: string[];

  protected filterOperatorType: FilterOperatorType;

  constructor(fieldsInModel: string[], allowedFields: string[] = [], relations: string[] = []) {
    this.fieldsInModel = fieldsInModel;
    this.allowedFields = allowedFields.length === 0 ? fieldsInModel : allowedFields;
    this.relations = relations;
  }

  protected operators = {
    eq: '$eq',
    gt: '$gt',
    gte: '$gte',
    lt: '$lt',
    lte: '$lte',
    like: '$regex',
  };

  public transform(request: Request) {
    let filters: any = {};
    let filterItems: any = {};
    let orQuery = [];
    let andQuery = [];
    const { operator_type, sort_field, sort_type, page, per_page, ...query } = request.query;

    if (operator_type) {
      this.filterOperatorType = operator_type.toString().toLowerCase() === 'and' ? FilterOperatorType.AND : FilterOperatorType.OR;
    } else {
      this.filterOperatorType = FilterOperatorType.OR;
    }
    // console.log('===> Fiels in model:::', this.fieldsInModel);

    for (let key in query) {
      const formatField = key.toString().toLowerCase().replace(/_/g, '');
      const field = this.fieldsInModel.find(item => item.toString().toLowerCase() === formatField) || key;
      // console.log('===> key:::', key);
      // console.log('===> field:::', field);

      if (field === 'search') {
        const value = query[key];
        filters = {
          name: { $regex: value, $options: 'i' },
        };
        return filters;
      }

      if (this.allowedFields.includes(field) && this.fieldsInModel.includes(field)) {
        let operator = Object.keys(query[key])[0];
        // console.log('===> operator:::', operator);
        if (!operator || !this.operators[operator]) {
          operator = 'like';
        }

        const value = query[key][operator] || query[key];
        // console.log('===> value:::', value);
        const operaterInMongoose = this.operators[operator];
        // console.log('===> operaterInMongoose:::', operaterInMongoose);
        let filterItem = {
          [field]: {
            [operaterInMongoose]: value,
          },
        };

        if (operaterInMongoose === '$eq') {
          filterItem = {
            [field]: value,
          };
        }

        if (operaterInMongoose === '$regex') {
          const like = { $regex: value, $options: 'i' };
          filterItem = {
            [field]: like,
          };
        }
        console.log('===> filterItem:::', filterItem);

        orQuery.push(filterItem);
        andQuery.push(filterItem);

        filterItems = {
          ...filterItems,
          ...filterItem,
        };
      }
    }

    // console.log('===> orQuery:::', orQuery);
    // console.log('===> andQuery:::', andQuery);
    // console.log('===> filterItems:::', filterItems);

    if (orQuery.length > 0 && andQuery.length > 0) {
      if (this.filterOperatorType === FilterOperatorType.AND) {
        filters = {
          $and: andQuery,
          $or: orQuery,
        };
        return filters;
      }

      filters = {
        $or: orQuery,
      };
      return filters;
    }

    // console.log('===> filters:::', filters);

    return filters;
  }
}

export default BaseFilter;
