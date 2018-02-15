import { TestBed, inject } from '@angular/core/testing';

import { PayRecurrenceService } from './pay-recurrence.service';

describe('PayRecurrenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayRecurrenceService]
    });
  });

  it('should be created', inject([PayRecurrenceService], (service: PayRecurrenceService) => {
    expect(service).toBeTruthy();
  }));
});
