import { Chat, chats } from "@/plugins/chats";
import { me, users, getUser } from "@/plugins/users";
import { Ref, ref, computed, onMounted } from "vue";

export interface ChatInfo extends Chat {
  name: string;
  isMy: boolean;
  avatarUrl: string;
}

function getUrl(id = 0) {
  return (process.env.BASE_URL ?? "/") + "img/avatars/" + id + ".png";
}

export default function useChatInfo(id: Ref<undefined | string>, load = false) {
  // Требуемый чат
  const chat = computed(() => chats.value.find((c) => c.id === id.value));
  // Показатель загрузки данных
  const loading = ref(load);
  // Данные другого пользователя
  const otherUser = computed(() => {
    const id = chat.value?.members.find((m) => m != me.value?.id);
    if (!id) return (loading.value = false), undefined;

    getUser(id, () => (loading.value = false));
    return users[id];
  });
  // Данные чата
  const chatInfo = computed(() => {
    if (!chat.value) return undefined;
    const obj = {
      ...chat.value,
      name: "",
      isMy: chat.value?.creator == me.value?.id,
      avatarUrl: "",
    };

    Object.defineProperty(obj, "name", {
      get: () => (otherUser.value ? otherUser.value.name : me.value?.name),
    });
    Object.defineProperty(obj, "avatarUrl", {
      get: () =>
        getUrl(otherUser.value ? otherUser.value.avatar : me.value?.avatar),
    });

    return obj;
  });

  // Начинаем загрузку данных при отрисовки компонента
  onMounted(() => (!load ? null : otherUser.value));

  return { loading, chatInfo };
}
