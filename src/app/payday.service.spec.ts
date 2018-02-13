import { TestBed, inject } from '@angular/core/testing';

import { PaydayService } from './payday.service';

describe('PaydayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaydayService]
    });
  });

  it('should be created', inject([PaydayService], (service: PaydayService) => {
    expect(service).toBeTruthy();
  }));
});
