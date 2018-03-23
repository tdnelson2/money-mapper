import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { MMIndexedDB } from './mm-indexeddb';

@Injectable()
export class NytimesService {

  private nytKey = "6a6abed21d7d4ab081909e80793e5bdd";
  private nytURL =
  `https://api.nytimes.com/svc/news/v3/content/all/business%20day.json?api-key=${this.nytKey}`;
  public db: MMIndexedDB;

  constructor(private http: HttpClient) {
    this.db = new MMIndexedDB('nyt', 'nyts', 1, 'slug_name', 'created_date', 20);
  }

  public fetchStories():Observable<any> {
    return this.http.get(this.nytURL);
  }

}
