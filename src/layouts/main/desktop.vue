<template>
  <div class="main-desktop">
    <slot name="receive" />
    <slot name="sent" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Main Desktop",
});
</script>

<style lang="scss">
.main-desktop {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;

  > div {
    flex-basis: calc(50% - 24px);
    max-width: 560px;
  }
}
</style>