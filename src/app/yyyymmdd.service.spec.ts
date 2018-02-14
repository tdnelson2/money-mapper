import { TestBed, inject } from '@angular/core/testing';

import { YyyymmddService } from './yyyymmdd.service';

describe('YyyymmddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YyyymmddService]
    });
  });

  it('should be created', inject([YyyymmddService], (service: YyyymmddService) => {
    expect(service).toBeTruthy();
  }));
});
