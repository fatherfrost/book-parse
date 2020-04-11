import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://alex:123456QA@ds157521.mlab.com:57521/books'), BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
