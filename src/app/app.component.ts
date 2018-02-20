import { Component } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import 'bootstrap/dist/css/bootstrap.min.css';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppComponent {
  title = 'app';

  location: Location;

  constructor(location: Location) { this.location = location; }

  goBack(): void {
    this.location.back();
  }
}
