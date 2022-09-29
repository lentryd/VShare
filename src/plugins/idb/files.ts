import { ref } from "vue";
import mime from "mime-types";
import { getDb } from "./index";

export interface IDBFile {
  /**
   * Идентификатор файла (локальный, обычно это его хэш)
   */
  id: number;
  /**
   * Локальное название файла
   */
  name: string;
  /**
   * Тип файла (нужен для удобного скачивания файлов)
   */
  type: string;
  /**
   * Размер файла (в байтах)
   */
  size: number;
  /**
   * Данные файла, доступны только для незагруженных файлов
   */
  data?: ArrayBuffer;
  /**
   * Идентификатор пузырика (группа в которую определен файл)
   */
  bubbleId: string;
  /**
   * Индикатор загрузки
   */
  isLoaded: boolean;
  /**
   * Ссылка для скачивания файла из облачного хранилища
   */
  downloadURL?: string;
}

export const files = ref<IDBFile[]>([]);

/**
 * Читает локальную базу данных и записывает найденные данные в переменную
 */
export async function init() {
  let db = await getDb();

  return new Promise<void>((resolve) => {
    const trans = db.transaction(["files"], "readonly");
    files.value = [];

    trans.objectStore("files").openCursor().onsuccess = function () {
      const cursor = this.result;
      if (!cursor) return;

      files.value.push({ id: cursor.key, ...cursor.value });
      cursor.continue();
    };

    trans.oncomplete = () => resolve();
  });
}

/**
 * Чтение информации о файле
 * @param id Идентификатор файла
 * @returns Информация о файле
 */
export async function read(id: number) {
  return files.value.find((f) => f.id === id);
}

/**
 * Добавление/Обновление данных файла
 * @param id Идентификатор файла
 * @param file Данные файла
 * @returns Идентификатор файла
 */
export async function write(file: IDBFile) {
  const db = await getDb();
  const trans = db.transaction(["files"], "readwrite");

  return new Promise<IDBFile>((resolve) => {
    const index = files.value.findIndex((f) => f.id == file.id);
    if (index != -1) files.value[index] = file;
    else files.value.push(file);

    trans.oncomplete = () => resolve(file);
    trans.objectStore("files").put(file);
  });
}

/**
 * Удаление файла
 * @param id Идентификатор файла
 */
export async function remove(id: number) {
  const db = await getDb();

  return new Promise<void>((resolve) => {
    const trans = db.transaction(["files"], "readwrite");
    const index = files.value.findIndex((f) => f.id === id);
    const deleteStore = trans.objectStore("files").delete(id);

    deleteStore.onsuccess = () => {
      files.value.splice(index, 1);
      resolve();
    };
  });
}

/**
 * Генерация хеша
 * @param file Нативный файл
 * @param secrets Различные дополнительные секреты
 * @returns Идентификатор файла
 */
export function fileHash(file: File, ...secrets: string[]) {
  const info = [
    file.name,
    file.type,
    file.size.toString(),
    file.lastModified.toString(),
    ...secrets,
  ];
  const fileName = info.join("-");

  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    const chr = fileName.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

/**
 * Преобразования обычного файла в объект хранилища
 * @param file Файл локального хранилища
 * @param bubbleId Идентификатор пузырика
 * @param secrets Различные дополнительные секреты
 */
export async function formateFile(
  file: File,
  bubbleId: string,
  ...secrets: string[]
) {
  const type = mime.lookup(file.name) || file.type;

  return {
    id: fileHash(file, type, ...secrets),
    type,
    name: file.name,
    size: file.size,
    data: await file.arrayBuffer(),
    bubbleId,
    isLoaded: false,
  };
}
