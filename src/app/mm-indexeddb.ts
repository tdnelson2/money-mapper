import idb from 'idb';
// 

export class MMIndexedDB {
  public addedKeys:    string[] = [];
  public items:        any[] = [];
  public dbPromise:    Promise<any>;
  private dbName:      string;
  private dbStoreName: string;
  private dbVersion:   number;
  private primaryKey:  string;
  private dateKey:     string;
  private limit:       number;

  constructor(dbName:      string, 
              dbStoreName: string, 
              dbVersion:   number, 
              primaryKey:  string, 
              dateKey:     string, 
              limit:       number) {
  	this.dbName =          dbName;
  	this.dbStoreName =     dbStoreName;
  	this.dbVersion =       dbVersion;
    this.primaryKey =      primaryKey;
    this.dateKey =         dateKey;
    this.limit =           limit;
    this.dbPromise =       this.openDatabase();
  }

  openDatabase():Promise<any> {
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open(this.dbName, 1, upgradeDb => {
      const store = upgradeDb.createObjectStore(this.dbStoreName, {
        keyPath: this.primaryKey
      });
      store.createIndex('by-date', this.dateKey);
    });
  }

  public updateDB(items):Promise<any> {
    return this.dbPromise.then(db => {
      if (!db) return Promise.resolve();

      const tx = db.transaction(this.dbStoreName, 'readwrite');
      const store = tx.objectStore(this.dbStoreName);
      for (let item of items) {
        store.put(item);
      }

      // limit to the specified number of items
      return store.index('by-date').openCursor(null, 'prev').then(cursor => {
        return cursor.advance(this.limit);
      }).then(function deleteRest(cursor) {
        if (!cursor) return;
        cursor.delete();
        return cursor.continue().then(deleteRest);
      });
    });
  }

  public getCachedItems(): Promise<any> {
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    return this.dbPromise.then(db => {
      if(!db) return;
      const index = db.transaction(this.dbStoreName)
        .objectStore(this.dbStoreName).index('by-date');

      return index.getAll().then(items => {
        this.addItems(items.reverse());
      });
    });
  }

  public addItems(items: any[]): void {
    for (let item of items) {
      if (!this.addedKeys.includes(item[this.primaryKey])) {
        this.addedKeys.push(item[this.primaryKey]);
        this.items.push(item);
      }
    }
  }
}
