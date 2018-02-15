export class Month {

  constructor() { }

  monthsOfTheYear : string[] = ['January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December' ];

  recurrenceCount: number = 0;
  recurrenceDates: Date[] = [];
  name: string;
  year: number;

  public setNameFromIndex(index: number) {
    this.name = this.monthsOfTheYear[index];
  }


}