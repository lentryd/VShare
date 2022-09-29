<template>
  <transition>
    <div v-show="show" class="navigation-rail">
      <Item
        :to="{ name: 'App' }"
        icon="&#xe88a;"
        label="Главная"
        replace
        icon-round
      />

      <Item
        :to="{ name: 'History' }"
        icon="&#xe889;"
        label="История"
        replace
        icon-round
      />

      <Item 
        :to="{ name: 'Profile' }" replace icon-round icon="&#xe7fd;" label="Профиль" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "./Item.vue";

export default defineComponent({
  name: "Navigation Rail",

  components: { Item },

  computed: {
    show() {
      return !this.$route.meta.blank;
    },
  },
});
</script>

<style lang="scss" scoped>
.navigation-rail {
  gap: 12px;
  width: 80px;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;
  flex-direction: column;
  justify-content: center;

  @media (prefers-color-scheme: light) {
    background: $md-sys-color-surface-light;
  }
  @media (prefers-color-scheme: dark) {
    background: $md-sys-color-surface-dark;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 250ms ease-in-out, width 250ms ease-in-out;
}
.v-leave-to,
.v-enter-from {
  width: 0;
  opacity: 0;
}
</style>
