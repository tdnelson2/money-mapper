import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  startDate: Date;
  pay: number;
  payFrequency: string;
  payFrequencyOptions: string[] = ['Every 2 weeks', 'Every Month', 'Other'];

  constructor() { }

  ngOnInit() {
      this.startDate = new Date();
      this.pay = 0;
  }

}
