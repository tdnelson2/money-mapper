import { mapMonthlyRecurrences }  from './map-monthly-recurrences';
import { PaydayService }          from './payday.service';
import { arrayToSentence }        from './array-to-sentence';
import { Month }                  from './month';


export const mapPayRecurrence = (payday: PaydayService,
                                 numberOfDays: number=365,
                                 clearPrevData: boolean=true):PaydayService => {

  // Fill in missing info on this Payday instance
  payday.endMoment = payday.nextPaydayMoment().clone().add(numberOfDays, 'days');
  payday.lowNumberOfPeriods = Math.floor(30.42/payday.frequencyInDays);
  payday.lowMonthPayAmount = payday.paycheckAmount * payday.lowNumberOfPeriods;

  // Get monthly recurrence data (number of times you get paid each month)
  payday.mappedMonths = mapMonthlyRecurrences(payday.nextPaydayMoment(),
                                               payday.endMoment,
                                               payday.frequencyInDays);
  return payday;
}
