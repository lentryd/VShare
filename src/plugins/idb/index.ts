import { App, unref } from "vue";

// Получаем базу данных
let DB: null | IDBDatabase = null;
export async function getDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (DB) return resolve(DB);

    const request = window.indexedDB.open("VShare-db");

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
      this.result.createObjectStore("passwords", {
        keyPath: "roomId",
        autoIncrement: true,
      });
    };
  });
}

import {
  init as initFiles,
  files,
  IDBFile,
  downloadingFiles,
  IDBDownloadingFile,
  download,
  save as saveFile,
  get as getFile,
} from "./files";
import {
  init as initPasswords,
  passwords,
  IDBPassword,
  exists as existsPassword,
  check as checkPassword,
  save as savePassword,
  del as delPassword,
} from "./passwords";

export interface IDB {
  files: {
    local: IDBFile[];
    downloading: IDBDownloadingFile[];
    get: typeof getFile;
    save: typeof saveFile;
    download: typeof download;
  };

  passwords: {
    data: IDBPassword[];
    del: typeof delPassword;
    save: typeof savePassword;
    check: typeof checkPassword;
    exists: typeof existsPassword;
  };
}

export default {
  install(app: App) {
    initFiles();
    initPasswords();

    app.config.globalProperties.$idb = {
      files: { get: getFile, save: saveFile, download },
      passwords: {
        del: delPassword,
        save: savePassword,
        check: checkPassword,
        exists: existsPassword,
      },
    };
    // Файлы
    Object.defineProperty(app.config.globalProperties.$idb.files, "local", {
      enumerable: true,
      get: () => unref(files),
    });
    Object.defineProperty(
      app.config.globalProperties.$idb.files,
      "downloading",
      {
        enumerable: true,
        get: () => unref(downloadingFiles),
      }
    );
    // Пароли
    Object.defineProperty(app.config.globalProperties.$idb.passwords, "data", {
      enumerable: true,
      get: () => unref(passwords),
    });
  },
};

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $idb: IDB;
  }
}
