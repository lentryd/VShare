import { ref } from "vue";
import { userState, onStateChanged } from "../auth/";
import {
  Unsubscribe,
  onSnapshot,
  query,
  collection,
  getFirestore,
  where,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export interface FRoomPreview {
  id: string;
  name: string;
  isMy: boolean;
  members: number;
}
export const rooms = ref<FRoomPreview[]>([]);
export const isLoading = ref(true);

function addRoom(room: FRoomPreview) {
  rooms.value.push(room);

  console.log("add room preview (id: %s)", room.id);
}
function updateRoom(room: FRoomPreview) {
  const index = rooms.value.findIndex(({ id }) => id === room.id);
  rooms.value[index] = room;

  console.log("update room preview (id: %s)", room.id);
}
function removeRoom(id: string) {
  const index = rooms.value.findIndex(({ id: id1 }) => id === id1);
  rooms.value.splice(index, 1);

  console.log("removed room preview (id: %s)", id);
}

let unsubscribe: null | Unsubscribe = null;
export function init() {
  onStateChanged(({ uid }) => {
    rooms.value = [];
    isLoading.value = !!uid;
    unsubscribe?.();
    if (!uid) return;

    unsubscribe = onSnapshot(
      query(
        collection(getFirestore(), "rooms"),
        where("members", "array-contains", uid)
      ),
      (snapshot) => {
        isLoading.value = false;
        console.group("Rooms listener");

        snapshot.docChanges().forEach(({ doc, type }) => {
          const data = doc.data();
          const room = {
            id: doc.id,
            name: data.name,
            isMy: userState.value.uid === data.creator,
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
      }
    );
  });
}

export function addMember(rid: string, uid: string) {
  if (!rooms.value.find(({ id }) => id === rid)?.isMy)
    throw new Error("Not allowed");

  updateDoc(doc(getFirestore(), "rooms", rid), "members", arrayUnion(uid));
}

export async function createRoom(name = "My Room") {
  const creator = userState.value.uid;
  if (!creator) throw new Error("Not allowed");

  return addDoc(collection(getFirestore(), "rooms"), {
    name,
    creator,
    members: [creator],
  }).then((doc) => doc.id);
}
