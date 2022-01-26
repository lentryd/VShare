import { App } from "vue";
import { DeviceUUID, Options } from "device-uuid";

const device = new DeviceUUID();
const du = device.parse();

function getUUID() {
  const dua = [];
  for (let key in device.options)
    if (device.options[key as keyof Options] === true)
      dua.push(du[key as keyof Options]);
  if (!device.options.resolution && du.isMobile) dua.push(du.resolution.sort());

  const tmpUuid = du.hashMD5(dua.join(":"));
  return [
    tmpUuid.slice(0, 8),
    tmpUuid.slice(8, 12),
    "4" + tmpUuid.slice(12, 15),
    "9" + tmpUuid.slice(15, 18),
    tmpUuid.slice(20),
  ].join("-");
}

export const platform = du.platform;

export default {
  install(app: App) {
    app.config.globalProperties.$device = {
      id: getUUID(),
      platform: du.platform,
    };
  },
};

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    readonly $device: {
      id: string;
      platform: string;
    };
  }
}
