<template>
  <Transition mode="out-in" name="toast-transition">
    <div v-show="text" :key="text" class="toast-container" v-text="text" />
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Toast",

  data: () => ({
    timeout: 0 as unknown as NodeJS.Timeout,
  }),

  computed: {
    text() {
      return this.$device.toastText;
    },
  },

  watch: {
    text(value) {
      clearTimeout(this.timeout);
      if (!value) return;

      this.timeout = setTimeout(this.$device.toast, 3500);
    },
  },
});
</script>

<style lang="scss">
.toast-container {
  left: 16px;
  width: calc(100% - 4 * 16px);
  bottom: 80px + 16px;
  padding: 8px 16px;
  position: absolute;
  border-radius: 8px;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-inverse-on-surface-light;
    background: $md-sys-color-inverse-surface-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-inverse-on-surface-dark;
    background: $md-sys-color-inverse-surface-dark;
  }

  @media screen and (min-width: 768px) {
    left: 80px + 16px;
    width: 350px;
    bottom: 16px;
  }
}

.toast-transition-enter-active,
.toast-transition-leave-active {
  transition: opacity 0.25s ease-in-out, bottom 0.25s ease-in-out;
}
.toast-transition-leave-to,
.toast-transition-enter-from {
  bottom: 0;
  opacity: 0;
}
</style>
