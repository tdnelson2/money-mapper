import { Component, OnInit } from '@angular/core';
import { NytimesService } from '../nytimes.service';
// 
import { Observable } from 'rxjs/Observable';

import { SequenceDissolve } from 'css-dissolve-animation-angular';

@Component({
  selector: 'app-nyticker',
  templateUrl: './nyticker.component.html',
  styleUrls: ['../../../node_modules/css-dissolve-animation-angular/css/styles.css', './nyticker.component.css']
})
export class NytickerComponent implements OnInit {

  public sequenceDissolve: SequenceDissolve;

  constructor(private nytService: NytimesService) {}

  ngOnInit() {
    this.nytService.db.getCachedItems().then(() => {
      this.sequenceDissolve = new SequenceDissolve(this.nytService.db.items, {
                                                   staticKlasses: 'regular', 
                                                   interval: 10000});
      const areQueued = this.nytService.db.items.length > 0;
      if (areQueued) this.sequenceDissolve.animate();
      this.nytService.fetchStories().subscribe((response: any) => {
        this.nytService.db.addItems(response.results);
        if (!areQueued) this.sequenceDissolve.animate();
        this.nytService.db.updateDB(response.results);
      });
    });
  }
}
