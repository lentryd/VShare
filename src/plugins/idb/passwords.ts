import { ref } from "vue";
import { getDb } from "./index";
import { SHA3, HmacSHA3 } from "crypto-js";

export interface IDBPassword {
  hash: string;
  roomId: string;
  isOpen: boolean;
}
export const passwords = ref<IDBPassword[]>([]);

export async function init() {
  let db = await getDb();

  return new Promise<void>((resolve) => {
    const trans = db.transaction(["passwords"], "readonly");
    passwords.value = [];

    trans.objectStore("passwords").openCursor().onsuccess = function () {
      const cursor = this.result;
      if (cursor) {
        passwords.value.push({ ...cursor.value, isOpen: false });
        cursor.continue();
      }
    };

    trans.oncomplete = () => resolve();
  });
}

export function exists(roomId: string) {
  return !!passwords.value.find((p) => p.roomId === roomId);
}

export function check(roomId: string, password: string) {
  const { hash } = passwords.value.find((p) => p.roomId === roomId) ?? {};
  if (!hash) return false;

  const equally = hash === HmacSHA3(SHA3(password), roomId).toString();
  if (equally) {
    const index = passwords.value.findIndex((p) => p.roomId === roomId);
    passwords.value[index].isOpen = true;
  }

  return equally;
}

export async function save(roomId: string, password: string) {
  const db = await getDb();
  const hash = HmacSHA3(SHA3(password), roomId).toString();

  return new Promise<void>((resolve) => {
    let trans = db.transaction(["passwords"], "readwrite");

    passwords.value.push({ roomId, hash, isOpen: true });
    trans.objectStore("passwords").put({ roomId, hash });

    trans.oncomplete = () => resolve();
  });
}

export async function del(roomId: string) {
  const { isOpen } = passwords.value.find((p) => p.roomId === roomId) ?? {};
  if (!isOpen) throw new Error("Enter password for " + roomId + "");

  const db = await getDb();

  return new Promise<void>((resolve) => {
    let trans = db.transaction(["passwords"], "readwrite");

    const index = passwords.value.findIndex(
      ({ roomId: rid }) => rid === roomId
    );
    passwords.value.splice(index, 1);
    trans.objectStore("passwords").delete(roomId);

    trans.oncomplete = () => resolve();
  });
}
