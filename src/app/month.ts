import { Moment }  from 'moment/moment';

export class Month {

  constructor() { }

  recurrenceCount: number = 0;
  recurrenceDates: Moment[] = [];
  index: number;
  name: string;
  year: string;
}