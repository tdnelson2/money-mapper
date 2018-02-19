import { MonthlyRecurrenceMapperService } from './monthly-recurrence-mapper.service';
import { Payday } from './payday';

import { Injectable } from '@angular/core';

@Injectable()
export class PayRecurrenceService {

  constructor() { }

	buildResults(payday: Payday, numberOfDays:number=365) {

    // Fill in missing info on this Payday instance
		payday.endDate = new Date(payday.nextPayday.getTime() + (numberOfDays * 86400000));
		payday.normalMonthlyPayAmount = payday.paycheckAmount * 2;
		payday.outlierMonthPayAmount = payday.paycheckAmount * 3;

    // Get monthly recurrence data (number of times you get paid each month)
  	payday.mappedMonths = MonthlyRecurrenceMapperService.mapToMonths(payday.nextPayday, payday.endDate, 14);

    // Find the months in which you get paid 3 times
  	for (let month of payday.mappedMonths) {
  		if (month.recurrenceCount === 3) {
  			payday.outlierMonths.push(month);
  		}
  	}

    this.buildOutlierMonthsPhrase(payday);

  	payday.totalExtraPay = payday.outlierMonths.length * payday.paycheckAmount;

    return payday;
	}


  // Build a phrase listing outlier months such as 'February and June'
  // or 'June, September and December' depending

  buildOutlierMonthsPhrase(payday: Payday):void {
    let extraCount = payday.outlierMonths.length;
    let phrase: string = '';
    let months : string[] = payday.outlierMonths.map(m => m.name);

    if (extraCount === 1) {
      phrase = months[0];
    } else if (extraCount === 2) {
      phrase = months.join(' and ');
    } else if (extraCount > 2) {
      let part1 = months
                   .slice(0, extraCount - 1)
                   .join(', ');
      phrase = part1 + ' and ' + months[extraCount-1];
    }
    payday.extraMonthsPhrase = phrase
  }

}
