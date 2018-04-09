import { Component, OnInit, Input } from '@angular/core';

import { PhotoService } from '../photo.service';

import { CrossDissolve } from 'css-dissolve-animation-angular';

@Component({
  selector: 'app-background-slideshow',
  templateUrl: './background-slideshow.component.html',
  styleUrls: ['../../../node_modules/css-dissolve-animation-angular/css/styles.css', './background-slideshow.component.css']
})
export class BackgroundSlideshowComponent implements OnInit {

  public crossDissolve: CrossDissolve;
  private eventID = 'picsum-photos';

  constructor( public photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.db.getCachedItems().then(() => {
      this.crossDissolve = new CrossDissolve(this.photoService.db.items, {
                                             staticKlasses: 'bg', 
                                             interval: 15000, 
                                             eventIdentifier: this.eventID });
      const areQueued = this.photoService.db.items.length > 0;
      if (areQueued) this.crossDissolve.animate();
      this.photoService.fetchPhotos().subscribe((response: any) => {
        const start = this.getRandomInt(0,response.length-11);
        let photos = response.slice(start, start+10);
        this.addData(photos);
        this.photoService.db.addItems(photos);
        if (!areQueued) this.crossDissolve.animate();
      });

      // Add the photos to IndexedDB only after they've appeared. 
      // This should ensure only photos that have been cached 
      // will appear in the db.
      const items: (string | any)[][] = [['itemA', this.crossDissolve.itemA], 
                                         ['itemB', this.crossDissolve.itemB]];
      for (let item of items) {
        document.addEventListener(`${this.eventID}--${item[0]}--da-visible--WILL-REMOVE`, (evt) => {
          console.log('item to be added to db: ', item[1].data);
          this.updateDB(item[1].data);
        });
      }
    });
  }

  private addData(photos): void {
    const date = new Date().toISOString();
    for (let photo of photos) {
      photo['date_added'] = date;
      photo['style'] = this.buildBGStyle(photo.id);
    }
  }


  private getRandomInt(min: number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private buildImgUrl(id): string {
    const width = Math.floor(window.innerWidth*window.devicePixelRatio);
    const height = Math.floor(window.innerHeight*window.devicePixelRatio);
    return `https://picsum.photos/${width}/${height}/?image=${id}`
  }

  private buildBGStyle(id): any {
    const url = this.buildImgUrl(id);
    return {'background-image':  `url(${url})`};
  }

  private updateDB(data: any): void {
    this.photoService.db.updateDB(data);
  }
}
