import { Injectable } from '@angular/core';
import { Payday } from './payday';

@Injectable()
export class PaydaySessionDataService {

  constructor() { }

  data = new Payday();

}
