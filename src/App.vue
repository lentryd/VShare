<template>
  <router-view v-if="!isLoading" v-slot="{ Component, route }">
    <transition name="push">
      <component :is="Component" :key="route.matched[0]?.name" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Empty from "@/layouts/Empty.vue";

export default defineComponent({
  components: { Empty },

  computed: {
    isLoading() {
      return (
        this.$firebase.auth.state.isLoading ||
        this.$firebase.auth.user.isLoading ||
        this.$firebase.rooms.isLoading
      );
    },
  },

  watch: {
    isLoading(value) {
      this.changeLoader(value);
    },
  },

  methods: {
    changeTheme() {
      const color = getComputedStyle(document.body)
        ?.getPropertyValue("--theme-color")
        ?.trim();

      document
        .querySelector("meta[name=theme-color]")
        ?.setAttribute("content", color);
    },
    changeLoader(value: boolean) {
      document
        .querySelector("#app-loading")
        ?.setAttribute("data-value", value.toString());
    },
  },

  beforeMount() {
    this.changeTheme();

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", this.changeTheme);

    if (this.$pwa.isInstalled && !this.$route.path.startsWith("/app/"))
      this.$router.replace("/app/");
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap");

@media (prefers-color-scheme: light) {
  :root {
    --theme-color: #e2e4e7;

    --color: #000000;
    --background: #e2e4e7;

    --scroll-thumb: #cccccc;
    --scroll-background: #f2f2f2;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme-color: #0a0a0f;

    --color: #ffffff;
    --background: #0a0a0f;

    --scroll-thumb: #202225;
    --scroll-background: #2e3338;
  }
}

.push-enter-active,
.push-leave-active {
  position: absolute;
  transition: all 0.5s ease-in-out !important;
}
.push-enter-from {
  transform: translateX(105%);
}
.push-leave-to {
  transform: translateX(-105%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-in-out 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dissolution-enter-active,
.dissolution-leave-active {
  transition: all 0.25s ease-in-out;
}
.dissolution-enter-from,
.dissolution-leave-to {
  opacity: 0;
  transform: scale(90%);
  backdrop-filter: blur(0);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  margin: 0.25rem;
  border-radius: 0.2rem;
  background-color: var(--scroll-background);
}
::-webkit-scrollbar-thumb {
  border-radius: 0.2rem;
  background-color: var(--scroll-thumb);
}

html {
  height: 100%;
  overflow: hidden;
  font-size: 20px;
  font-family: Roboto, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;

  color: var(--color);
  background: var(--background);
}

@media screen and (min-width: 64em) {
  html {
    font-size: 22px;
  }
}
@media screen and (min-width: 42em) and (max-width: 64em) {
  html {
    font-size: 20px;
  }
}
@media screen and (max-width: 42em) {
  html {
    font-size: 18px;
  }
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  margin: 0;
  height: 100%;
}
</style>
