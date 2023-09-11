import { IBaseRepository } from '@/interfaces/baseRepository.interface';
import { IParameter, SortType } from '@/interfaces/parameters.interface';
import { Model } from 'mongoose';

export default class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(params?: IParameter, populate?: any[]): Promise<T[]> {
    const filters = params?.filters || {};
    const sortField = params?.sort?.sort_field || 'createdAt';
    const sortType = params?.sort?.sort_type || SortType.DESC;
    const page = Number(params?.paginate?.page) || 1;
    const perPage = Number(params?.paginate?.per_page) || 10;

    return await this.model
      .find(filters)
      .sort({ [sortField]: sortType || SortType.DESC })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate(populate)
      .exec();
  }

  async findOne(filter = {}): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async create(data: any): Promise<T | any> {
    const model = new this.model(data);
    return await model.save();
  }

  async update(id: string, data: any): Promise<T | null> {
    const options = { new: true };
    return await this.model.findByIdAndUpdate(id, data, options).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    const data = { deletedAt: new Date() };
    const options = { new: true };
    return await this.model.findByIdAndUpdate(id, data, options).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
