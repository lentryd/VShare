<template>
  <div class="banner">
    <span class="material-icons-round" v-html="icon" />
    <span class="body-small" v-text="text" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Banner",

  props: {
    icon: { type: String, default: "&#xe001;" },
    text: { type: String, required: true },
  },
});
</script>

<style lang="scss" scoped>
.banner {
  gap: 12px;
  width: calc(100% - 32px);
  display: flex;
  padding: 14px 16px;
  align-items: center;
  border-radius: 16px;
  flex-direction: row;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-secondary-container-light;
    background: $md-sys-color-secondary-container-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-secondary-container-dark;
    background: $md-sys-color-secondary-container-dark;
  }
}
</style>
