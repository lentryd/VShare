import { ref } from "vue";
import { platform } from "@/plugins/device";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

export interface FUser {
  name: string;
  photo: string;
  isLoading: boolean;
}
export const user = ref<FUser>({
  name: "",
  photo: "",
  isLoading: true,
});

let unsubscribe: null | Unsubscribe = null;
export function init(id: string) {
  unsubscribe?.();
  user.value.isLoading = true;
  unsubscribe = onSnapshot(doc(getFirestore(), "users", id), (snapshot) => {
    if (id !== "none" && !snapshot.exists()) {
      setDoc(doc(getFirestore(), "users", id), {
        name: platform,
      });
      return;
    }

    const data = snapshot.data();

    user.value.name = data?.name ?? "";
    user.value.photo = data?.photo ?? "";
    user.value.isLoading = false;

    console.log("Update user data: " + JSON.stringify(data));
  });
}

export function get(id: string) {
  return getDoc(doc(getFirestore(), "users", id)).then((snapshot) =>
    snapshot.data()
  );
}
