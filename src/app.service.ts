import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as xml2js from 'xml2js';

@Injectable()
export class AppService {
  async parse() {
    console.log('in service');
    const bookData = await this.readFile();
    return await this.extractDataFromRdf(bookData);
  }

  extractDataFromRdf(data) {
    const bookObject = {};
    return new Promise((resolve, reject) => {
      this.parser.parseString(data, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        else {
          bookObject['publisher'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:publisher'][0] ?? '';
          bookObject['title'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:title'][0] ?? '';
          bookObject['author'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:creator'][0] ?? '';
          bookObject['license'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:license'][0] ?? '';
          bookObject['subject'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:subject'][0] ?? '';
          bookObject['language'] =  res['rdf:RDF']['pgterms:ebook'][0]['dcterms:language'][0] ?? '';
          console.log(bookObject['publisher']);
          resolve(bookObject);
        }
      });
    })
  }

  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile('book.rdf', 'utf8', (error, data) => {
        if (error) {
          console.log(error);
          reject();
        }
        if (data) resolve(data);
      })
    })
  }
}
