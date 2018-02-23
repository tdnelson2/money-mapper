import { mapToMonths } from './monthly-recurrence-mapper';
import { Payday } from './payday';
import { arrayToSentence } from './array-to-sentence';
import { Month } from './month';

import { Injectable } from '@angular/core';

@Injectable()
export class PayRecurrenceService {

  constructor() { }

	buildResults(payday: Payday, numberOfDays:number=365) {

    // Fill in missing info on this Payday instance
		payday.endMoment = payday.nextPaydayMoment().clone().add(numberOfDays, 'days');
    payday.lowNumberOfPeriods = Math.floor(30.42/payday.frequencyInDays);
		payday.lowMonthPayAmount = payday.paycheckAmount * payday.lowNumberOfPeriods;
		payday.highMonthPayAmount = payday.paycheckAmount * (payday.lowNumberOfPeriods+1);

    // Clear the arrays to mitigate the possiblity
    // of old data being added to new data.
    payday.highMonths = [];
    payday.lowMonths = [];
    payday.mappedMonths = [];

    // Get monthly recurrence data (number of times you get paid each month)
  	payday.mappedMonths = mapToMonths(payday.nextPaydayMoment(),
                                      payday.endMoment,
                                      payday.frequencyInDays);

    let highPeriods = 0;
    let lowPeriods = 0;

    // Find the outlier months
  	for (let month of payday.mappedMonths) {
  		if (month.recurrenceCount > payday.lowNumberOfPeriods) {
        console.log(`high period for ${month.name} is ${month.recurrenceCount - payday.lowNumberOfPeriods}\n low numer of paydays is ${payday.lowNumberOfPeriods} \n this month's number of paydays is ${month.recurrenceCount}\n\n`);
        highPeriods = highPeriods + (month.recurrenceCount - payday.lowNumberOfPeriods);
        payday.highMonths.push(month);
  		} else {
        console.log(`low period for ${month.name} is 1\n high numer of paydays is ${payday.lowNumberOfPeriods+1} \n this month's number of paydays is ${month.recurrenceCount}\n\n`);
        lowPeriods = lowPeriods + 1;
        payday.lowMonths.push(month);
      }
  	}

    payday.outlierMonthsAreHigh = payday.highMonths.length <= payday.lowMonths.length;

    const highMonths = payday.highMonths.map(m => m.name);
    payday.highMonthsPhrase = arrayToSentence(highMonths);

    const lowMonths = payday.lowMonths.map(m => m.name);
    payday.lowMonthsPhrase = arrayToSentence(lowMonths);

  	payday.totalHighPay = highPeriods * payday.paycheckAmount;

    return payday;
	}

}
