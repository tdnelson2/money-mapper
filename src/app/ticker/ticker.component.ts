import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { TickerWebsocketService } from '../ticker-websocket.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit, OnDestroy {

  messages = [];
  connection;
  message;

  constructor(private tickerService: TickerWebsocketService) {}

  ngOnInit() {
    this.connection = this.tickerService.getMessages().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    })
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.connection.unsubscribe();
  }

//   constructor(private tickerService: TickerWebsocketService) {}

//   ngOnInit() {
//     this.tickerService.getMessages().subscribe(data => {
//       console.log('ticker message: ',data);
//     });

//     this.tickerService.connect().subscribe(() => {
//       console.log('ticker connected');
//     });

//     this.tickerService.disconnect().subscribe(() => {
//       console.log('ticker disconnected');
//     })
//   }

}
