import { mapToMonths } from './monthly-recurrence-mapper';
import { Payday } from './payday';
import { arrayToSentence } from './array-to-sentence';

import { Injectable } from '@angular/core';

@Injectable()
export class PayRecurrenceService {

  constructor() { }

	buildResults(payday: Payday, numberOfDays:number=365) {

    // Fill in missing info on this Payday instance
		payday.endDate = new Date(payday.nextPayday.getTime() + (numberOfDays * 86400000));
		payday.normalMonthlyPayAmount = payday.paycheckAmount * 2;
		payday.outlierMonthPayAmount = payday.paycheckAmount * 3;

    // Reset in case user is looking for the second time
    // in the same session.
    payday.outlierMonths = [];
    payday.mappedMonths = [];

    // Get monthly recurrence data (number of times you get paid each month)
  	payday.mappedMonths = mapToMonths(payday.nextPayday, payday.endDate, 14);

    // Find the months in which you get paid 3 times
  	for (let month of payday.mappedMonths) {
  		if (month.recurrenceCount === 3) {
  			payday.outlierMonths.push(month);
  		}
  	}

    const months = payday.outlierMonths.map(m => m.name);
    payday.extraMonthsPhrase = arrayToSentence(months);

  	payday.totalExtraPay = payday.outlierMonths.length * payday.paycheckAmount;

    return payday;
	}

}
