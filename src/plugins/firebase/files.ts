import { ref, unref, watch, reactive, App } from "vue";
import { addFile, setStatus } from "./bubbles";
import {
  files,
  write as writeFile,
  remove as removeFile,
  IDBFile,
} from "@/plugins/idb/files";
import {
  ref as storageRef,
  getStorage,
  getMetadata,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export interface FBFile extends IDBFile {
  cancel?: () => boolean;
  transferredSize?: number;
}

function getRef(id: number) {
  return storageRef(getStorage(), id.toString());
}

export const state = ref<FBFile[]>([]);

/**
 * Получить данные файла
 * @param id Идентификатор файла
 * @returns Реактивные данные
 */
export async function read(id: number): Promise<FBFile | undefined> {
  const local = state.value.find((f) => f.id === id);
  if (local) return local;

  const meta = await getMetadata(getRef(id)).catch(() => undefined);
  if (!meta || !meta.customMetadata) return undefined;

  const downloadURL = await getDownloadURL(getRef(id));
  return writeFile({
    id,
    name: meta.customMetadata.name,
    type: meta.customMetadata.type,
    size: meta.size,
    bubbleId: meta.customMetadata.bubbleId,
    downloadURL,
    isLoaded: true,
  });
}

/**
 * Обработка ошибки загрузки (перезапуск)
 * @param file Данные файла
 */
function errUpload(file: IDBFile) {
  state.value = state.value.filter((f) => f.id != file.id);
  write(file);
}

/**
 * Обработка завершения загрузки
 * @param file Данные файла
 */
async function doneUpload(file: IDBFile) {
  const downloadURL = await getDownloadURL(getRef(file.id));
  addFile(file.bubbleId, file.id);
  writeFile({ ...file, data: undefined, downloadURL, isLoaded: true });

  setTimeout(() => {
    if (!state.value.find((f) => !f.isLoaded && f.bubbleId == file.bubbleId))
      setStatus(file.bubbleId, false);
  }, 0);
}

/**
 * Загрузка файла в хранилище
 * @param file Данные файла
 * @returns Реактивные данные
 */
export function write(file: IDBFile) {
  if (!file.data) throw new Error("UploadFile requires a data object");

  const activeUpload = state.value.find(
    ({ id }) => id == file.id && "cancel" in file
  );
  if (activeUpload) return activeUpload;

  const task = uploadBytesResumable(getRef(file.id), file.data, {
    contentType: file.type,
    cacheControl: "public, max-age=31536000",
    customMetadata: {
      name: file.name,
      type: file.type,
      bubbleId: file.bubbleId,
    },
    contentDisposition: `attachment; filename="${file.name}"`,
  });
  const result = reactive({
    ...file,
    cancel: () => task.cancel(),
  }) as FBFile;

  task.on(
    "state_changed",
    ({ bytesTransferred }) => (result.transferredSize = bytesTransferred),
    () => errUpload(file),
    () => setTimeout(() => doneUpload(file), 0)
  );

  result.cancel = () => (task.cancel(), remove(file.id));
  state.value.push(result);

  return result;
}

/**
 * Удаление файла из хранилища
 * @param id Идентификатор файла
 */
export function remove(id: number) {
  const local = state.value.find((f) => f.id === id);
  if (local?.cancel) {
    state.value = state.value.filter((f) => f.id != id);
    removeFile(id);
    return local.cancel();
  }

  deleteObject(getRef(id));
  return true;
}

/**
 * Инициализация плагина (подписка на изменения)
 */
function init() {
  files.value.forEach((file) => {
    if (file.isLoaded) {
      const index = state.value.findIndex((f) => f.id === file.id);
      if (index != -1) state.value[index] = file;
      else state.value.push(file);
    } else {
      console.debug("File", file.id, "is not loaded, loading...");
      write(file);
    }
  });
}

export default {
  install(app: App) {
    app.config.globalProperties.$fb.files = { get: read, add: write, remove };

    Object.defineProperty(app.config.globalProperties.$fb.files, "state", {
      enumerable: true,
      get: () => unref(state),
    });

    watch(files, init, { deep: true });
  },
};

export interface Files {
  state: FBFile[];

  /**
   * Получить данные файла
   * @param id Идентификатор файла
   */
  get: typeof read;
  /**
   * Загрузка файла в хранилище
   * @param file Данные файла
   * @returns Реактивные данные
   */
  add: typeof write;
  /**
   * Удаление файла из хранилища
   * @param id Идентификатор файла
   */
  remove: typeof remove;
}
