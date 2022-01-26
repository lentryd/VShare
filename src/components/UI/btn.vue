<template>
  <button
    :style="style"
    class="btn"
    :class="{ block, outline }"
    :disabled="isLoading"
  >
    <slot v-if="!isLoading" />
    <div v-else class="loader">Loading...</div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: { type: String, default: "black" },
    block: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    background: { type: String, default: "grey" },
  },

  computed: {
    style() {
      return {
        "--color": this.color,
        "--background": this.background,
      };
    },
  },
});
</script>

<style>
.btn {
  gap: 0.5rem;
  color: var(--color);
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  background: var(--background);
  transition: transform 0.15s ease-in-out;
  font-weight: 400;
  user-select: none;
  align-items: center;
  border-radius: 6px;
  flex-direction: row;
  justify-content: center;
}
.btn:active {
  transform: scale(1.05);
}

.btn > svg {
  fill: var(--color);
  width: 0.9rem;
  height: 0.9rem;
}

.btn.block {
  width: 100%;
}

.btn.outline {
  border: 0.09rem solid var(--color) !important;
  background: transparent !important;
}

.btn .loader,
.btn .loader:after {
  width: 0.734rem;
  height: 0.734rem;
  border-radius: 50%;
}
.btn .loader {
  border: 0.15rem solid transparent;
  position: relative;
  font-size: 0;
  transform: translateZ(0);
  animation: load8 1.1s infinite linear;
  text-indent: -9999em;
  border-top-color: var(--color);
}
@-webkit-keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>