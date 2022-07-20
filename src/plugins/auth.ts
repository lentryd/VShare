import { App, ref, unref } from "vue";
import {
  User,
  EmailAuthProvider,
  GoogleAuthProvider,
  getAuth,
  linkWithPopup,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  linkWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Методы авторизации
/**
 * Авторизации через почту и пароль
 * @param email Почта пользователя
 * @param password Пароль пользователя
 */
function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email, password);
  // В случае успеха надо вызвать метод переноса данных
}
/**
 * Регистрация через почту и пароль
 * @param email Почта пользователя
 * @param password Пароль пользователя
 */
function signUp(email: string, password: string) {
  if (!user.value) throw new Error("You must be logged in");

  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(user.value, credential);
}
/**
 * Письмо для восстановления почты
 * @param email Почта пользователя
 */
function resetPassword(email: string) {
  return sendPasswordResetEmail(getAuth(), email);
}
/**
 * Авторизация/Регистрация через гугл
 */
function signInWithGoogle() {
  if (!user.value) throw new Error("You must be logged in");

  const provider = new GoogleAuthProvider();
  return linkWithPopup(user.value, provider).catch(() =>
    signInWithPopup(getAuth(), provider)
  );
}

// Текущий пользователь
export const user = ref<null | User>(null);

/**
 * Инициализация плагина
 */
function init() {
  return onAuthStateChanged(
    getAuth(),
    (data) => {
      user.value = data;
      if (!data) return signInAnonymously(getAuth());

      console.debug("Изменение состояния авторизации.\n", data);
    },
    (err) => console.error("Ошибка при изменении состояния авторизации.", err)
  );
}

export default {
  install(app: App) {
    app.config.globalProperties.$auth = {
      signIn,
      signUp,
      resetPassword,
      signInWithGoogle,
    };

    Object.defineProperty(app.config.globalProperties.$auth, "uid", {
      enumerable: true,
      get: () => unref(user)?.uid,
    });

    Object.defineProperty(app.config.globalProperties.$auth, "user", {
      enumerable: true,
      get: () => unref(user),
    });

    Object.defineProperty(app.config.globalProperties.$auth, "isAnonymous", {
      enumerable: true,
      get: () => unref(user)?.isAnonymous,
    });

    init();
  },
};

export interface Auth {
  uid: undefined | string;
  user: null | User;
  isAnonymous: undefined | boolean;

  signIn: typeof signIn;
  signUp: typeof signUp;
  resetPassword: typeof resetPassword;
  signInWithGoogle: typeof signInWithGoogle;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $auth: Auth;
  }
}
