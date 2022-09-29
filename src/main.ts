import { createApp } from "vue";
import App from "@/App.vue";

// Плагины
import fb from "@/plugins/firebase";
import idb from "@/plugins/idb";
import router from "@/plugins/router";
import device from "@/plugins/device";
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
  .use(fb)
  .use(idb)
  .use(router)
  .use(device)
  .use(components)
  .directive("focus", focus)
  .mount("#app");
