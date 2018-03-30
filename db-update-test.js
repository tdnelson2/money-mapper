var db = {
  updateDB: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('db updated!')
        resolve();
      }, 500);
    });
  }
}

var shouldUpdateDBAfterEach = false;

var updateDB = (data) => {
  return new Promise((resolve, reject) => {
    if (shouldUpdateDBAfterEach) {
      db.updateDB([data]).then(() => {
        console.log('db update promise FULLFILLED');
        return resolve();
      });
    } else {
      console.log('db update BI-PASSED!')
      return resolve();
    }
  });
}

updateDB('data').then(() => {
  console.log('process complete');
});