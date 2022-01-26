<template>
  <div>
    <h1>Как добавить устройство?</h1>
    <ul>
      <li>Нажмите на другом устройте "Войти в комнату"</li>
      <li>Наведите камеру на QR код</li>
      <li>Выберите комнату</li>
    </ul>
  </div>

  <div class="btn-container">
    <Btn
      color="var(--color)"
      @click="$emit('goBack')"
      background="var(--cancel-btn)"
    >
      Отмена
    </Btn>
    <Btn
      v-show="!scanAllow"
      color="var(--color)"
      @click="scanAllow = true"
      background="var(--scan-btn)"
      >Сканировать</Btn
    >
  </div>

  <QrcodeStream v-if="scanAllow" :camera="camera" @decode="onDecode">
    <div v-show="camera == 'off'" class="validation">
      <span v-if="isValid == null">Идет проверка...</span>
      <span v-else>Ошибка, попробуйте еще раз</span>
    </div>
  </QrcodeStream>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { QrcodeStream } from "vue3-qrcode-reader";
import Btn from "@/components/UI/btn.vue";

export default defineComponent({
  components: { Btn, QrcodeStream },

  emits: ["goBack", "setUserId"],

  data: () => ({
    camera: "auto",
    isValid: null as null | boolean,
    scanAllow: false,
  }),

  methods: {
    onDecode(url: string) {
      this.camera = "off";
      this.isValid = null;

      let urlData: null | URL = null;
      try {
        urlData = new URL(url);
      } catch (e) {
        console.error(e);
        this.notValid();
      }

      if (urlData?.origin != location.origin) return this.notValid();
      if (!urlData?.pathname.startsWith("/app/addUser")) return this.notValid();

      const userId = urlData.pathname.match(/\/addUser\/(.+)/)?.[1];
      if (!userId) return this.notValid();

      this.$firebase.auth
        .getUser(userId)
        .then((data) => {
          if (!data) throw new Error();

          this.isValid = true;
          this.scanAllow = false;
          this.$emit("setUserId", userId);
        })
        .catch(() => this.notValid());
    },

    notValid() {
      this.isValid = false;
      setTimeout(() => (this.camera = "auto"), 2000);
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .container {
    --scan-btn: #3ba55d;
    --cancel-btn: #1771e6;
  }
}

@media (prefers-color-scheme: dark) {
  .container {
    --scan-btn: #2fa955;
    --cancel-btn: #3f9bff;
  }
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

ul {
  margin: 0;
  font-size: 1rem;
  margin-bottom: 1rem;
  list-style-type: decimal;
}

.btn-container {
  gap: 1.5rem;
  display: flex;
  margin-bottom: 1rem;
  flex-direction: row;
}

.qrcode-stream-wrapper {
  width: 15rem;
  height: 15rem;
  overflow: hidden;
  border-radius: 6px;
}

.validation {
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px) brightness(0.5);
}
</style>