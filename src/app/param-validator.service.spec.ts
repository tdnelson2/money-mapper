import { TestBed, inject } from '@angular/core/testing';

import { ParamValidatorService } from './param-validator.service';

describe('ParamValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamValidatorService]
    });
  });

  it('should be created', inject([ParamValidatorService], (service: ParamValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
