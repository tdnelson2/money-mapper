import { Component, OnInit } from '@angular/core';
import { NytimesService } from '../nytimes.service';
// 
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
    this.nytService.db.getCachedItems().then(() => {
      const areQueued = this.nytService.db.items.length > 0;
      if (areQueued) this.queueStories();
      this.nytService.fetchStories().subscribe((response: any) => {
        this.nytService.db.addItems(response.results);
        if (!areQueued) this.queueStories();
        this.nytService.db.updateDB(response.results);
      });
    });
  }

  queueStories(): void {
      this.currentStory = this.nytService.db.items[0];

      setInterval(() => {
        this.i = this.i === this.nytService.db.items.length-1 ? 0 : this.i+1;
        this.currentStory = this.nytService.db.items[this.i];
      },10000);
  }
}
