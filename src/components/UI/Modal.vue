<template>
  <transition name="fade">
    <div v-show="show">
      <div class="mask" />

      <div class="modal">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  props: ["show"],
};
</script>

<style scoped>
.mask {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  position: fixed;
  backdrop-filter: blur(2px);
  background-color: #2d2d2d66;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  z-index: 100;
  max-width: 80%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 8px;
  background: white;
}
</style>