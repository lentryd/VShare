import { ref } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface FUserState {
  uid?: string;
  isLoading: boolean;
  isAnonymous: boolean;
}
export const userState = ref<FUserState>({
  isLoading: true,
  isAnonymous: true,
});
export function init() {
  userState.value.isLoading = true;

  onAuthStateChanged(getAuth(), (user) => {
    if (userState.value.isLoading) userState.value.isLoading = false;

    userState.value.uid = user?.uid;
    userState.value.isAnonymous = user?.isAnonymous ?? true;

    console.group("Auth state was changed");

    listeners.forEach((listener, index) => {
      try {
        console.log("Start custom listener (id: %d)", index);
        listener(userState.value);
        console.log("Custom listener completed successfully (id: %d)", index);
      } catch (e) {
        console.log("Error was detected in custom listener. (id: %d)", index);
        console.error(e);
      }
    });

    console.groupEnd();
  });
}

export type FUserStateListener = (state: FUserState) => void;
const listeners: FUserStateListener[] = [];
/**
 * Пользовательские слушатели авторизации
 * @param listener Слушатель изменений авторизации
 * @returns Функция для удаления слушателя
 */
export function onStateChanged(listener: FUserStateListener) {
  const index = listeners.push(listener) - 1;

  return () => {
    listeners.splice(index, 1);
  };
}

// Способы авторизации
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as siAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const GProvider = new GoogleAuthProvider();

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email, password);
}
export function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(getAuth(), email, password);
}
export function resetPassword(email: string) {
  return sendPasswordResetEmail(getAuth(), email);
}

export function signInWithGoogle() {
  return signInWithPopup(getAuth(), GProvider);
}
export function signInAnonymously() {
  return siAnonymously(getAuth());
}
