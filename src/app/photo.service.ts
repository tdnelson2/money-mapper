import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PhotoService {

  private photoList = 'https://picsum.photos/list';

  constructor(private http: HttpClient) { }

  public fetchPhotos():Observable<any> {
    return this.http.get(this.photoList);
  }

}
