import { Component, OnInit, Input } from '@angular/core';

import { PhotoService } from '../photo.service';

import { DissolveAnimation } from '../dissolve-animation';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

@Component({
  selector: 'app-background-slideshow',
  templateUrl: './background-slideshow.component.html',
  styleUrls: ['./background-slideshow.component.css']
})
export class BackgroundSlideshowComponent implements OnInit {

  public dissolveAnimation: DissolveAnimation;

  constructor( public photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.db.getCachedItems().then(() => {
      this.dissolveAnimation = new DissolveAnimation('cross-dissolve', 
                                                      this.photoService.db, 
                                                      3000, 
                                                      15000, 
                                                      'bg', 
                                                      true);
      const areQueued = this.photoService.db.items.length > 0;
      if (areQueued) this.dissolveAnimation.queueItems();
      this.photoService.fetchPhotos().subscribe((response: any) => {
        const start = this.getRandomInt(0,response.length-11);
        let photos = response.slice(start, start+10);
        this.addData(photos);
        this.photoService.db.addItems(photos);
        if (!areQueued) this.dissolveAnimation.queueItems();
      });
    });
  }

  private addData(photos) {
    const date = new Date().toISOString();
    for (let photo of photos) {
      photo['date_added'] = date;
      photo['style'] = this.buildBGStyle(photo.id);
    }
  }

  private getRandomInt(min: number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private buildImgUrl(id) {
    const width = Math.floor(window.innerWidth*window.devicePixelRatio);
    const height = Math.floor(window.innerHeight*window.devicePixelRatio);
    return `https://picsum.photos/${width}/${height}/?image=${id}`
  }

  private buildBGStyle(id) {
    const url = this.buildImgUrl(id);
    return {'background-image':  `url(${url})`};
  }
}
