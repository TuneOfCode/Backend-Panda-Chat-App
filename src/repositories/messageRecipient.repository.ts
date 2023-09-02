import { IMessageRecipient } from '@/interfaces/messageRecipients.interface';
import messageRecipientModel from '@/models/messageRecipients.model';
import BaseRepository from './base.repository';

export default class MessageRecipientRepository extends BaseRepository<IMessageRecipient> {
  constructor() {
    super(messageRecipientModel);
  }
}
