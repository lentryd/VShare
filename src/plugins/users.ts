import { user } from "./auth";
import { App, ref, unref, reactive, computed, watch } from "vue";
import {
  Unsubscribe as FUnsubscribe,
  DocumentReference,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

// Время действия слушателя
const UNSUBSCRIBE_TIMEOUT = 1.2e6;
// Системы, которые устанавливаются в качестве имени
const SYSTEMS = [
  { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
  { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
  { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
  { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
  { s: "Windows Vista", r: /Windows NT 6.0/ },
  { s: "Windows Server 2003", r: /Windows NT 5.2/ },
  { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
  { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
  { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
  { s: "Windows 98", r: /(Windows 98|Win98)/ },
  { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
  { s: "Windows NT 4.0", r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
  { s: "Windows CE", r: /Windows CE/ },
  { s: "Windows 3.11", r: /Win16/ },
  { s: "Android", r: /Android/ },
  { s: "Open BSD", r: /OpenBSD/ },
  { s: "Sun OS", r: /SunOS/ },
  { s: "Chrome OS", r: /CrOS/ },
  { s: "Linux", r: /(Linux|X11(?!.*CrOS))/ },
  { s: "iOS", r: /(iPhone|iPad|iPod)/ },
  { s: "Mac OS X", r: /Mac OS X/ },
  { s: "Mac OS", r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
  { s: "QNX", r: /QNX/ },
  { s: "UNIX", r: /UNIX/ },
  { s: "BeOS", r: /BeOS/ },
  { s: "OS/2", r: /OS\/2/ },
  {
    s: "Search Bot",
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
  },
];

// Работа с слушателями
interface Unsubscribe {
  userId: string;
  active: boolean;
  timeout: number;
  unsubscribe: FUnsubscribe;
}
const unsubscribes: Unsubscribe[] = [];
/**
 * Получение слушателя
 * @param userId ID пользователя
 */
function getUnsubscribe(userId: string, unsubscribe?: FUnsubscribe) {
  const exists = !!unsubscribes.find(({ userId: uid }) => (uid = userId));
  if (!exists && unsubscribe)
    unsubscribes.push({ userId, active: true, timeout: 0, unsubscribe });
  if (!exists && !unsubscribe) return undefined;

  return computed(
    () => unsubscribes.find(({ userId: uid }) => (uid = userId)) as Unsubscribe
  );
}
/**
 * Обновление/добавление слушателя пользователя
 * @param userId ID нужного пользователя
 * @param unsubscribe функция для удаления слушателя
 */
function updateUnsubscribe(userId: string, unsubscribe?: FUnsubscribe) {
  const uUnsubscribe = getUnsubscribe(userId, unsubscribe);
  if (!uUnsubscribe) return false;

  console.debug("Обновление пользовательского слушателя (uid: %s)", userId);
  clearTimeout(uUnsubscribe.value.timeout);
  uUnsubscribe.value.timeout = setTimeout(() => {
    if (!uUnsubscribe.value.active) return;

    uUnsubscribe.value.unsubscribe();
    uUnsubscribe.value.active = true;
    console.log("Удален пользовательский слушатель (uid: %s)", userId);
  }, UNSUBSCRIBE_TIMEOUT) as unknown as number;
  return true;
}

// Данные пользователя
export interface User {
  id: string;
  name: string;
  avatar: number;
  timestamp: Date;
}
export interface UserDocument extends Omit<User, "id" | "timestamp"> {
  timestamp: number;
}
export const users: { [id: string]: undefined | User } = reactive({});
/**
 * Получение пользовательских данных
 * @param id ID пользователя
 */
export function getUser(
  id: string,
  callback?: (user: undefined | User) => void
) {
  if (updateUnsubscribe(id)) return callback?.(users[id]);

  console.debug("Создание пользовательского слушателя (uid: %s)", id);
  const d = doc(getFirestore(), "users", id) as DocumentReference<UserDocument>;
  const unsubscribe = onSnapshot(d, (doc) => {
    console.debug("Получены данные пользователя (id: %s)", doc.id);

    let user = users[doc.id];
    const newData = !doc.exists()
      ? undefined
      : {
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(
            doc.get("timestamp")?.seconds * 1000 || Date.now()
          ),
        };

    if (user && newData) {
      user.id = doc.id;
      user.name = newData.name;
      user.avatar = newData.avatar ?? 0;
      user.timestamp = newData.timestamp;
    } else user = users[doc.id] = newData;

    callback?.(user);
    callback = undefined;
  });

  updateUnsubscribe(id, unsubscribe);
}
/**
 * Создание нового пользователя
 * @param id ID текущего пользователя
 */
function createUser(id: string) {
  let name = "Anonymous";
  for (let sys of SYSTEMS) if (sys.r.test(navigator.userAgent)) name = sys.s;
  console.debug("Создание пользовательских данных (uid: %s)", id);

  return setDoc(doc(getFirestore(), "users", id), {
    name,
    avatar: 0,
    timestamp: serverTimestamp(),
  });
}

// Изменение данных
/**
 * Изменение имени пользователя
 * @param name Новое имя пользователя
 */
async function setName(name: string) {
  const id = user.value?.uid;
  if (!id) throw new Error("Необходимо авторизоваться");

  return updateDoc(doc(getFirestore(), "users", id), { name });
}
/**
 * Изменение аватара пользователя
 * @param avatar Номер нового аватара
 */
async function setAvatar(avatar: number) {
  const id = user.value?.uid;
  if (!id) throw new Error("Необходимо авторизоваться");

  return updateDoc(doc(getFirestore(), "users", id), { avatar });
}

export const me = ref<undefined | User>(undefined);
let unsubscribe: null | FUnsubscribe = null;
function init(id?: string) {
  unsubscribe?.();
  me.value = undefined;
  if (!id) return;

  const d = doc(getFirestore(), "users", id) as DocumentReference<UserDocument>;
  unsubscribe = onSnapshot(d, (doc) => {
    console.debug("Получены данные текущего пользователя.\n", doc.data());
    if (!doc.exists()) return createUser(id);

    me.value = {
      id: doc.id,
      ...doc.data(),
      timestamp: new Date(doc.get("timestamp")?.seconds * 1000 || Date.now()),
    };
  });
}

export default {
  install(app: App) {
    app.config.globalProperties.$users = {
      getUser: async (id: string) => {
        return new Promise((resolve) => getUser(id, resolve));
      },
      setName,
      setAvatar,
    };

    Object.defineProperty(app.config.globalProperties.$users, "me", {
      enumerable: true,
      get: () => unref(me),
    });

    watch(user, (u) => init(u?.uid), { deep: true });
  },
};

export interface Users {
  /**
   * Данные текущего пользователя
   *
   * _Обновляются в реальном времени_
   */
  me: User;

  /**
   * Получить данные пользователя
   * @param id ID пользователя
   * @returns Вернет реактивные данные
   */
  getUser: (id: string) => Promise<User | undefined>;
  setName: typeof setName;
  setAvatar: typeof setAvatar;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $users: Users;
  }
}
