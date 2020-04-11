import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/parse')
  async parseOne() {
    return await this.booksService.parseOne();
  }

  @Get('/parseAll')
  async parse() {
    return await this.booksService.parseAll();
  }
}
