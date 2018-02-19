import { TestBed, inject } from '@angular/core/testing';

import { PaydaySessionDataService } from './payday-session-data.service';

describe('PaydaySessionDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaydaySessionDataService]
    });
  });

  it('should be created', inject([PaydaySessionDataService], (service: PaydaySessionDataService) => {
    expect(service).toBeTruthy();
  }));
});
