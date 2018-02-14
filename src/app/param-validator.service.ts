import { Injectable } from '@angular/core';

import { YyyymmddService } from './yyyymmdd.service';
import { FrequencyOptionsService } from './frequency-options.service';

@Injectable()
export class ParamValidatorService {

  constructor(
  	private yyyymmdd: YyyymmddService,
  	private frequencyOptions: FrequencyOptionsService
  	) { }



	public validateParams(pay: string, date: string, frequency: string): boolean {
	    if (+pay !== NaN && 
	    	  this.yyyymmdd.isValidDate(date) && 
	    	  this.frequencyOptions.isOption(frequency)) 
	    	  return true; return false;
	}

}
