import { ref, unref } from "vue";
import { getDb } from "./index";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

export interface IDBFile {
  id: number;
  name: string;
  type: string;
  data: ArrayBuffer;
}
export const files = ref<IDBFile[]>([]);

export async function init() {
  let db = await getDb();

  return new Promise<void>((resolve) => {
    const trans = db.transaction(["files"], "readonly");
    files.value = [];

    trans.objectStore("files").openCursor().onsuccess = function () {
      const cursor = this.result;
      if (cursor) {
        files.value.push(cursor.value);
        cursor.continue();
      }
    };

    trans.oncomplete = () => resolve();
  });
}

export function get(id: number): IDBFile | undefined {
  return files.value.find((f) => f.id === id);
}

export async function save(file: IDBFile) {
  const db = await getDb();

  return new Promise<void>((resolve) => {
    let trans = db.transaction(["files"], "readwrite");

    files.value.push(file);
    trans.objectStore("files").put(file);

    trans.oncomplete = () => resolve();
  });
}

export interface IDBDownloadingFile {
  id: number;
  cancel: () => void;
  transferredSize: number;
}
export const downloadingFiles = ref<IDBDownloadingFile[]>([]);

function removeDownloadingFile(id: number) {
  const index = downloadingFiles.value.findIndex((f) => f.id === id);
  downloadingFiles.value.splice(index, 1);
}

export async function download(roomId: string, id: number, name: string) {
  const url = await getDownloadURL(storageRef(getStorage(), roomId + "/" + id));
  const xhr = new XMLHttpRequest();

  return new Promise<void>((resolve, reject) => {
    const file: IDBDownloadingFile = unref(
      ref({
        id,
        cancel: () => {
          xhr.abort();
          removeDownloadingFile(id);
          reject();
        },
        transferredSize: 0,
      })
    );
    downloadingFiles.value.push(file);

    xhr.responseType = "blob";
    xhr.onprogress = (e) => (file.transferredSize = e.loaded);

    xhr.onload = async () => {
      const r = xhr.response as Blob;
      await save({ id, name, type: r.type, data: await r.arrayBuffer() });

      removeDownloadingFile(id);
      resolve();
    };

    xhr.onerror = (e) => {
      removeDownloadingFile(id);
      reject(e);
    };

    xhr.open("GET", url);
    xhr.send();
  });
}
