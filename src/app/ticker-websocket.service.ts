import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class TickerWebsocketService {

  private url = 'https://api.iextrading.com/1.0/market';
  private socket;

   getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);   
      });
      return () => {
        this.socket.disconnect();
      }; 
    })    
    return observable;
  }

  // private websocket;

  // constructor() {
  // 		this.websocket = io('https://api.iextrading.com/1.0/market');
  // }


  // public getMessages() {
  //   return Observable.create((observer) => {
  //     this.websocket.on('message', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  // public connect() {
  //   return Observable.create((observer) => {
  //     this.websocket.on('connect', () => {
  //       observer.next();
  //     });
  //   });
  // }

  // public disconnect() {
  //   return Observable.create((observer) => {
  //     this.websocket.on('disconnect', (reason) => {
  //       observer.next(reason);
  //     });
  //   });
  // }

}
