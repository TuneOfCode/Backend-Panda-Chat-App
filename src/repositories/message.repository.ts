import { IMessage } from '@/interfaces/messages.interface';
import messageModel from '@/models/messages.model';
import BaseRepository from './base.repository';

export default class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(messageModel);
  }
}
