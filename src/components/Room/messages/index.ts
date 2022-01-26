import { Firebase } from "@/plugins/firebase/index";

export interface MsgGroup {
  from: string;
  messages: Firebase["room"]["messages"];
}
export interface MsgDay {
  date: Date;
  groups: MsgGroup[];
}
export { default } from "./body.vue";
