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
function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email, password);
  // В случае успеха надо вызвать метод переноса данных
}
function signUp(email: string, password: string) {
  if (!user.value) throw new Error("You must be logged in");

  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(user.value, credential);
}
function resetPassword(email: string) {
  return sendPasswordResetEmail(getAuth(), email);
}
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
    app.config.globalProperties.$fb.auth = {
      signIn,
      signUp,
      resetPassword,
      signInWithGoogle,
    };

    Object.defineProperty(app.config.globalProperties.$fb.auth, "uid", {
      enumerable: true,
      get: () => unref(user)?.uid,
    });

    Object.defineProperty(app.config.globalProperties.$fb.auth, "user", {
      enumerable: true,
      get: () => unref(user),
    });

    Object.defineProperty(app.config.globalProperties.$fb.auth, "providers", {
      enumerable: true,
      get: () => unref(user)?.providerData.map((p) => p.providerId) ?? [],
    });

    Object.defineProperty(app.config.globalProperties.$fb.auth, "isAnonymous", {
      enumerable: true,
      get: () => unref(user)?.isAnonymous,
    });

    init();
  },
};

export interface Auth {
  /**
   * Идентификатор текущего пользователя
   * _Может меняться в процессе работы_
   */
  uid: undefined | string;
  /**
   * Сырые данные пользователя
   */
  user: null | User;
  /**
   * Массив провайдеров
   */
  providers: string[];
  /**
   * Авторизован ли пользователь
   */
  isAnonymous: undefined | boolean;

  /**
   * Авторизации через почту и пароль
   * @param email Почта пользователя
   * @param password Пароль пользователя
   */
  signIn: typeof signIn;
  /**
   * Регистрация через почту и пароль
   * @param email Почта пользователя
   * @param password Пароль пользователя
   */
  signUp: typeof signUp;
  /**
   * Письмо для восстановления почты
   * @param email Почта пользователя
   */
  resetPassword: typeof resetPassword;
  /** Авторизация/подключение гугл аккаунта */
  signInWithGoogle: typeof signInWithGoogle;
}
