
import { MMIndexedDB } from './mm-indexeddb';

export class CrossDissolve {

  public itemA: any;
  public itemB: any;
  private i = 1;
  private db: MMIndexedDB;
  private transitionDuration: number;
  private interval: number;
  private cssClasses: string;
  private shouldUpdateDB: boolean;
  private shouldCenter: boolean;

  constructor( db, 
               transitionDuration, 
               interval, 
               cssClasses='', 
               shouldUpdateDB=false,
               shouldCenter=false ) {
    this.db = db;
    this.transitionDuration = transitionDuration;
    this.cssClasses = cssClasses;
    this.interval = interval;
    this.shouldUpdateDB = shouldUpdateDB;
    this.shouldCenter = shouldCenter;
  };

  private switchItems(nextItem: any) {
    if (this.itemA.state === 'show') {
        this.itemA.state = 'hide';
        this.itemB.state = 'show';
        this.itemA.klass = `fade-out ${this.cssClasses}`;
        this.itemB.klass = `visible ${this.cssClasses}`;
        this.setNextItem(nextItem, this.itemA);
    } else {
        this.itemB.state = 'hide';
        this.itemA.state = 'show';
        this.itemB.klass = `visible ${this.cssClasses}`;
        this.itemA.klass = `fade-in ${this.cssClasses}`;
        this.setNextItem(nextItem, this.itemB);
    }
  }

  private setNextItem(nextItem: any, item: any): void {
    const setNext = () => {
      item.klass = `invisible ${this.cssClasses}`;
      item.data = nextItem;
    }
    setTimeout(() => {
      if (this.shouldUpdateDB) {
        this.db.updateDB([item.data]).then(() => {
          setNext();
          return;
        });
      }
      setNext();
    }, this.transitionDuration);
  }

  public queueItems(): void {
    this.itemA = {state: 'show', klass: 'bg', data: this.db.items[0]};
    this.itemB = {state: 'hide', klass: 'bg invisible', data: this.db.items[1]};

    setInterval(() => {
      // console.log('nytA width: ', document.getElementById('nytA').offsetWidth);
      // console.log('nytB width: ', document.getElementById('nytB').offsetWidth);
      console.log('this.itemA', this.itemA);
      console.log('this.itemB', this.itemB);
      this.i = this.i === this.db.items.length-1 ? 0 : this.i+1;
      this.switchItems(this.db.items[this.i]);
    }, this.interval);
  }
}