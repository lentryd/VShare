// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   enableMultiTabIndexedDbPersistence,
// } from "firebase/firestore";

// initializeApp({
//   apiKey: "AIzaSyCpEY-3ye4t54kD1Q-8sJnyIwD5_1SWhkA",
//   authDomain: "vshare.lentryd.su",
//   databaseURL:
//     "https://vshare-69949-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "vshare-69949",
//   storageBucket: "vshare-69949.appspot.com",
//   messagingSenderId: "15549854749",
//   appId: "1:15549854749:web:b669205f9e935f269502f4",
// });
// enableMultiTabIndexedDbPersistence(getFirestore());

import { createApp } from "vue";
import App from "@/App.vue";

// Плагины
import auth from "@/plugins/auth";
import users from "@/plugins/users";
import chats from "@/plugins/chats";
import sizes from "@/plugins/device";
import router from "@/plugins/router";
import components from "@/plugins/components";

// Директивы
import focus from "@/directives/focus";

// Стили
import "@/assets/icons.scss";
import "@/assets/theme.scss";
import "@/assets/mime-icons/index.scss";

// Инициализация приложения
import "@/registerServiceWorker";
createApp(App)
  // .use(auth)
  // .use(users)
  // .use(chats)
  .use(sizes)
  .use(router)
  .use(components)
  .directive("focus", focus)
  .mount("#app");
