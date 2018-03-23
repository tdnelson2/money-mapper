import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { MMIndexedDB } from './mm-indexeddb';

import idb from 'idb';

@Injectable()
export class PhotoService {

  private photoList = 'https://picsum.photos/list';
  public db: MMIndexedDB;
  private dbName = 'mm-photo';
  private dbStoreName = 'mm-photos';
  private contentImgsCache = 'mm-content-imgs';

  constructor(private http: HttpClient) {
    this.db = new MMIndexedDB(this.dbName, this.dbStoreName, 1, 'id', 'date_added', 30);

    // Remove cached images not referenced in the db
    this.cleanImageCache();
    setInterval(() => {
      this.cleanImageCache();
    }, 1000 * 60 * 5);
  }

  public fetchPhotos():Observable<any> {
    return this.http.get(this.photoList);
  }

  private cleanImageCache(): Promise<any> {
    return this.db.dbPromise.then(db => {
      if (!db) return;

      let photosNeeded = [];
      const tx = db.transaction(this.dbStoreName);
      return tx.objectStore(this.dbStoreName).getAll().then(photos => {
        photos.forEach(photo => {
          photosNeeded.push(`https://picsum.photos/?image=${photo.id}`);
        });

        return caches.open(this.contentImgsCache);
      }).then(cache => {
        return cache.keys().then(requests => {
          requests.forEach(request => {
             if(!photosNeeded.includes(request.url)) {
               console.log('cached image deleted: ', request);
               cache.delete(request);
             }
          });
        });
      });
    });
  }

}
