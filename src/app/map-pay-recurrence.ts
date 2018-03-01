import { mapMonthlyRecurrences }  from './map-monthly-recurrences';
import { PaydayService }          from './payday.service';
import { arrayToSentence }        from './array-to-sentence';
import { Month }                  from './month';


export const mapPayRecurrence = (payday: PaydayService,
                              numberOfDays: number=365):PaydayService => {

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
  payday.mappedMonths = mapMonthlyRecurrences(payday.nextPaydayMoment(),
                                              payday.endMoment,
                                              payday.frequencyInDays);

  let highPeriods = 0;
  let lowPeriods = 0;

  // Find the outlier months
  for (let month of payday.mappedMonths) {
    if (month.recurrenceCount > payday.lowNumberOfPeriods) {
      highPeriods = highPeriods + (month.recurrenceCount - payday.lowNumberOfPeriods);
      payday.highMonths.push(month);
    } else {
      lowPeriods = lowPeriods + 1;
      payday.lowMonths.push(month);
    }
  }

  payday.outliersExist =  payday.highMonths.length !== payday.mappedMonths.length &&
                          payday.lowMonths.length  !== payday.mappedMonths.length;
  payday.outlierMonthsAreHigh = payday.highMonths.length <= payday.lowMonths.length;

  const highMonths = payday.highMonths.map(m => m.name);
  payday.highMonthsPhrase = arrayToSentence(highMonths);

  const lowMonths = payday.lowMonths.map(m => m.name);
  payday.lowMonthsPhrase = arrayToSentence(lowMonths);

  payday.totalHighPay = highPeriods * payday.paycheckAmount;

  return payday;
}
