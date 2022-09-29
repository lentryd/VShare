import { App } from "vue";

import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import Popup from "@/components/ui/popup.vue";
import Dialog from "@/components/ui/dialog.vue";
import Banner from "@/components/ui/banner.vue";
import TopAppBar, { Item as TopAppBarItem } from "@/components/ui/top-app-bar";

export default {
  install(app: App) {
    app
      .component("Btn", Btn)
      .component("Field", Field)
      .component("Popup", Popup)
      .component("Dialog", Dialog)
      .component("Banner", Banner)
      .component("TopAppBar", TopAppBar)
      .component("TopAppBarItem", TopAppBarItem);
  },
};

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    Btn: typeof Btn;
    Field: typeof Field;
    Popup: typeof Popup;
    Dialog: typeof Dialog;
    Banner: typeof Banner;
    TopAppBar: typeof TopAppBar;
    TopAppBarItem: typeof TopAppBarItem;
  }
}
