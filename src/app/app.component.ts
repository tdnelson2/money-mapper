import { Component, OnInit }                                from '@angular/core';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { PhotoService } from './photo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppComponent implements OnInit {
  title = 'app';

  private staticClasses = 'bg-img';
  private i = 0;
  private photoA = {post_url: '#', classes: `invisible ${this.staticClasses}`};
  private photoB = {post_url: '#', classes: `invisible ${this.staticClasses}`};
  private photos: any[];

  constructor(
    private location: Location,
    private photoService: PhotoService
    ) { this.location = location; }

  ngOnInit() {
    this.photoService.fetchPhotos().subscribe((response: any) => {
      const start = this.getRandomInt(0,response.length-11);
      this.photos = response.slice(start, start+10);
      this.queuePhotos();
    });
  }


  private getRandomInt(min: number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  queuePhotos(): void {

    const getPhoto = (index, invisible=false) => {
      const photo = this.photos[index];
      photo['url'] = `https://picsum.photos/${window.innerWidth}/${window.innerHeight}/?image=${photo.id}`;
      if (invisible) {
        photo['classes'] = `invisible ${this.staticClasses}`;
      }
      return photo;
    }

    // const crossDissolve(photo1, photo2)

    this.photoA = getPhoto(0);
    this.photoA['classes'] = this.staticClasses;
    console.log(this.photoA);
    this.photoB = getPhoto(1);
    console.log(this.photoB);

    setInterval(() => {
      this.i = this.i === this.photos.length-1 ? 0 : this.i+1;
      if (this.i % 2 === 1) {
        this.photoA['classes'] = `fade-out ${this.staticClasses}`;
        this.photoB['classes'] = `fade-in ${this.staticClasses}`;
        setTimeout(() => {
          this.photoA = getPhoto(this.i, true);
        }, 3000);
      } else {
        this.photoB['classes'] = `fade-out ${this.staticClasses}`;
        this.photoA['classes'] = `fade-in ${this.staticClasses}`;
        setTimeout(() => {
          const nexti = this.i+1 === this.photos.length-1 ? 0 : this.i+2;
          this.photoB = getPhoto(nexti, true);
        }, 3000);
      }
    },20000);
  }

  private goBack(): void {
    this.location.back();
  }
}
