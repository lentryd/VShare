import { App, ref, unref } from "vue";

const width = ref(0);
const height = ref(0);
const toastText = ref("");

function init() {
  setSizes();
  window.addEventListener("resize", setSizes);
}

function setSizes() {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

function toast(text?: string) {
  if (!text) toastText.value = "";
  else toastText.value = text;
}

export default {
  install(app: App) {
    init();

    app.config.globalProperties.$device = { toast };

    Object.defineProperty(app.config.globalProperties.$device, "width", {
      enumerable: true,
      get: () => unref(width),
    });
    Object.defineProperty(app.config.globalProperties.$device, "height", {
      enumerable: true,
      get: () => unref(height),
    });
    Object.defineProperty(app.config.globalProperties.$device, "isMobile", {
      enumerable: true,
      get: () => unref(width) < 768,
    });
    Object.defineProperty(app.config.globalProperties.$device, "isDesktop", {
      enumerable: true,
      get: () => unref(width) >= 768,
    });
    Object.defineProperty(app.config.globalProperties.$device, "toastText", {
      enumerable: true,
      get: () => unref(toastText),
    });
  },
};

export interface Device {
  toast: typeof toast;

  width: number;
  height: number;
  isMobile: boolean;
  isDesktop: boolean;
  toastText: string;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $device: Device;
  }
}
