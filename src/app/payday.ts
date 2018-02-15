import { Month } from './month';

export class Payday {
	nextPayday: Date;
	paycheckAmount: number;
	normalMonthlyPayAmount: number;
	outlierMonthPayAmount: number;
	frequency: string;
	endDate: Date;
	outlierMonths: [];
	totalExtraPay: number;
	extraMonthsPhrase: string;
	mappedToMonths: Month[];
}