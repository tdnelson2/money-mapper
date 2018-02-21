
import * as moment from 'moment/moment.js';

export class DateTools {

  constructor() { }

  static makeyyymmmddd(date: Date): string {
	  const mm = date.getMonth() + 1; // getMonth() is zero-based
	  const dd = date.getDate();

	  return [date.getFullYear(),
	          (mm>9 ? '' : '0') + mm,
	          (dd>9 ? '' : '0') + dd
	         ].join('-');
  }

	// Adapted from https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
	static isValidDate(dateString): boolean {
	  let regEx = /^\d{4}-\d{2}-\d{2}$/;
	  if(!dateString.match(regEx)) return false;  // Invalid format
	  let d = new Date(dateString);
	  if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
	  return d.toISOString().slice(0,10) === dateString;
	}

	static strToDate(date: Date): Date {
		console.log('moment date: ', moment(date, 'YYYY-MM-DD'));
		if (typeof(date) === 'string') {
			return moment(date, 'YYYY-MM-DD').toDate();
		}
		return date;
	}

}
