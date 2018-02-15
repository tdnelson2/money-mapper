import { TestBed, inject } from '@angular/core/testing';

import { MonthlyRecurrenceMapperService } from './monthly-recurrence-mapper.service';

describe('MonthlyRecurrenceMapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthlyRecurrenceMapperService]
    });
  });

  it('should be created', inject([MonthlyRecurrenceMapperService], (service: MonthlyRecurrenceMapperService) => {
    expect(service).toBeTruthy();
  }));
});
