/**
 * Получение/хранение/обновление сообщений
 */

import { App, ref, unref } from "vue";
import {
  Unsubscribe as FUnsubscribe,
  getFirestore,
  query,
  collection,
  where,
  getDocsFromCache,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

// Время действия слушателя
const UNSUBSCRIBE_TIMEOUT = 1.8e6;

// Содержимое всех сообщений
export interface MsgBase {
  id: string;
  from: string;
  roomId: string;
  timestamp: number;
  isPending: boolean;
}
// Содержимое текстовых сообщений
export interface MsgText extends MsgBase {
  text: string;
  type: "message";
}
// Содержимое сообщений с файлом
export interface MsgFile extends MsgBase {
  url: string;
  name: string;
  size: number;
  type: "file";
  fileId: number;
}
// Содержимое отправляемого файла
export interface MsgPendingFile extends MsgFile {
  cancel: () => boolean;
  transferredSize: number;
}
export type State = MsgText | MsgFile | MsgPendingFile;
// Данные для отключения слушателя
interface Unsubscribe {
  roomId: string;
  timeout: number;
  unsubscribe: FUnsubscribe;
}

const unsubscribes: Unsubscribe[] = [];
/**
 * Обновление/добавление слушателей комнаты
 * @param roomId ID нужной комнаты
 * @param unsubscribe функция для удаления слушателя
 */
function updateUnsubscribe(roomId: string, unsubscribe?: FUnsubscribe) {
  let index = unsubscribes.findIndex(({ roomId: rId }) => rId == roomId);
  if (index == -1 && !unsubscribe) return false;
  if (index == -1 && unsubscribe)
    index = unsubscribes.push({ roomId, timeout: 0, unsubscribe }) - 1;

  console.log("Updated message listener for room (id: %s)", roomId);
  clearTimeout(unsubscribes[index].timeout);
  unsubscribes[index].timeout = setTimeout(() => {
    const index = unsubscribes.findIndex(({ roomId: rId }) => rId == roomId);
    if (index == -1) return;

    unsubscribes[index].unsubscribe();
    unsubscribes.splice(index, 1);
    console.log("Removed message listener for room (id: %s)", roomId);
  }, UNSUBSCRIBE_TIMEOUT) as unknown as number;
  return true;
}

export const messages = ref<State[]>([]);
export const loadingRooms = ref<{ [key: string]: boolean }>({});

/**
 * Обновление/добавление сообщения
 * @param msg новое содержимое сообщения
 */
function updateMessage(msg: State) {
  let index = messages.value.findIndex(
    (m) =>
      m.id === msg.id ||
      (msg.isPending &&
        m.type == "file" &&
        msg.type == "file" &&
        m.fileId == msg.fileId)
  );
  if (index == -1) messages.value.push(msg);
  else messages.value[index] = msg;

  console.log(
    "%s message (id: %s)",
    index == -1 ? "added" : "modified",
    msg.id
  );
}

/**
 * Удаление сообщения
 * @param id id сообщения
 */
function removeMessage(id: string) {
  const index = messages.value.findIndex(({ id: id1 }) => id === id1);
  messages.value.splice(index, 1);

  console.log("removed message (id: %s)", id);
}

/**
 * Получение сообщений комнаты
 * @param roomId ID комнаты
 */
async function loadMessages(roomId: string) {
  if (updateUnsubscribe(roomId)) return;
  loadingRooms.value[roomId] = true;
  const q = query(
    collection(getFirestore(), "messages"),
    where("roomId", "==", roomId)
  );

  // Получаем кеш (иллюзия быстрой работы)
  getDocsFromCache(q)
    .then((snapshot) => {
      if (snapshot.empty) return;
      console.group("Message Messages from cache");

      snapshot.forEach((snapshot) =>
        updateMessage({
          ...snapshot.data(),
          id: snapshot.id,
          isPending: false,
          timestamp: snapshot.get("timestamp").seconds * 1000,
        } as State)
      );

      console.groupEnd();
      loadingRooms.value[roomId] = false;
    })
    .catch((e) => console.error("Failed to retrieve messages from cache", e));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    console.group("Room message listener (id: %s)", roomId);

    snapshot.docChanges().forEach(async ({ doc, type }) => {
      switch (type) {
        case "added":
        case "modified":
          let url: undefined | string = undefined;
          if (doc.get("type") == "file") {
            url = await getDownloadURL(
              storageRef(getStorage(), roomId + "/" + doc.get("fileId"))
            );
          }

          updateMessage({
            ...doc.data(),
            id: doc.id,
            url,
            isPending: doc.metadata.hasPendingWrites,
            timestamp:
              (doc.get("timestamp")?.seconds ?? Date.now() / 1000) * 1000,
          } as State);
          break;

        case "removed":
          removeMessage(doc.id);
          break;
      }
    });

    console.groupEnd();
    loadingRooms.value[roomId] = false;
  });

  updateUnsubscribe(roomId, unsubscribe);
}

export default {
  install(app: App) {
    app.config.globalProperties.$messages = {
      loadMessages,
    };

    Object.defineProperty(app.config.globalProperties.$messages, "state", {
      enumerable: true,
      get: () =>
        unref(messages).sort(({ timestamp: t }, { timestamp: t1 }) => +t - +t1),
    });
    Object.defineProperty(
      app.config.globalProperties.$messages,
      "loadingRooms",
      {
        enumerable: true,
        get: () => unref(loadingRooms),
      }
    );
  },
};

export interface Messages {
  state: State[];
  loadingRooms: { [roomId: string]: boolean };

  loadMessages: typeof loadMessages;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $messages: Messages;
  }
}
