import { user } from "./auth";
import { App, ref, unref, watch } from "vue";
import {
  Query,
  Unsubscribe,
  QueryDocumentSnapshot,
  doc,
  where,
  query,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  getFirestore,
  getDocsFromCache,
} from "firebase/firestore";

export interface Chat {
  readonly id: string;
  readonly saved: boolean;
  readonly creator: string;
  readonly members: string[];
  readonly timestamp: Date;
}
export interface ChatDocument extends Omit<Chat, "id" | "timestamp"> {
  timestamp: number;
}
export const chats = ref<Chat[]>([]);
export const isLoading = ref<boolean>(true);

//Функции для работы с данными комнат
/**
 * Добавление/Обновление данных чата
 * @param data Данные чата
 */
function modifierChat(data: Chat): any {
  const index = chats.value.findIndex(({ id }) => id === data.id);

  if (index != -1) chats.value[index] = data;
  else chats.value.push(data);

  console.debug("Изменение данных чата (id: %s)\n", data.id, data);
}
/**
 * Удаление данных чата
 * @param id ID чата
 */
function removeChat(id: string) {
  const index = chats.value.findIndex(({ id: id1 }) => id === id1);
  chats.value.splice(index, 1);
  console.log("Удаление данных чата (id: %s)", id);
}
/**
 * Преобразование документа в данные приложения
 * @param doc Документ firestore
 */
function document2data(doc: QueryDocumentSnapshot<ChatDocument>) {
  return {
    id: doc.id,
    ...doc.data(),
    timestamp: new Date(doc.get("timestamp")?.seconds * 1000 || Date.now()),
  };
}

let unsubscribe: null | Unsubscribe;
function init(id?: string) {
  unsubscribe?.();
  chats.value = [];
  isLoading.value = true;
  if (!id) {
    isLoading.value = false;
    return;
  }

  const q = query(
    collection(getFirestore(), "chats"),
    where("members", "array-contains", id)
  );

  // Получаем чаты из кеша (для быстроты загрузки)
  getDocsFromCache<ChatDocument>(q as Query<ChatDocument>)
    .then((snapshot) => {
      console.debug("Получение чатов из кеша");

      snapshot.forEach((doc) => modifierChat(document2data(doc)));
    })
    .catch((e) => console.error("Не получилось загрузить чаты из кеша", e))
    .finally(() => (isLoading.value = !!chats.value.length));

  // Следим за обновлением данных на сервере
  unsubscribe = onSnapshot<ChatDocument>(
    q as Query<ChatDocument>,
    (snapshot) => {
      isLoading.value = false;
      console.debug("Получены новые данные чатов");

      snapshot.docChanges().forEach(({ doc, type }) => {
        switch (type) {
          case "added":
          case "modified":
            modifierChat(document2data(doc));
            break;

          case "removed":
            removeChat(doc.id);
            break;
        }
      });
    },
    (error) => console.error(error)
  );
}

/**
 * Проверка существует ли чат
 * @param id Id чата
 */
function exists(id: string) {
  return !!chats.value.find((c) => c.id == id);
}

/**
 * Удаление чата
 * @param id Id чата
 */
function deleteChat(id: string) {
  return deleteDoc(doc(getFirestore(), "chats", id));
}

/**
 * Изменение статуса чата
 * @param id Id чата
 * @param status Статус чата (сохранен или нет)
 */
function setStatus(id: string, status: boolean) {
  return updateDoc(doc(getFirestore(), "chats", id), { saved: status });
}

export default {
  install(app: App) {
    app.config.globalProperties.$chats = {
      exists,
      delete: deleteChat,
      setStatus,
    };

    Object.defineProperty(app.config.globalProperties.$chats, "items", {
      enumerable: true,
      get: () => unref(chats),
    });

    Object.defineProperty(app.config.globalProperties.$chats, "isLoading", {
      enumerable: true,
      get: () => unref(isLoading),
    });

    watch(user, (v) => init(v?.uid), { deep: true });
  },
};

export interface Chats {
  items: Chat[];
  isLoading: boolean;

  exists: typeof exists;
  delete: typeof deleteChat;
  setStatus: typeof setStatus;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $chats: Chats;
  }
}
