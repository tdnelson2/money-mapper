import { Component, OnInit } from '@angular/core';
import { YyyymmddService } from '../yyyymmdd.service';
import { FrequencyOptionsService } from '../frequency-options.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  startDate: Date;
  pay: number;
  payFrequency: string;
  payFrequencyOptions: string[] = this.frequencyOptions.frequencyOptions;

  constructor(
    private yyyymmddService: YyyymmddService,
    private frequencyOptions: FrequencyOptionsService
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }

  yyyymmdd(): string {
    return this.yyyymmddService.makeyyymmmddd(this.startDate);
  }

  frequency(): string {
    return this.frequencyOptions.makeURLString(this.payFrequency);
  }

  ngOnInit() {
      this.startDate = new Date();
      this.pay = 0;
  }

}
