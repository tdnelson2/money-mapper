import { Component }                                      from '@angular/core';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppComponent {
  title = 'app';

  location: Location;

  constructor(
    location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.location = location;
  }

  goBack(): void {
    if (this.location.path().startsWith('/results')) {
      this.router.navigateByUrl('/main');
    } else {
      this.location.back();
    }
  }
}