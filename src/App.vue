<template>
  <div class="content-wrapper">
    <NavRail v-if="$device.isDesktop" />

    <router-view v-slot="{ Component, route }">
      <transition mode="out-in">
        <div class="content" :key="route.name">
          <Component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>

  <NavBar v-if="$device.isMobile" />

  <Popup v-model="show" title="Example" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  components: {
    NavBar: defineAsyncComponent(
      () => import("@/components/ui/navigation-bar")
    ),
    NavRail: defineAsyncComponent(
      () => import("@/components/ui/navigation-rail")
    ),
  },

  data: () => ({
    show: true,
  }),
});
</script>

<style lang="scss">
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

html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  text-size-adjust: 100%;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-background-light;
    background: $md-sys-color-background-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-background-dark;
    background: $md-sys-color-background-dark;
  }
}

*:focus,
*:active {
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;

  @media print {
    display: none;
  }
}
#app > .content-wrapper {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: row;
}
#app > .content-wrapper > .content {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
}

.show-route-enter-active,
.show-route-leave-active,
.show-route-inverse-enter-active,
.show-route-inverse-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.show-route-leave-to,
.show-route-inverse-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}
.show-route-enter-from,
.show-route-inverse-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
