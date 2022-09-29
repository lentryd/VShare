import { App, unref } from "vue";

// Получаем базу данных
let DB: null | IDBDatabase = null;
export async function getDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (DB) return resolve(DB);

    const request = window.indexedDB.open("VS-LOCAL-DATA");

    request.onerror = (e) => {
      console.error("Error opening db", e);
      reject(new Error("Error opening db"));
    };

    request.onsuccess = function () {
      DB = this.result;
      resolve(DB);
    };

    request.onupgradeneeded = function () {
      this.result.createObjectStore("files", {
        keyPath: "id",
        autoIncrement: true,
      });
    };
  });
}

import {
  init as initFiles,
  files,
  IDBFile,
  read as readFile,
  write as writeFile,
  remove as removeFile,
  formateFile,
} from "./files";

export interface IDB {
  files: {
    state: IDBFile[];
    read: typeof readFile;
    write: typeof writeFile;
    remove: typeof removeFile;
    formateFile: typeof formateFile;
  };
}

export default {
  install(app: App) {
    initFiles();

    app.config.globalProperties.$idb = {
      files: {
        read: readFile,
        write: writeFile,
        remove: removeFile,
        formateFile,
      },
    };

    Object.defineProperty(app.config.globalProperties.$idb.files, "state", {
      enumerable: true,
      get: () => unref(files),
    });
  },
};

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $idb: IDB;
  }
}
