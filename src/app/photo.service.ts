import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import idb from 'idb';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PhotoService {

  private photoList = 'https://picsum.photos/list';
  private dbPromise: Promise<any>;
  private dbName = 'mm-photo';
  private dbStoreName = 'mm-photos';

  constructor(private http: HttpClient) {
    // this.dbPromise = this.openDatabase();
  }

  public fetchPhotos():Observable<any> {
    return this.http.get(this.photoList);
  }

  // public openDatabase():Promise<any> {
  //   if (!navigator.serviceWorker) {
  //     return Promise.resolve();
  //   }

  //   return idb.open(this.dbName, 1, upgradeDb => {
  //     const store = upgradeDb.createObjectStore(this.dbStoreName, {
  //       keyPath: 'id'
  //     });
  //     store.createIndex('by-date', 'date-added');
  //   });
  // }

  // public getCachedStories(): Promise<any> {
  //   return this.dbPromise.then(db => {
  //     if(!db) return;
  //     const index = db.transaction('nyts')
  //       .objectStore('nyts').index('by-date');

  //     return index.getAll().then(stories => {
  //       this.addStories(stories.reverse());
  //     });
  //   });
  // }

}
