import { Moment }  from 'moment/moment';

export class Month {

  recurrenceCount: number = 0;
  recurrenceDates: Moment[] = [];
  index: number;
  name: string;
  year: string;

  constructor(recurrenceMonth: Moment) {
    this.index = recurrenceMonth.month();
    this.name = recurrenceMonth.format('MMMM');
    this.year = recurrenceMonth.format('YYYY');
  }
}