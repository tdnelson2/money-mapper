
export class DateTools {

  constructor() { }

  public makeyyymmmddd(date: Date): string {
	  const mm = date.getMonth() + 1; // getMonth() is zero-based
	  const dd = date.getDate();

	  return [date.getFullYear(),
	          (mm>9 ? '' : '0') + mm,
	          (dd>9 ? '' : '0') + dd
	         ].join('-');
  }

	// Adapted from https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
	public isValidDate(dateString): boolean {
	  let regEx = /^\d{4}-\d{2}-\d{2}$/;
	  if(!dateString.match(regEx)) return false;  // Invalid format
	  let d = new Date(dateString);
	  if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
	  return d.toISOString().slice(0,10) === dateString;
	}

	public strToDate(date: Date) {
		if (typeof(date) === 'string') {
			return new Date(date);
		}
		return date;
	}

}
