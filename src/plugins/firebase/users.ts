import { user } from "./auth";
import { App, ref, unref, watch } from "vue";
import {
  Unsubscribe as FUnsubscribe,
  DocumentReference,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

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

// Данные пользователя
export interface User {
  id: string;
  name: string;
  avatar: number;
  bubbles: string[];
  timestamp: Date;
}
export interface UserDocument extends Omit<User, "id" | "timestamp"> {
  timestamp: number;
}
/**
 * Получить данные пользователя
 * @param id Идентификатор пользователя
 */
async function getUser(id: string): Promise<User | undefined> {
  const d = doc(getFirestore(), "users", id) as DocumentReference<UserDocument>;
  const snap = await getDoc(d);

  return !snap.exists()
    ? undefined
    : {
        id: snap.id,
        ...snap.data(),
        timestamp: new Date(
          snap.get("timestamp")?.seconds * 1000 || Date.now()
        ),
      };
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
    bubbles: [],
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
/**
 * Добавление нового пузырика
 * @param bid Идентификатор пузырика
 */
export async function addBubble(bid: string) {
  const id = user.value?.uid;
  if (!id) throw new Error("Необходимо авторизоваться");

  return updateDoc(doc(getFirestore(), "users", id), {
    bubbles: arrayUnion(bid),
  });
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
    app.config.globalProperties.$fb.users = {
      getUser,
      setName,
      setAvatar,
      addBubble,
    };

    Object.defineProperty(app.config.globalProperties.$fb.users, "state", {
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
  state: User;

  /**
   * Получить данные пользователя
   * @param id ID пользователя
   */
  getUser: typeof getUser;
  /**
   * Изменить имя пользователя
   * @param name Имя пользователя
   */
  setName: typeof setName;
  /**
   * Изменить аватар пользователя
   * @param avatar Номер аватара
   */
  setAvatar: typeof setAvatar;
  /**
   * Добавление нового пузырика
   * @param bid Идентификатор пузырика
   */
  addBubble: typeof addBubble;
}
