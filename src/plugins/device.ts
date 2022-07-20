import { App, ref, unref } from "vue";

const width = ref(0);
const height = ref(0);

function init() {
  setSizes();
  window.addEventListener("resize", setSizes);
}

function setSizes() {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

export default {
  install(app: App) {
    init();

    app.config.globalProperties.$device = {};

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
  },
};

export interface Device {
  width: number;
  height: number;
  isMobile: boolean;
  isDesktop: boolean;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $device: Device;
  }
}
