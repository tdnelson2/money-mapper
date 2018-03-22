import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

// import idb from 'idb';

import { MMIndexedDB } from './mm-indexeddb';

@Injectable()
export class NytimesService {

  private nytKey = "6a6abed21d7d4ab081909e80793e5bdd";
  private nytURL =
  `https://api.nytimes.com/svc/news/v3/content/all/business%20day.json?api-key=${this.nytKey}`;
  // private dbPromise: Promise<any>;
  // public slugs: string[] = [];
  // public stories: any[] = [];
  public db: MMIndexedDB;

  constructor(private http: HttpClient) {
    // this.dbPromise = this.openDatabase();
    this.db = new MMIndexedDB('nyt', 'nyts', 1, 'slug_name', 'created_date', 20);
  }

  public fetchStories():Observable<any> {
    return this.http.get(this.nytURL);
  }

  // openDatabase():Promise<any> {
  //   if (!navigator.serviceWorker) {
  //     return Promise.resolve();
  //   }

  //   return idb.open('nyt', 1, upgradeDb => {
  //     const store = upgradeDb.createObjectStore('nyts', {
  //       keyPath: 'slug_name'
  //     });
  //     store.createIndex('by-date', 'created_date');
  //   });
  // }

  // public updateDB(stories) {
  //   this.dbPromise.then(db => {
  //     if (!db) return;

  //     const tx = db.transaction('nyts', 'readwrite');
  //     const store = tx.objectStore('nyts');
  //     for (let story of stories) {
  //       store.put(story);
  //     }

  //     // limit to 20 items
  //     store.index('by-date').openCursor(null, 'prev').then(cursor => {
  //       return cursor.advance(20);
  //     }).then(function deleteRest(cursor) {
  //       if (!cursor) return;
  //       cursor.delete();
  //       return cursor.continue().then(deleteRest);
  //     });
  //   });
  // }

  // public getCachedStories(): Promise<any> {
  //   if (!navigator.serviceWorker) {
  //     return Promise.resolve();
  //   }
  //   return this.dbPromise.then(db => {
  //     if(!db) return;
  //     const index = db.transaction('nyts')
  //       .objectStore('nyts').index('by-date');

  //     return index.getAll().then(stories => {
  //       this.addStories(stories.reverse());
  //     });
  //   });
  // }

  // public addStories(stories: any[]): void {
  //   for (let story of stories) {
  //     if (!this.slugs.includes(story.slug_name)) {
  //       this.slugs.push(story.slug_name);
  //       this.stories.push(story);
  //     }
  //   }
  // }

}
