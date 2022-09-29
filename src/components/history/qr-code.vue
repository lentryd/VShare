<template>
  <component
    :is="component"
    title="Поделиться"
    v-model="show"
    permanent
    description="Покажите этот экран другому пользователю."
  >
    <template v-slot:body>
      <div class="qr-container">
        <div class="qr-code">
          <QrcodeVue :value="link" level="Q" render-as="svg" />
        </div>

        <div class="info">
          <span>Отсканируйте QR-код или введите код, указанный ниже.</span>
          <span @click="cope" class="code" v-text="id" />
        </div>
      </div>
    </template>

    <template v-slot:actions>
      <Btn label="Отмена" @click="show = false" v-if="$device.isDesktop" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QrcodeVue from "qrcode.vue";

const ROUTES = ["/b/", "/h/", "/f/", "/history/"];
function checkBack() {
  const path: string = window?.history.state?.back ?? "";
  return ROUTES.some((r) => path.startsWith(r));
}

export default defineComponent({
  name: "Share Bubble",

  props: {
    id: { type: String, default: "" },
  },

  components: { QrcodeVue },

  computed: {
    show: {
      get() {
        return "share" in this.$route.query;
      },
      set(v: boolean) {
        if (v) this.$router.push({ query: { share: null } });
        else if (checkBack()) this.$router.back();
        else this.$router.replace({ name: "History", params: { id: this.id } });
      },
    },
    link() {
      return `${window.location.origin}/b/${this.id}`;
    },

    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },
  },

  methods: {
    cope(e: Event) {
      const el = e.target as HTMLElement;
      el.classList.add("copied");
      navigator.clipboard.writeText(this.link);
      this.$device.toast("Скопировано!", 99999);
    },
  },
});
</script>

<style lang="scss" scoped>
.qr-container {
  gap: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-direction: row;

  .info {
    gap: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
      text-align: center;
    }

    .code {
      cursor: pointer;
      padding: 8px 16px;
      font-size: 28px;
      user-select: none;
      font-family: monospace;
      border-radius: 8px;
      transition: color 0.4s ease-in-out, background 0.4s ease-in-out;

      &.copied,
      &:active {
        @media (prefers-color-scheme: light) {
          color: $md-sys-color-on-primary-container-light;
          background: $md-sys-color-primary-container-light;
        }
        @media (prefers-color-scheme: dark) {
          color: $md-sys-color-on-primary-container-dark;
          background: $md-sys-color-primary-container-dark;
        }
      }

      @media (prefers-color-scheme: light) {
        color: $md-sys-color-on-surface-light;
        background: lighten($md-sys-color-surface-light, 5%);
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
          0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      }
      @media (prefers-color-scheme: dark) {
        color: $md-sys-color-on-surface-dark;
        background: lighten($md-sys-color-surface-dark, 5%);
        box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
          0px 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }

  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
}

.qr-code {
  width: fit-content;
  padding: 4px;
  display: flex;
  position: relative;
  background: lighten($md-sys-color-surface-light, 5%);
  border-radius: 8px;

  @media (prefers-color-scheme: light) {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
      0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  }
  @media (prefers-color-scheme: dark) {
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
      0px 1px 2px rgba(0, 0, 0, 0.3);
  }

  svg {
    width: 200px;
    height: 200px;
    border-radius: 6px;

    :first-child {
      fill: lighten($md-sys-color-surface-light, 5%);
    }

    :last-child {
      fill: $md-sys-color-on-surface-light;
    }
  }
}
</style>
