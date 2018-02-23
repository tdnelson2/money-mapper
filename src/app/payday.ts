import * as moment from 'moment/moment';
import { Moment }  from 'moment/moment';

import { Month } from './month';

export class Payday {
	nextPayday: Date;
	paycheckAmount: number;
	lowMonthPayAmount: number;
	highMonthPayAmount: number;
	lowNumberOfPeriods: number;
	outlierMonthsAreHigh: boolean;
	frequency: string;
	frequencyInDays: number;
	endMoment: Moment;
	lowMonths: Month[] = [];
	highMonths: Month[] = [];
	totalHighPay: number;
	totalLowPay: number;
	highMonthsPhrase: string;
	lowMonthsPhrase: string;
	mappedMonths: Month[] = [];


	nextPaydayMoment(): Moment {
		return moment(this.nextPayday);
	}
}