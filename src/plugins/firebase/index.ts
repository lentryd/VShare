import { App } from "vue";
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyCpEY-3ye4t54kD1Q-8sJnyIwD5_1SWhkA",
  authDomain: "vshare.lentryd.su",
  databaseURL:
    "https://vshare-69949-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vshare-69949",
  storageBucket: "vshare-69949.appspot.com",
  messagingSenderId: "15549854749",
  appId: "1:15549854749:web:b669205f9e935f269502f4",
  measurementId: "G-7Q5BKJL2JW",
});
getAnalytics(getApp());
enableMultiTabIndexedDbPersistence(getFirestore());

// Модули
import auth, { Auth } from "./auth";
import users, { Users } from "./users";
import files, { Files } from "./files";
import bubbles, { Bubbles } from "./bubbles";

export default {
  install(app: App) {
    app.config.globalProperties.$fb = {};

    auth.install(app);
    users.install(app);
    files.install(app);
    bubbles.install(app);
  },
};

export interface Fb {
  auth: Auth;
  users: Users;
  files: Files;
  bubbles: Bubbles;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $fb: Fb;
  }
}
