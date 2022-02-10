/**
 * Отправка сообщений и файлов
 */

import { ref, unref } from "vue";
import { userState } from "../auth";
import { MsgPendingFile, updateMessage, removeMessage } from "./messages";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";

/**
 * Отправка сообщения
 * @param roomId ID комнаты
 * @param text текст сообщения
 */
export function sendMessage(roomId: string, text: string) {
  const from = userState.value.uid;
  if (!from) throw new Error("First you need to log in");

  return addDoc(collection(getFirestore(), "messages"), {
    from,
    roomId,
    timestamp: serverTimestamp(),
    type: "message",
    text,
  });
}

/**
 * Генерирует id файла
 * @param roomId ID комнаты
 * @param from отправитель файла
 * @param fileName название файла
 */
function fileId(roomId: string, from: string, fileName: string) {
  fileName = roomId + "-" + from + "-" + fileName + "-" + Date.now();

  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    const chr = fileName.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export async function sendFile(roomId: string, file: File) {
  const from = userState.value.uid;
  if (!from) throw new Error("First you need to log in");

  const { name, size, type } = file;
  const fId = fileId(roomId, from, name);
  const arrayBuffer = await file.arrayBuffer();

  const uploadTask = uploadBytesResumable(
    storageRef(getStorage(), roomId + "/" + fId),
    arrayBuffer,
    { cacheControl: "public, max-age=31536000", contentType: type }
  );

  const message: MsgPendingFile = unref(
    ref({
      id: "pendingFile-" + fId,
      from,
      roomId,
      timestamp: Date.now(),
      isPending: true,

      name,
      size,
      type: "file",
      fileId: fId,

      cancel: () => uploadTask.cancel(),
      transferredSize: 0,
    })
  );

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      message.transferredSize = snapshot.bytesTransferred;
    },
    (error) => {
      console.error(error);
      removeMessage(message.id);
    },
    () => {
      addDoc(collection(getFirestore(), "messages"), {
        from,
        roomId,
        timestamp: serverTimestamp(),
        type: "file",
        name,
        size,
        fileId: fId,
      }).then(({ id }) => {
        console.log("changed message id (%s -> %s)", message.id, id);
        message.id = id;
      });
    }
  );

  updateMessage(message);
}
