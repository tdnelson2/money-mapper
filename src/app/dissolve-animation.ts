
import { MMIndexedDB } from './mm-indexeddb';

class TransitionItem {
  public track: number;
  public state: string; 
  public klass: string;
  public data: any;
  public visibleInDOM: boolean;

  constructor(track, state, klass, data, visibleInDOM) {
    this.track = track;
    this.state = state;
    this.klass = klass;
    this.data = data;
    this.visibleInDOM = visibleInDOM;
  }
}

export class DissolveAnimation {

  public itemA: TransitionItem;
  public itemB: TransitionItem;
  public data: any;
  private i = 1;
  private db: MMIndexedDB;
  private td: number;
  private interval: number;
  private shouldUpdateDBAfterEach: boolean;
  private isSequenceDissolve = false;
  private isCrossDissolve = false;

  private itemAShouldBeVisible = true;

  private staticCSS: string;

  private css(css: string):string {
    return this.staticCSS === undefined ? css : `${css} ${this.staticCSS}`;
  }

  private fadeOutCSS   = () => this.css('fade-out');
  private fadeInCSS    = () => this.css('fade-in');
  private invisibleCSS = () => this.css('invisible');
  private hiddenCSS    = () => this.css('hidden');
  private visibleCSS   = () => this.css('visible');

  private promisefy = (item: any, css, delay):Promise<any> => {
    item.klass = this.css(css);
    if (item.track === 1) {
      if (css === 'hidden') this.itemAShouldBeVisible = false;
      if (css === 'fade-in') this.itemAShouldBeVisible = true;
    } else {
      if (css === 'hidden') this.itemAShouldBeVisible = true;
      if (css === 'fade-in') this.itemAShouldBeVisible = false;
    }
    return new Promise((r, j) => setTimeout(r, delay, item));
  }

  private fadeOut   = it => this.promisefy(it, this.fadeOutCSS(), this.td);
  private fadeIn    = it => this.promisefy(it, this.fadeInCSS(), this.td);
  private invisible = it => this.promisefy(it, this.invisibleCSS(), this.interval);
  private hidden    = it => this.promisefy(it, this.hiddenCSS(), this.interval);
  private visible   = it => this.promisefy(it, this.visibleCSS(), this.interval);

  constructor( animationType,
               db, 
               transitionDuration, 
               interval, 
               staticCSS=undefined, 
               shouldUpdateDBAfterEach=false ) {
    this.db = db;
    this.td = transitionDuration;
    this.staticCSS = staticCSS;
    this.interval = interval;
    this.shouldUpdateDBAfterEach = shouldUpdateDBAfterEach;
    if (animationType === 'sequence-dissolve') {
      this.isSequenceDissolve = true;
    } else if (animationType === 'cross-dissolve') {
      this.isCrossDissolve = true;
    } else {
      throw `"${animationType}" is not one of the options. `+
      'Please choose "sequence-dissolve" or "cross-dissolve"';
    }
  };

  private updateCSSAfterDelay = (delay: number, data:any[]):Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let item of data) {
          item.it.klass = item.c;
        }
        resolve();
      }, delay);
    });
  }

  private getABTracks():any[] {
    let [a, b, topTrackIsFading] = [undefined, undefined, false];
    if (this.itemA.state === 'show') {
      topTrackIsFading = true;
      [a, b] = [this.itemA, this.itemB];
    } else {
      [a, b] = [this.itemB, this.itemA];
    }
    [a.state, b.state] = ['hide', 'show'];
    this.data = b.data;
    return [a, b, topTrackIsFading];
  }

  private sequenceDissolve(nextItem: any) {
    const [a, b] = this.getABTracks();
    this.fadeOut(a).then(() => {
      this.hidden(a);
      this.fadeIn(b);
      this.updateDB(a.data).then(() => {

        // Queue up data for the next transition
        a.data = nextItem;
      });
    });
  }

  // private sequenceDissolve(nextItem: any) {
  //   const [a, b] = this.getABTracks();
  //   a.klass = this.fadeOut();

  //   // Hide `a` from the DOM after it finishes fading out
  //   // this.updateCSSAfterDelay(this.td, [{it:a, c:this.hidden()}]).then(() => {
  //   this.updateCSSAfterDelay(this.td, []).then(() => {

  //     // Insert a slight delay to avoid a flash before fading in `b`
  //     a.visibleInDOM = false;
  //     b.visibleInDOM = true;
  //     b.klass = this.fadeIn();

  //     // Update database if `this.shouldUpdateDBAfterEach` is true
  //     this.updateDB(a.data).then(() => {

  //       // Queue up data for the next transition
  //       a.data = nextItem;
  //     });
  //   });
  // }

  private crossDissolve(nextItem: any): void {

    const [a, b, topTrackIsFading] = this.getABTracks();

    const update = () => {
      this.updateDB(a.data).then(() => {
        a.data = nextItem; 
      });
    }

    if (topTrackIsFading) {

      // Because track `a` has a higher z-index, we only need to
      // fade it out to reveal track `b`
      this.visible(b);
      this.fadeOut(a).then(() => update());
    } else {

      // Because track `a` has a lower z-index, 
      // we can simply fade in track `b`
      this.visible(a);
      this.fadeIn(b).then(() => update());
    }
  }

  // private crossDissolve(nextItem: any): void {
  //   const [a, b, topTrackIsFading] = this.getABTracks();
  //   if (topTrackIsFading) {

  //     // Because track `a` has a higher z-index, we only need to
  //     // fade it out to reveal track `b`
  //     [a.klass, b.klass] = [this.fadeOut(), this.visible()];
  //   } else {

  //     // Because track `a` has a lower z-index, 
  //     // we can simply fade in track `b`
  //     [a.klass, b.klass] = [this.visible(), this.fadeIn()];
  //   }

  //   this.updateCSSAfterDelay(this.td, [{it:a, c:this.invisible()}]).then(() => {

  //     // Update database if `this.shouldUpdateDBAfterEach` is true
  //     this.updateDB(a.data).then(() => {

  //       // Queue up data for the next transition
  //       a.data = nextItem;
  //     });
  //   });
  // }

  private updateDB(data): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.shouldUpdateDBAfterEach) {
        this.db.updateDB([data]).then(() => {
          return resolve();
        });
      } else {
        return resolve();
      }
    });
  }

  public queueItems(): void {
    const klassB = this.isCrossDissolve ? this.invisibleCSS() : this.hiddenCSS();

    this.itemB = new TransitionItem(1, 'show', this.visibleCSS(), this.db.items[0], true);
    this.itemA = new TransitionItem(2, 'hide', klassB, this.db.items[1], false);

    this.data = this.itemA.data;

    setInterval(() => {
      this.i = this.i === this.db.items.length-1 ? 0 : this.i+1;
      if (this.isCrossDissolve) {
        this.crossDissolve(this.db.items[this.i]);
      } else if (this.isSequenceDissolve) {
        this.sequenceDissolve(this.db.items[this.i]);
      }
    }, this.interval);
  }
}