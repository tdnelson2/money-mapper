import { TestBed, inject } from '@angular/core/testing';

import { FrequencyOptionsService } from './frequency-options.service';

describe('FrequencyOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrequencyOptionsService]
    });
  });

  it('should be created', inject([FrequencyOptionsService], (service: FrequencyOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
