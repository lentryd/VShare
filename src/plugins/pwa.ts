import { App, ref, unref } from "vue";

let deferredPrompt: any = null;
const installed = ref(true);

export interface PWA {
  install: typeof install;
  isInstalled: boolean;
}

function install() {
  if (installed.value) return;

  deferredPrompt?.prompt?.();
  installed.value = true;
}

export default {
  install(app: App) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();

      installed.value = false;
      deferredPrompt = e;
    });

    app.config.globalProperties.$pwa = { install };
    Object.defineProperty(app.config.globalProperties.$pwa, "isInstalled", {
      enumerable: true,
      get: () => unref(installed),
    });
  },
};

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $pwa: PWA;
  }
}
