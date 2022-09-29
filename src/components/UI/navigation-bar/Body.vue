<template>
  <transition>
    <div v-show="show" class="navigation-bar">
      <Item
        :to="{ name: 'App' }"
        icon="&#xe88a;"
        replace
        icon-round
        label="Главная"
      />

      <Item
        :to="{ name: 'History' }"
        replace
        icon-round
        icon="&#xe889;"
        label="История"
      />

      <Item
        :to="{ name: 'Profile' }"
        replace
        icon-round
        icon="&#xe7fd;"
        label="Профиль"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "./Item.vue";

export default defineComponent({
  name: "Navigation Bar",

  components: { Item },

  computed: {
    show() {
      return !this.$route.meta.blank;
    },
  },
});
</script>

<style lang="scss" scoped>
.navigation-bar {
  width: 100vw;
  height: 80px;
  z-index: 1;
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
}

.v-enter-active,
.v-leave-active {
  transition: opacity 250ms ease-in-out, height 250ms ease-in-out;
}
.v-leave-to,
.v-enter-from {
  height: 0;
  opacity: 0;
}
</style>
