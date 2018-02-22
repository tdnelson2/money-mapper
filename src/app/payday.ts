import * as moment from 'moment/moment';
import { Moment }  from 'moment/moment';

import { Month } from './month';

export class Payday {
	nextPayday: Date;
	paycheckAmount: number;
	normalMonthlyPayAmount: number;
	outlierMonthPayAmount: number;
	frequency: string;
	otherFrequencyInDays: string;
	endMoment: Moment;
	outlierMonths: Month[] = [];
	totalExtraPay: number;
	extraMonthsPhrase: string;
	mappedMonths: Month[] = [];


	nextPaydayMoment(): Moment {
		return moment(this.nextPayday);
	}
}