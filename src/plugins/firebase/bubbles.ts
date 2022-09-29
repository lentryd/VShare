import { user } from "./auth";
import { nanoid } from "nanoid";
import { reactive, App } from "vue";
import {
  doc,
  where,
  query,
  getDocs,
  collection,
  onSnapshot,
  getFirestore,
  serverTimestamp,
  Unsubscribe as FUnsubscribe,
  DocumentReference,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { me, addBubble } from "./users";

// Время действия слушателя
const UNSUBSCRIBE_TIMEOUT = 1.8e6;

// Содержимое всех пузыриков
export interface Bubble {
  id: string;
  files: number[];
  shortId: string;
  creator: string;
  timestamp: Date;
  isLoading: boolean;
  description: string;
}
export interface BubbleDocument extends Omit<Bubble, "id" | "timestamp"> {
  timestamp: number;
}

// Данные для отключения слушателя
interface Unsubscribe {
  bId: string;
  data: Bubble;
  timeout: number;
  unsubscribe: FUnsubscribe;
}
const unsubscribes: Unsubscribe[] = [];

/**
 * Преобразует сокращенный идентификатор в полный
 * @param id Сокращенный или полный идентификатор
 * @returns
 */
async function getFullId(id: string) {
  if (id.length == 8) {
    const docs = await getDocs(
      query(collection(getFirestore(), "bubbles"), where("shortId", "==", id))
    );
    if (docs.empty) return undefined;
    return docs.docs[0].id;
  } else return id;
}

/**
 * Поиск данных для отмены слушателя
 * @param bId Идентификатор пузырика
 */
function findUnsubscribe(bId: string) {
  return unsubscribes.findIndex(({ bId: bubbleId }) => bId == bubbleId);
}

/**
 * Обновление/добавление слушателей комнаты
 * @param bId ID нужной комнаты
 * @param unsub функция для удаления слушателя
 */
function updateUnsubscribe(bId: string, unsub?: FUnsubscribe, data?: Bubble) {
  let index = findUnsubscribe(bId);
  if (index == -1 && unsub && data)
    unsubscribes.push({ bId, data, timeout: 0, unsubscribe: unsub });
  else return undefined;

  index = findUnsubscribe(bId);
  console.debug("Updated listener for bubble (id: %s)", bId);
  clearTimeout(unsubscribes[index].timeout);
  unsubscribes[index].timeout = setTimeout(() => {
    const index = findUnsubscribe(bId);
    if (index == -1) return;

    unsubscribes[index].unsubscribe();
    unsubscribes.splice(index, 1);
    console.debug("Removed listener for bubble (id: %s)", bId);
  }, UNSUBSCRIBE_TIMEOUT) as unknown as number;
  return unsubscribes[index].data;
}

/**
 * Получить данные пузырика с сервера
 * @param id Полный или сокращенный идентификатор пузырика
 */
export async function read(id: string) {
  const fullId = await getFullId(id);
  if (!fullId) return undefined;
  else id = fullId;

  const updateResult = updateUnsubscribe(id);
  if (updateResult) return updateResult;

  return new Promise<undefined | Bubble>((resolve) => {
    const d = doc(
      getFirestore(),
      "bubbles",
      id
    ) as DocumentReference<BubbleDocument>;
    const result = reactive({}) as Bubble;
    let resolved = false;
    const unsubscribe = onSnapshot(d, (doc) => {
      if (!doc.exists()) {
        resolve(undefined);
        unsubscribe();
        return;
      }
      if (me.value?.bubbles.includes(id) === false) addBubble(id);

      const newData = doc.data();
      result.id = doc.id;
      result.files = newData.files;
      result.shortId = newData.shortId;
      result.creator = newData.creator;
      result.timestamp = new Date(
        doc.get("timestamp")?.seconds * 1000 || Date.now()
      );
      result.isLoading = newData.isLoading;
      result.description = newData.description;

      if (resolved) return;
      resolve(result);
      resolved = true;
      updateUnsubscribe(id, unsubscribe, result);
    });
  });
}

/**
 * Создание нового пузырика
 * @param description Описание пузырика
 * @param isLoading Загружаются ли файлы в этот пузырик
 */
export async function write(description: string, isLoading = true) {
  const creator = user.value?.uid;
  if (!creator) throw new Error("Need auth");

  return addDoc(collection(getFirestore(), "bubbles"), {
    files: [],
    creator,
    shortId: nanoid(8),
    isLoading,
    timestamp: serverTimestamp(),
    description,
  }).then(({ id }) => id);
}

/**
 * Регистрация файла в пузырике
 * @param bubbleId Идентификатор пузырика
 * @param fileId Идентификатор файла
 */
export async function addFile(bubbleId: string, fileId: number) {
  const fullId = await getFullId(bubbleId);
  if (!fullId) throw new Error(`Wrong bubble id ${bubbleId}`);
  else bubbleId = fullId;

  return updateDoc(doc(getFirestore(), "bubbles", bubbleId), {
    files: arrayUnion(fileId),
  });
}

/**
 * Установка статуса загрузки пузырика
 * @param bubbleId Идентификатор пузырика
 * @param status Статус загрузки
 */
export async function setStatus(bubbleId: string, status: boolean) {
  const fullId = await getFullId(bubbleId);
  if (!fullId) throw new Error(`Wrong bubble id ${bubbleId}`);
  else bubbleId = fullId;

  return updateDoc(doc(getFirestore(), "bubbles", bubbleId), {
    isLoading: status,
  });
}

/**
 * Удаление файла из пузырике
 * @param bubbleId Идентификатор пузырика
 * @param fileId Идентификатор файла
 */
export async function removeFile(bubbleId: string, fileId: number) {
  const fullId = await getFullId(bubbleId);
  if (!fullId) throw new Error(`Wrong bubble id ${bubbleId}`);
  else bubbleId = fullId;

  return updateDoc(doc(getFirestore(), "bubbles", bubbleId), {
    files: arrayRemove(fileId),
  });
}

export default {
  install(app: App) {
    app.config.globalProperties.$fb.bubbles = {
      get: read,
      add: write,
      addFile,
      removeFile,
    };
  },
};

export interface Bubbles {
  /**
   * Получить данные пузырика
   * @param id Идентификатор пузырика (полное либо сокращенное)
   * @return Вернет реактивные данные
   */
  get: typeof read;
  /**
   * Создать пузырик
   * @param description Описание пузырика
   * @param isLoading Загружены ли все данные пузырика
   */
  add: typeof write;
  /**
   * Регистрация файла в пузырике
   * @param bubbleId Идентификатор пузырика
   * @param fileId Идентификатор файла
   */
  addFile: typeof addFile;
  /**
   * Удаление файла из пузырике
   * @param bubbleId Идентификатор пузырика
   * @param fileId Идентификатор файла
   */
  removeFile: typeof removeFile;
}
