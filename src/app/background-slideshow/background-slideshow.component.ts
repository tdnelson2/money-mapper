import { Component, OnInit, Input } from '@angular/core';

import { PhotoService } from '../photo.service';
//
@Component({
  selector: 'app-background-slideshow',
  templateUrl: './background-slideshow.component.html',
  styleUrls: ['./background-slideshow.component.css']
})
export class BackgroundSlideshowComponent implements OnInit {

  public photoA: any;
  public photoB: any;
  public classA = 'bg';
  public classB = 'bg invisible';
  private stateA = 'show';
  private stateB = 'hide';
  private i = 1;

  private switchPhotos(nextPhoto: any) {
    if (this.stateA === 'show') {
        this.stateA = 'hide';
        this.stateB = 'show';
        this.classA = 'bg fade-out';
        this.classB = 'bg visible';
        setTimeout(() => {
          this.photoService.db.updateDB([this.photoA]).then(() => {
            this.classA = 'bg invisible';
            this.photoA = nextPhoto
          });
        }, 3000);
    } else {
        this.stateB = 'hide';
        this.stateA = 'show';
        this.classB = 'bg visible';
        this.classA = 'bg fade-in';
        setTimeout(() => {
          this.photoService.db.updateDB([this.photoB]).then(() => {
            this.classB = 'bg visible';
            this.photoB = nextPhoto
          });
        }, 3000);
    }
  }

  constructor( private photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.db.getCachedItems().then(() => {
      const areQueued = this.photoService.db.items.length > 0;
      if (areQueued) this.queuePhotos();
      this.photoService.fetchPhotos().subscribe((response: any) => {
        const start = this.getRandomInt(0,response.length-11);
        let photos = response.slice(start, start+10);
        this.addData(photos);
        this.photoService.db.addItems(photos);
        if (!areQueued) this.queuePhotos();
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

  private queuePhotos(): void {
    this.photoA = this.photoService.db.items[0];
    this.photoB = this.photoService.db.items[1];

    setInterval(() => {
      this.i = this.i === this.photoService.db.items.length-1 ? 0 : this.i+1;
      this.switchPhotos(this.photoService.db.items[this.i]);
      console.log(this.photoService.db.items[this.i]);
    },8000);
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
