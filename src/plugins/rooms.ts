import { App, ref, unref, watch } from "vue";
import {
  Unsubscribe,
  where,
  query,
  addDoc,
  onSnapshot,
  collection,
  getFirestore,
  getDocsFromCache,
} from "firebase/firestore";
import { state } from "./auth";

/**
 * Создание комнаты
 * @param name Название новой комнаты
 */
async function createRoom(name: string) {
  const creator = state.value.uid;
  if (!creator) throw new Error("User not logged in");

  return addDoc(collection(getFirestore(), "rooms"), {
    name,
    creator,
    members: [creator],
  }).then(({ id }) => id);
}

export interface RoomData {
  id: string;
  name: string;
  isMy: boolean;
  photo?: string;
  members: number;
}
export const rooms = ref<RoomData[]>([]);
export const isLoading = ref<boolean>(true);

//Функции для работы с данными комнат
/**
 * Добавление данных комнаты
 * @param data Данные комнаты
 */
function addRoom(data: RoomData) {
  if (rooms.value.findIndex(({ id }) => id === data.id) != -1) {
    updateRoom(data);
    return;
  }

  rooms.value.push(data);
  console.log("add room data (id: %s)", data.id);
}
/**
 * Обновление данных комнаты
 * @param data Данные комнаты
 */
function updateRoom(data: RoomData) {
  const index = rooms.value.findIndex(({ id }) => id === data.id);
  if (index == -1) {
    addRoom(data);
    return;
  }

  rooms.value[index] = data;
  console.log("update room data (id: %s)", data.id);
}
/**
 * Удаление данных комнаты
 * @param id ID комнаты
 */
function removeRoom(id: string) {
  const index = rooms.value.findIndex(({ id: id1 }) => id === id1);
  rooms.value.splice(index, 1);
  console.log("removed room data (id: %s)", id);
}

let unsubscribe: null | Unsubscribe = null;
/**
 * Инициализация плагина
 * @param id ID пользователя
 */
function init(id?: string) {
  unsubscribe?.();
  rooms.value = [];
  isLoading.value = true;
  if (!id) {
    isLoading.value = false;
    return;
  }
  const q = query(
    collection(getFirestore(), "rooms"),
    where("members", "array-contains", id)
  );

  getDocsFromCache(q)
    .then((snapshot) => {
      console.group("Rooms from cache");

      snapshot.forEach((doc) => {
        const data = doc.data();
        addRoom({
          id: doc.id,
          name: data.name,
          isMy: id === data.creator,
          members: data.members.length,
        });
      });

      console.groupEnd();
    })
    .catch((e) => console.error("Failed to load rooms from cache", e))
    .finally(() => (isLoading.value = !!rooms.value.length));

  unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      isLoading.value = false;
      console.group("Rooms listener");

      snapshot.docChanges().forEach(({ doc, type }) => {
        const data = doc.data();
        const room = {
          id: doc.id,
          name: data.name,
          isMy: id === data.creator,
          members: data.members.length,
        };

        switch (type) {
          case "added":
            addRoom(room);
            break;

          case "modified":
            updateRoom(room);
            break;

          case "removed":
            removeRoom(doc.id);
            break;
        }
      });

      console.groupEnd();
    },
    (error) => console.error(error)
  );
}

export default {
  install(app: App) {
    app.config.globalProperties.$rooms = {
      data: {},
      createRoom,
    };

    Object.defineProperty(app.config.globalProperties.$rooms, "data", {
      enumerable: true,
      get: () => unref(rooms),
    });

    watch(state, ({ uid }) => init(uid), { deep: true });
  },
};

export interface Rooms {
  data: RoomData[];

  createRoom: typeof createRoom;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $rooms: Rooms;
  }
}
