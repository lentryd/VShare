import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import idb from "@/plugins/idb";
import pwa from "@/plugins/pwa";
import device from "@/plugins/device";
import firebase from "@/plugins/firebase/index";

import "@/registerServiceWorker";

createApp(App)
  .use(idb)
  .use(pwa)
  .use(router)
  .use(device)
  .use(firebase)
  .mount("#app");
