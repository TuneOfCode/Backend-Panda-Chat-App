import { Request } from 'express';

export enum UploadExtType {
  IMAGE = 'image',
  VIDEO = 'video',
  OTHER = 'other',
  ALL = 'all',
}

export interface IUploadFile {
  allowedExtType: UploadExtType;
  maxCount?: number;
  maxSize?: number;
  savePath?: string;
}

export interface IFileUploaded {
  filename: string;
  url: string;
  extension?: string;
  path?: string;
}
