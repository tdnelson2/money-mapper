import { Component, OnInit } from '@angular/core';
import { NytimesService } from '../nytimes.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-nyticker',
  templateUrl: './nyticker.component.html',
  styleUrls: ['./nyticker.component.css']
})
export class NytickerComponent implements OnInit {

  i: number = 0;
  currentStory: any;

  constructor(private nytService: NytimesService) {}

  ngOnInit() {
    this.nytService.getCachedStories().then(() => {
      let areQueued = false;
      if (this.nytService.stories.length > 0) {
        this.queueStories();
        areQueued = true;
      }
      this.nytService.fetchStories().subscribe((response: any) => {
        this.nytService.addStories(response.results);
        if (!areQueued) {
          this.queueStories();
        }
        this.nytService.updateDB(response.results);
      });
    });
  }

  queueStories(): void {
      this.currentStory = this.nytService.stories[0];

      setInterval(() => {
        this.i = this.i === this.nytService.stories.length-1 ? 0 : this.i+1;
        this.currentStory = this.nytService.stories[this.i];
      },10000);
  }
}
