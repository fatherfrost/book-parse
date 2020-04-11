import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as xml2js from 'xml2js';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookInterface } from './interfaces/book.interface';

@Injectable()
export class BooksService {
  constructor(@InjectModel('Book') private bookModel: Model<BookInterface>) {}

  parser: xml2js.Parser = new xml2js.Parser();
  async parseOne() {
    const bookData = await this.readFile('./cache/epub/2/pg2.rdf');
    const bookInfo =  await this.extractDataFromRdf(bookData);
    const saveBook = new this.bookModel(bookInfo);
    return saveBook.save();
  }

  async parseAll() {
    const result =[];
    const books = await this.getFiles('./cache/epub', []).filter(file => path.extname(file) === '.rdf');
    for (const book of books) {
      const bookData = await this.readFile(book);
      const bookInfo = await this.extractDataFromRdf(bookData);
      if (bookInfo['title']) {
        const saveBook = new this.bookModel(bookInfo);
        const saved = await saveBook.save();
        result.push(saved);
      }
    }
    return result;
  }

  extractDataFromRdf(data) {
    return new Promise((resolve, reject) => {
      const bookObject = {};
      this.parser.parseString(data, (err, res) => {
        bookObject['publisher'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:publisher'][0] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:publisher'][0]: '' ;
        bookObject['title'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:title'][0] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:title'][0] : '';
        bookObject['author'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:creator'][0]['pgterms:agent'][0]['pgterms:name'][0] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:creator'][0]['pgterms:agent'][0]['pgterms:name'][0] : '';
        bookObject['license'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:license'][0] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:license'][0]['$'] : '';
        bookObject['subject'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:subject'][0]['rdf:Description'][0]['rdf:value'] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:subject'][0]['rdf:Description'][0]['rdf:value'] :'';
        bookObject['language'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:language'][0] !== undefined ? res['rdf:RDF']['pgterms:ebook'][0]['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0] : '';
        const obj = bookObject['language'];
        bookObject['language'] = obj[Object.keys(obj)[0]];
        resolve(bookObject);
      });
    }).then(result => {
      return result;
    }).catch(err => {
      return {};
    })
  }

  readFile(path: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (error, data) => {
        if (error) reject();
        if (data) resolve(data);
      })
    })
  }

  getFiles(dir, files_){
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const i in files){
      const name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
        this.getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    return files_;
  };
}
