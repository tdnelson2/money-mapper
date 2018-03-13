import { TestBed, inject } from '@angular/core/testing';

import { TickerWebsocketService } from './ticker-websocket.service';

describe('TickerWebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TickerWebsocketService]
    });
  });

  it('should be created', inject([TickerWebsocketService], (service: TickerWebsocketService) => {
    expect(service).toBeTruthy();
  }));
});
