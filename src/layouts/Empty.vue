<template>
  <div id="empty">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  watch: {
    "$pwa.isInstalled"(value) {
      if (value) this.$router.replace("/app/");
    },
  },
});
</script>

<style scoped>
#empty {
  --color: #000000;
  --background: #baa5ff;
}

#empty {
  width: 100vw;
  color: var(--color);
  display: flex;
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--background);
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>