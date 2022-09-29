<template>
  <div class="content-wrapper">
    <NavRail v-if="$device.isDesktop" />

    <router-view v-slot="{ Component, route }">
      <Transition mode="out-in" name="show-route">
        <div v-if="!loading" class="content" :key="route.name">
          <Component :is="Component" />
        </div>
      </Transition>
    </router-view>
  </div>

  <Toast />

  <NavBar v-if="$device.isMobile" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import Toast from "@/components/ui/toast.vue";

export default defineComponent({
  name: "App Component",

  components: {
    Toast,
    NavBar: defineAsyncComponent(
      () => import("@/components/ui/navigation-bar")
    ),
    NavRail: defineAsyncComponent(
      () => import("@/components/ui/navigation-rail")
    ),
  },

  computed: {
    loading() {
      return !this.$fb.users.state;
    },
  },

  watch: {
    loading() {
      this.updateState();
    },
  },

  methods: {
    updateState() {
      const el = document.getElementById("loading-page");
      if (el) el.dataset.hide = (!this.loading).toString();
    },
  },

  mounted() {
    this.updateState();
  },
});
</script>

<style lang="scss">
// Стилизация полосы прокрутки
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  margin: 0.25rem;
  border-radius: 0.2rem;

  @media (prefers-color-scheme: light) {
    background-color: rgba($md-sys-color-on-surface-light, 8%);
  }
  @media (prefers-color-scheme: dark) {
    background-color: rgba($md-sys-color-on-surface-dark, 8%);
  }
}
::-webkit-scrollbar-thumb {
  border-radius: 0.2rem;

  @media (prefers-color-scheme: light) {
    background-color: rgba($md-sys-color-on-surface-light, 12%);
  }
  @media (prefers-color-scheme: dark) {
    background-color: rgba($md-sys-color-on-surface-dark, 12%);
  }
}

// Основные стили
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  text-size-adjust: 100%;

  @include body1;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-background-light;
    background: $md-sys-color-background-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-background-dark;
    background: $md-sys-color-background-dark;
  }
}
a {
  @media (prefers-color-scheme: light) {
    color: $md-sys-color-primary-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-primary-dark;
  }
}

// Отключение синей подсветки при нажатии
*:focus,
*:active {
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

// Стили окна приложения
#app {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  > .content-wrapper {
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: row;

    > .content {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      flex-direction: column;
    }
  }
}

// Анимация появления страниц
.show-route-enter-active,
.show-route-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.show-route-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
.show-route-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
</style>
