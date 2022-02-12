export { members, FMember, getMember } from "./members";
export { messages, FMessage } from "./messages";
export { sendFile, sendMessage } from "./form";

import { ref } from "vue";
import { rooms } from "../rooms";
import { userState } from "../auth/";
import { init as initMembers } from "./members";
import { init as initMessages } from "./messages";
import {
  Unsubscribe,
  onSnapshot,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

export interface FRoom {
  id: string;
  name: string;
  isMy: boolean;
  isExist: boolean;
  members: string[];
}
export const room = ref<FRoom>({
  id: "",
  name: "",
  isMy: false,
  isExist: false,
  members: [],
});

let unsubscribe: null | Unsubscribe = null;
export function selectRoom(id: string) {
  initMessages(id);

  const lRoom = rooms.value.find(({ id: rid }) => rid === id);
  room.value.id = id;
  room.value.name = lRoom?.name ?? "";
  room.value.isMy = lRoom?.isMy ?? false;
  room.value.isExist = !!lRoom;

  unsubscribe?.();
  unsubscribe = onSnapshot(doc(getFirestore(), "rooms", id), (snapshot) => {
    const data = snapshot.data();

    room.value.name = data?.name ?? "";
    room.value.isMy = data?.creator == userState.value.uid;
    room.value.isExist = !!snapshot.exists();
    room.value.members = data?.members ?? [];

    initMembers(room.value.members);

    console.log("Update room data (id: %s)", id);
  });
}

export function renameRoom(name: string) {
  if (!room.value.isMy) return;

  return setDoc(
    doc(getFirestore(), "rooms", room.value.id),
    { name },
    { merge: true }
  );
}
