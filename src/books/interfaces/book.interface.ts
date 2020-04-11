import { Document } from 'mongoose';

export interface BookInterface extends Document{
  publisher: string,
  title: string,
  author: object,
  language: string,
  subject: object,
  license: object,
}
