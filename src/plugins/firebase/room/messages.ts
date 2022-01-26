import { ref, unref } from "vue";
import { userState } from "../auth/";
import { save as saveFile } from "@/plugins/idb/files";
import {
  Unsubscribe,
  onSnapshot,
  query,
  collection,
  getFirestore,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";

// Содержимое всех сообщений
interface MsgBase {
  id: string;
  from: string;
  roomId: string;
  timestamp: number;
  isPending: boolean;
}
// Содержимое текстовых сообщений
interface MsgText extends MsgBase {
  text: string;
  type: "message";
}
// Содержимое сообщений с файлом
interface MsgFile extends MsgBase {
  name: string;
  size: number;
  type: "file";
  fileId: number;
}
// Содержимое отправляемого файла
interface MsgPendingFile extends MsgFile {
  cancel: () => boolean;
  transferredSize: number;
}
export type FMessage = MsgText | MsgFile | MsgPendingFile;

export const messages = ref<FMessage[]>([]);

/**
 * Добавление сообщения
 * @param message новое сообщение
 */
function addMessage(message: FMessage) {
  if (
    message.type == "file" &&
    message.isPending &&
    messages.value.find((m) => m.type == "file" && m.fileId == message.fileId)
  ) {
    updateMessage(message);
    return;
  }

  messages.value.push(message);

  console.log("added message (id: %s)", message.id);
}
/**
 * Обновление сообщения
 * @param message новое содержимое сообщения
 */
function updateMessage(message: FMessage) {
  const index = messages.value.findIndex(({ id }) => id === message.id);
  messages.value[index] = message;
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

let unsubscribe: null | Unsubscribe = null;
export function init(roomId: string) {
  unsubscribe?.();
  messages.value = messages.value.filter(
    (m) => m.type == "file" && m.isPending
  );

  unsubscribe = onSnapshot(
    query(
      collection(getFirestore(), "messages"),
      where("roomId", "==", roomId)
    ),
    (snapshot) => {
      console.group("Message listener");

      snapshot.docChanges().forEach(({ doc, type }) => {
        const isPending = doc.metadata.hasPendingWrites;
        const timestamp = !isPending
          ? doc.get("timestamp").seconds * 1000
          : Date.now();
        const message = {
          ...doc.data(),
          id: doc.id,
          isPending,
          timestamp,
        } as FMessage;

        switch (type) {
          case "added":
            addMessage(message);
            break;

          case "modified":
            updateMessage(message);
            break;

          case "removed":
            removeMessage(doc.id);
            break;
        }
      });

      console.groupEnd();
    }
  );
}

export function sendMessage(roomId: string, text: string) {
  const from = userState.value.uid;
  if (!from) return;

  addDoc(collection(getFirestore(), "messages"), {
    from,
    roomId,
    timestamp: serverTimestamp(),
    type: "message",
    text,
  });
}

function fileHash(roomId: string, from: string, fileName: string) {
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
  if (!from) return;

  const { name, size, type } = file;
  const fileId = fileHash(roomId, from, name);
  const arrayBuffer = await file.arrayBuffer();

  const uploadTask = uploadBytesResumable(
    storageRef(getStorage(), roomId + "/" + fileId),
    arrayBuffer,
    { contentType: type }
  );

  const message: MsgPendingFile = unref(
    ref({
      id: "pendingFile-" + fileId,
      from,
      roomId,
      timestamp: Date.now(),
      isPending: true,

      name,
      size,
      type: "file",
      fileId,

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
      saveFile({
        id: fileId,
        name,
        type: type || "application/octet-stream",
        data: arrayBuffer,
      });

      addDoc(collection(getFirestore(), "messages"), {
        from,
        roomId,
        timestamp: serverTimestamp(),
        type: "file",
        name,
        size,
        fileId,
      }).then(({ id }) => {
        console.log("changed message id (%s -> %s)", message.id, id);
        message.id = id;
      });
    }
  );

  addMessage(message);
}
