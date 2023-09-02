import { ConnectOptions } from 'mongoose';
import { RedisClientOptions } from 'redis';

type ConnectionOptionsExtend = {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
};
export interface IDbConnection {
  url: string;
  options?: ConnectOptions & ConnectionOptionsExtend;
}

export interface ICacheConnection {
  url: string;
  options?: RedisClientOptions;
}
