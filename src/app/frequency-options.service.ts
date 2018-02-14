import { Injectable } from '@angular/core';

@Injectable()
export class FrequencyOptionsService {

  constructor() { }

	public frequencyOptions: string[] = ['', 'Every 2 weeks', 'Every Month', 'Other'];

	public makeURLString(str): string {
    return str ? 
           str.split(' ').join('-').toLowerCase() :
           '';
	}

	public isOption(frequency: string): boolean {
    for (let option of this.frequencyOptions) {
        if (frequency === this.makeURLString(option)) return true;
    }
    return false;
	}

}
