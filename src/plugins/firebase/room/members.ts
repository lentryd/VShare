import { ref } from "vue";
import { getDoc, doc, getFirestore } from "firebase/firestore";

export interface FMember {
  id: string;
  name: string;
  photo: string;
}
export const members = ref<FMember[]>([]);

export function init(users: string[]) {
  members.value = [];

  users.forEach(async (id) => {
    const data = (await getDoc(doc(getFirestore(), "users", id))).data();
    if (!data) return;

    members.value.push({
      id,
      name: data.name ?? "",
      photo: data.photo ?? "",
    });
  });
}

export function getMember(id: string) {
  const index = members.value.findIndex(({ id: id1 }) => id == id1);
  if (index < 0) return undefined;
  else return members.value[index];
}
