import { TestBed, inject } from '@angular/core/testing';

import { NytimesService } from './nytimes.service';

describe('NytimesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NytimesService]
    });
  });

  it('should be created', inject([NytimesService], (service: NytimesService) => {
    expect(service).toBeTruthy();
  }));
});
