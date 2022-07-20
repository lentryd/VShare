<template>
  <div class="navigation-rail">
    <Item to="/" icon="&#xe88a;" replace icon-round label="Главная" />

    <Item to="/history" replace icon-round icon="&#xe889;" label="История" />

    <Item to="/profile" replace icon-round icon="&#xe7fd;" label="Профиль" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "./Item.vue";

export default defineComponent({
  name: "Navigation Rail",

  components: { Item },
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
  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>