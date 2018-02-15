import { MonthlyRecurrenceMapperService } from './monthly-recurrence-mapper.service';
import { Payday } from './payday';

import { Injectable } from '@angular/core';

@Injectable()
export class PayRecurrenceService {

  constructor(private recurrenceMapper = MonthlyRecurrenceMapperService) { }

	public buildResults(payday: Payday, rangeInDays:number=365) {
		payday.endDate = new Date(payday.nextPayday.getTime() + (rangeInDays * 86400000));
		payday.normalMonthlyPayAmount = payday.paycheckAmount * 2;
		payday.outlierMonthPayAmount = payday.normalMonthlyPayAmount * 3;
	  	let results = this.recurrenceMapper.mapToMonths(payday.nextPayday, payday.endDate, 14);
	  	for (var i = 0; i < results.length; i++) {
	  		let result = results[i];
	  		if (result.recurrenceCount === 3) {
	  			payday.outlierMonths.push(result.month);
	  		}
	  	}

  	let extraCount = payday.outlierMonths.length;
    let phrase: string = '';

  	if (extraCount === 1) {
  		phrase = payday.outlierMonths[0].;
  	} else if (extraCount === 2) {
  		phrase = payday.outlierMonths.join(' and ');
  	} else if (extraCount > 2) {
  		let part1 = payday.outlierMonths
		                  .slice(0, extraCount - 1)
		                  .join(', ');
  		payday.extraMonthsPhrase = part1 + ' and ' + payday.outlierMonths[extraCount-1];
  	}

  	payday.totalExtraPay = extraCount * payday.normalMonthlyPayAmount;

    return payday;
	}

}
