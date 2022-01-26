<template>
  <div class="button-container" :class="position">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    position: { type: String, default: "top" },
  },
});
</script>

<style scoped>
.button-container {
  gap: 0.25rem;
  display: flex;
  position: sticky;
  background: var(--background);
  flex-direction: column;
}
.button-container.top {
  top: 0;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
}
.button-container.bottom {
  bottom: 0;
  margin-top: auto;
  padding-top: 0.25rem;
  padding-bottom: 0.5rem;
}
</style>