<template>
  <component
    :is="component"
    title="Сканировать"
    description="Для получения доступа наведите камеру на qr код."
    v-model="show"
  >
    <template v-slot:icon>
      <span class="material-icons-round">&#xf206;</span>
    </template>

    <template v-slot:body>
      <div v-show="!showCam" class="camera skeleton">
        <span
          class="material-icons-round"
          v-text="camPermission && !error ? '&#xe412;' : '&#xf1a8;'"
        />
        <span v-show="!camPermission">Необходимо разрешение</span>
        <span v-show="error" v-text="error" />
      </div>

      <div v-show="showCam" class="camera">
        <QrcodeStream @decode="onDecode" @init="onInit" />
      </div>
    </template>

    <template v-slot:actions>
      <Btn v-if="$device.isDesktop" @click="show = false" label="Отмена" />

      <Btn v-if="!camPermission" label="Разрешить" filled @click="openManual" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { QrcodeStream } from "vue3-qrcode-reader";

export default defineComponent({
  name: "ScannerContent",

  components: { QrcodeStream },

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    error: "",
    loading: true,
    camPermission: true,
  }),

  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit("update:modelValue", value);
      },
    },

    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },

    showCam() {
      return !this.loading && this.camPermission && !this.error;
    },
  },

  watch: {
    show() {
      this.error = "";
      this.loading = true;
      this.camPermission = true;
    },
  },

  methods: {
    onDecode(result: string) {
      if (!result.startsWith("http") || location.host != new URL(result).host)
        return;

      const { pathname } = new URL(result);
      this.$router.push(pathname);
    },

    async onInit(promise: any) {
      try {
        await promise;
        this.loading = false;
      } catch (error: any) {
        if (error.name === "NotAllowedError") this.camPermission = false;
        else this.error = "Ошибка камеры: " + error.name;
      }
    },

    openManual() {
      window.open(
        "https://lumpics.ru/how-to-enable-access-permission-for-webcam-in-browser/",
        "_blank"
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.camera {
  gap: 12px;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: flex;
  overflow: hidden;
  align-items: center;
  border-radius: 28px;
  flex-direction: column;
  justify-content: center;

  .material-icons-round {
    font-size: 76px;
  }

  &.skeleton {
    opacity: 0.7;
    animation: skeleton-loading 1s linear infinite alternate;

    span {
      text-align: center;
    }
  }

  @media (prefers-color-scheme: light) {
    @keyframes skeleton-loading {
      from {
        background-color: lighten($md-sys-color-on-surface-variant-light, 45%);
      }
      to {
        background-color: lighten($md-sys-color-on-surface-variant-light, 60%);
      }
    }
  }
  @media (prefers-color-scheme: dark) {
    @keyframes skeleton-loading {
      from {
        background-color: darken($md-sys-color-on-surface-variant-dark, 45%);
      }
      to {
        background-color: darken($md-sys-color-on-surface-variant-dark, 60%);
      }
    }
  }
}
</style>
