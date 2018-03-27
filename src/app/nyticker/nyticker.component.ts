import { Component, OnInit } from '@angular/core';
import { NytimesService } from '../nytimes.service';
// 
import { Observable } from 'rxjs/Observable';

import { DissolveAnimation } from '../dissolve-animation';

@Component({
  selector: 'app-nyticker',
  templateUrl: './nyticker.component.html',
  styleUrls: ['./nyticker.component.css']
})
export class NytickerComponent implements OnInit {

  public dissolveAnimation: DissolveAnimation;

  constructor(private nytService: NytimesService) {}

  ngOnInit() {
    this.nytService.db.getCachedItems().then(() => {
      this.dissolveAnimation = new DissolveAnimation('sequence-dissolve', 
                                                      this.nytService.db, 
                                                      3000, 
                                                      10000, 
                                                      'regular');
      const areQueued = this.nytService.db.items.length > 0;
      if (areQueued) this.dissolveAnimation.queueItems();
      this.nytService.fetchStories().subscribe((response: any) => {
        this.nytService.db.addItems(response.results);
        if (!areQueued) this.dissolveAnimation.queueItems();
        this.nytService.db.updateDB(response.results);
      });
    });
  }
}
