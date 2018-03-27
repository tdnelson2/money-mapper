
import { MMIndexedDB } from './mm-indexeddb';

export class DissolveAnimation {

  public itemA: any;
  public itemB: any;
  public data: any;
  private i = 1;
  private db: MMIndexedDB;
  private transitionDuration: number;
  private interval: number;
  private cssClasses: string;
  private shouldUpdateDB: boolean;
  private isSequenceDissolve = false;
  private isCrossDissolve = false;

  constructor( animationType,
               db, 
               transitionDuration, 
               interval, 
               cssClasses='', 
               shouldUpdateDB=false ) {
    this.db = db;
    this.transitionDuration = transitionDuration;
    this.cssClasses = cssClasses;
    this.interval = interval;
    this.shouldUpdateDB = shouldUpdateDB;
    if (animationType === 'sequence-dissolve') {
      this.isSequenceDissolve = true;
    } else if (animationType === 'cross-dissolve') {
      this.isCrossDissolve = true;
    } else {
      throw `"${animationType}" is not one of the options. `+
      'Please choose "sequence-dissolve" or "cross-dissolve"';
    }
  };

  private crossDissolve(nextItem: any) {
    if (this.itemA.state === 'show') {
        this.itemA.state = 'hide';
        this.itemB.state = 'show';
        this.data = this.itemB.data;
        this.itemA.klass = `fade-out ${this.cssClasses}`;
        this.itemB.klass = `visible ${this.cssClasses}`;
        this.setNextItem(nextItem, this.itemA);
    } else {
        this.itemB.state = 'hide';
        this.itemA.state = 'show';
        this.data = this.itemA.data;
        this.itemB.klass = `visible ${this.cssClasses}`;
        this.itemA.klass = `fade-in ${this.cssClasses}`;
        this.setNextItem(nextItem, this.itemB);
    }
  }

  private setNextItem(nextItem: any, item: any): void {
    const setNext = () => {
      if (this.isCrossDissolve) {
        item.klass = `invisible ${this.cssClasses}`;
        item.data = nextItem;
      } else if (this.isSequenceDissolve) {
        this.itemA.klass = `invisible ${this.cssClasses}`;
        item.data = nextItem;
        this.itemA.klass = `fade-in ${this.cssClasses}`;
      }
    }

    if (this.isSequenceDissolve) {
      this.itemA.klass = `fade-out ${this.cssClasses}`;
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
    this.itemA = {state: 'show', klass: this.cssClasses, data: this.db.items[0]};

    if (this.isCrossDissolve) {
      this.data = this.itemA.data;
      this.itemB = {state: 'hide', klass: `${this.cssClasses} invisible`, data: this.db.items[1]};
    } else if (this.isSequenceDissolve) {
      this.i = 0;
    }

    setInterval(() => {
      this.i = this.i === this.db.items.length-1 ? 0 : this.i+1;
      if (this.isCrossDissolve) {
        this.crossDissolve(this.db.items[this.i]);
      } else if (this.isSequenceDissolve) {
        this.setNextItem(this.db.items[this.i], this.itemA);
      }
    }, this.interval);
  }
}