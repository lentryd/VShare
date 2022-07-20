import { App } from "vue";

import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import Popup from "@/components/ui/popup.vue";
import Dialog from "@/components/ui/dialog.vue";

export default {
  install(app: App) {
    app
      .component("Btn", Btn)
      .component("Field", Field)
      .component("Popup", Popup)
      .component("Dialog", Dialog);
  },
};

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    Btn: typeof Btn;
    Field: typeof Field;
    Popup: typeof Popup;
    Dialog: typeof Dialog;
  }
}
