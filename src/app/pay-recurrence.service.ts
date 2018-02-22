import { mapToMonths } from './monthly-recurrence-mapper';
import { Payday } from './payday';
import { arrayToSentence } from './array-to-sentence';

import { Injectable } from '@angular/core';

@Injectable()
export class PayRecurrenceService {

  constructor() { }

	buildResults(payday: Payday, numberOfDays:number=365) {

    // Fill in missing info on this Payday instance
		payday.endMoment = payday.nextPaydayMoment().clone().add(numberOfDays, 'days');
    payday.normalNumberOfPeriods = Math.floor(30.42/payday.frequencyInDays);
		payday.normalMonthlyPayAmount = payday.paycheckAmount * payday.normalNumberOfPeriods;
		payday.outlierMonthPayAmount = payday.paycheckAmount * (payday.normalNumberOfPeriods+1);

    // Clear the arrays to mitigate the possiblity
    // of old data being added to new data.
    payday.outlierMonths = [];
    payday.mappedMonths = [];

    // Get monthly recurrence data (number of times you get paid each month)
  	payday.mappedMonths = mapToMonths(payday.nextPaydayMoment(),
                                      payday.endMoment,
                                      payday.frequencyInDays);

    let extraPeriods = 0;

    // Find the outlier months
  	for (let month of payday.mappedMonths) {
  		if (month.recurrenceCount > payday.normalNumberOfPeriods) {
        console.log(`extra period for ${month.name} is ${month.recurrenceCount - payday.normalNumberOfPeriods}\n normal numer of paydays is ${payday.normalNumberOfPeriods} \n this month's number of paydays is ${month.recurrenceCount}\n\n`);
        extraPeriods = extraPeriods + (month.recurrenceCount - payday.normalNumberOfPeriods);
  			payday.outlierMonths.push(month);
  		}
  	}

    const months = payday.outlierMonths.map(m => m.name);
    payday.extraMonthsPhrase = arrayToSentence(months);

  	payday.totalExtraPay = extraPeriods * payday.paycheckAmount;

    return payday;
	}

}
