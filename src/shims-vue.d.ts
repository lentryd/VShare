declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue3-qrcode-reader" {
  import type { DefineComponent } from "vue";
  const QrcodeStream: DefineComponent<{}, {}, any>;
  export { QrcodeStream };
}
