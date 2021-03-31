export const useIndexedDB = (databaseName, storeName, method, object) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    let db, tx, store;

    request.onunpgradeneeded = (e) => {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: "_id"});
    };

    request.onerror = (e) => console.log("There was an error.");

    request.onsuccess = (e) => {
      db = request.result;
      tx = db.transaction(storeName, "readwrite");
      store = tx.objectStore(storeName);

      db.onerror = (e) => console.log("error");

      if(method === "put") {
        store.put(object);
      }

      if(method === "clear") {
        store.clear();
      }

      if(method === "get") {
        const all = store.getAll();
        all.onsuccess = () => resolve(all.result);
      }

      tx.oncomplete = () => db.close();
    };
  });
}