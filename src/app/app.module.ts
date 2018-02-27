import { BrowserModule }       from '@angular/platform-browser';
import { NgModule }            from '@angular/core';
import { FormsModule }         from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment }         from '../environments/environment';

import { AppComponent }          from './app.component';
import { AppRoutingModule }      from './app-routing.module';
import { MainComponent }         from './main/main.component';
import { ParamValidatorService } from './param-validator.service';
import { PaydayService }         from './payday.service';
import { IntroComponent }        from './intro/intro.component';
import { ResultsComponent }      from './results/results.component';


import { CurrencyMaskModule }                       from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { AngularFontAwesomeModule }                 from 'angular-font-awesome';


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
    IntroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CurrencyMaskModule,
    AngularFontAwesomeModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    ParamValidatorService,
    PaydayService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
