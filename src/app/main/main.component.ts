import { Component, OnInit } from '@angular/core';
import { YyyymmddService } from '../yyyymmdd.service';
import { FrequencyOptionsService } from '../frequency-options.service';
import { Payday } from '../payday';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  payday = new Payday;
  payFrequencyOptions: string[] = this.frequencyOptions.frequencyOptions;

  constructor(
    private yyyymmddService: YyyymmddService,
    private frequencyOptions: FrequencyOptionsService
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }

  yyyymmdd(date: Date): string {
    return this.yyyymmddService.makeyyymmmddd(date);
  }

  frequency(option: string): string {
    return this.frequencyOptions.optionAsURL(option);
  }

  ngOnInit() {
      this.payday.nextPayday = new Date();
      this.payday.paycheckAmount = 0;
  }

}
