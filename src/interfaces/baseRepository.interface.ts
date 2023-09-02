export interface IBaseRepository<T> {
  // create a new record
  create(item: T): Promise<T>;
  // update an existing record
  update(id: string, item: T): Promise<T>;
  // soft delete a record
  softDelete(id: string): Promise<T>;
  // delete a record
  delete(id: string): Promise<void>;
  // find a record
  findOne(filter): Promise<T>;
  // retrieve all records
  find(filter): Promise<T[]>;
}
