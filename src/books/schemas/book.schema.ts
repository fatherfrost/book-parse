import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publisher: String,
  language: String,
  subject: Object,
  license: Object,
});
