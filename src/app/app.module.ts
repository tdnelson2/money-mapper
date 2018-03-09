import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule }                from '@angular/core';
import { FormsModule }             from '@angular/forms';

import { AppComponent }                       from './app.component';
import { IntroComponent }                     from './intro/intro.component';
import { ToastMessagesComponent }             from './toast-messages/toast-messages.component';
import { ResultsComponent }                   from './results/results.component';
import { AppRoutingModule }                   from './app-routing.module';
import { MainComponent }                      from './main/main.component';
import { ParamValidatorService }              from './param-validator.service';
import { PaydayService }                      from './payday.service';


import { CurrencyMaskModule }                       from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

import { AngularFontAwesomeModule }                 from 'angular-font-awesome';

import { ToastModule } from 'ng2-toastr/ng2-toastr';


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
    ResultsComponent,
    IntroComponent,
    ToastMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CurrencyMaskModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [
    ParamValidatorService,
    PaydayService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
