import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { YyyymmddService } from './yyyymmdd.service';
import { FrequencyOptionsService } from './frequency-options.service';
import { ParamValidatorService } from './param-validator.service';
import { MonthlyRecurrenceMapperService } from './monthly-recurrence-mapper.service';
import { PaydaySessionDataService } from './payday-session-data.service';


import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { ResultsComponent } from './results/results.component';
import { PayRecurrenceService } from './pay-recurrence.service';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: false,
    allowZero: true,
    decimal: ".",
    precision: 2,
    prefix: "$ ",
    suffix: "",
    thousands: ","
};


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CurrencyMaskModule
  ],
  providers: [
    YyyymmddService,
    FrequencyOptionsService,
    ParamValidatorService,
    MonthlyRecurrenceMapperService,
    PayRecurrenceService,
    PaydaySessionDataService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
