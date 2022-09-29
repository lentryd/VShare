import { App, ref, unref } from "vue";

const width = ref(0);
const height = ref(0);
const toastText = ref("");
const toastZIndex = ref<undefined | number>(0);

function init() {
  setSizes();
  window.addEventListener("resize", setSizes);

  themeChange(window.matchMedia("(prefers-color-scheme: light)").matches);
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => themeChange(e.matches));
}

function setSizes() {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

function toast(text?: string, zIndex?: number) {
  if (!text) toastText.value = "";
  else toastText.value = text;

  toastZIndex.value = zIndex;
}

function themeChange(isLight: boolean) {
  document
    .querySelector("meta[name=theme-color]")
    ?.setAttribute("content", isLight ? "#fffbfe" : "#1c1b1f");
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
      get: () => unref(width) < 640,
    });
    Object.defineProperty(app.config.globalProperties.$device, "isDesktop", {
      enumerable: true,
      get: () => unref(width) >= 640,
    });
    Object.defineProperty(app.config.globalProperties.$device, "toastText", {
      enumerable: true,
      get: () => unref(toastText),
    });
    Object.defineProperty(app.config.globalProperties.$device, "toastZIndex", {
      enumerable: true,
      get: () => unref(toastZIndex),
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
  toastZIndex?: number;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $device: Device;
  }
}
