<template>
  <router-link
    :to="to"
    custom
    :replace="replace"
    v-slot="{ navigate, isActive, isExactActive }"
  >
    <div
      @click="navigate"
      class="navigation-bar-item"
      :class="{ active: isActive || isExactActive }"
    >
      <div class="icon-container">
        <span :class="iconClass" v-text="icon" />
        <div class="indicator" />
      </div>

      <span class="label-medium" v-text="label" />
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navigation Bar Item",

  props: {
    to: { required: true },
    icon: { type: String, required: true },
    iconRound: { type: Boolean, default: false },
    iconOutlined: { type: Boolean, default: false },
    label: { type: String, required: true },
    replace: { type: Boolean, default: false },
  },

  computed: {
    iconClass() {
      return this.iconRound
        ? "material-icons-round"
        : this.iconOutlined
        ? "material-icons-outlined"
        : "material-icons";
    },
  },
});
</script>

<style lang="scss">
.navigation-bar-item {
  gap: 4px;
  width: 100%;
  cursor: pointer;
  height: 80px - 28px;
  display: flex;
  transition: color 250ms ease-in-out, background 250ms ease-in-out;
  padding-top: 12px;
  align-items: center;
  padding-bottom: 16px;
  flex-direction: column;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &.active {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
    }
  }

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-variant-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-variant-dark;
  }
}

.navigation-bar-item:not(.active):hover,
.navigation-bar-item:not(.active):focus,
.navigation-bar-item:not(.active):active {
  @media (prefers-color-scheme: light) {
    background: $md-sys-color-surface-variant-light;
  }
  @media (prefers-color-scheme: dark) {
    background: $md-sys-color-surface-variant-dark;
  }
}

.navigation-bar-item > .icon-container {
  width: 64px;
  height: 32px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
.navigation-bar-item > .icon-container > span {
  z-index: 1;
}
.navigation-bar-item > .icon-container > .indicator {
  width: 100%;
  height: 100%;
  opacity: 1;
  position: absolute;
  transition: width 250ms ease-in-out, opacity 250ms ease-in-out;
  border-radius: 16px;

  @media (prefers-color-scheme: light) {
    background: $md-sys-color-secondary-container-light;
  }
  @media (prefers-color-scheme: dark) {
    background: $md-sys-color-secondary-container-dark;
  }
}
.navigation-bar-item:not(.active) > .icon-container > .indicator {
  width: 0;
  opacity: 0;
}
</style>