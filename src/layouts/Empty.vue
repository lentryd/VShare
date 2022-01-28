<template>
  <div id="empty">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  watch: {
    "$pwa.isInstalled"() {
      this.goToApplication();
    },
  },

  methods: {
    goToApplication() {
      if (this.$pwa.isInstalled) this.$router.replace("/app/");
    },
  },

  mounted() {
    this.goToApplication();
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