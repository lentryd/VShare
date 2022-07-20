<template>
  <transition>
    <div v-show="!hidden" class="navigation-bar" :class="{ keyboardOpen }">
      <Item to="/" icon="&#xe88a;" replace icon-round label="Главная" />

      <Item to="/history" replace icon-round icon="&#xe889;" label="История" />

      <Item to="/profile" replace icon-round icon="&#xe7fd;" label="Профиль" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "./Item.vue";

const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export default defineComponent({
  name: "Navigation Bar",

  components: { Item },

  props: {
    show: { type: Boolean, default: true },
  },

  data: () => ({
    lastAngle: 0,
    lastHeight: 0,
    keyboardOpen: false,
  }),

  computed: {
    hidden() {
      return !this.show || this.keyboardOpen;
    },
  },

  methods: {
    initDetector() {
      this.lastAngle = window.screen.orientation.angle;
      this.lastHeight = window.visualViewport.height;
      this.keyboardOpen = false;
    },
    detectKeyboard(e: Event) {
      const { angle } = window.screen.orientation;
      const { height } = e.target as VisualViewport;

      if (!MOBILE_REGEX.test(navigator.userAgent)) this.keyboardOpen = false;
      else if (angle != this.lastAngle) {
        this.lastAngle = angle;
        this.lastHeight = height;
      } else this.keyboardOpen = height < this.lastHeight;
    },
  },

  mounted() {
    if ("visualViewport" in window) {
      this.initDetector();
      window.visualViewport.addEventListener("resize", this.detectKeyboard);
    }
  },

  unmounted() {
    if ("visualViewport" in window)
      window.visualViewport.removeEventListener("resize", this.detectKeyboard);
  },
});
</script>

<style lang="scss" scoped>
.navigation-bar {
  width: 100vw;
  height: 80px;
  display: flex;
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;
  align-items: center;
  flex-direction: row;

  @media (prefers-color-scheme: light) {
    background: $md-sys-color-surface-light;
  }
  @media (prefers-color-scheme: dark) {
    background: $md-sys-color-surface-dark;
  }
  @media screen and (min-width: 768px) {
    display: none;
  }
}

.keyboardOpen.v-leave-active {
  display: none;
}
.v-enter-active,
.v-leave-active:not(.keyboardOpen) {
  transition: opacity 250ms ease-in-out, height 250ms ease-in-out;
}
.v-leave-to,
.v-enter-from {
  height: 0;
  opacity: 0;
}
</style>
