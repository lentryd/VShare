<template>
  <div @click="onclick" class="top-app-bar-item">
    <span :class="iconClass" v-text="icon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Top App Bar Item",

  props: {
    to: {},
    replace: { type: Boolean, default: false },

    icon: { type: String, required: true },
    iconRound: { type: Boolean, default: false },
    iconOutlined: { type: Boolean, default: false },
  },

  emits: ["click"],

  computed: {
    iconClass() {
      return this.iconRound
        ? "material-icons-round"
        : this.iconOutlined
        ? "material-icons-outlined"
        : "material-icons";
    },
  },

  methods: {
    onclick(e: Event) {
      if (this.to) {
        if (this.replace) this.$router.replace(this.to as any);
        else this.$router.push(this.to as any);
      } else this.$emit("click", e);
    },
  },
});
</script>

<style lang="scss">
.top-app-bar-item {
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-variant-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-variant-dark;
  }
}
</style>