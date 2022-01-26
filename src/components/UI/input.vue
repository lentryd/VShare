<template>
  <input
    :type="type"
    :style="style"
    :class="{ inp: true, block, outline }"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :value="modelValue"
    @input="(e) => $emit('update:modelValue', e.target.value)"
  />
  <div class="inp-mask" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,

  props: {
    type: { type: String, default: "text" },
    color: { type: String, default: "#000000" },
    block: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    modelValue: String,
    background: { type: String, default: "grey" },
    placeholder: { type: String },
    autocomplete: { type: String },
  },

  emits: ["update:modelValue"],

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
.inp {
  gap: 0.5rem;
  color: var(--color);
  border: 0;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  background: var(--background);
  font-weight: 400;
  border-radius: 6px;
  transition: transform 0.25s ease-out;
}
.inp:focus {
  z-index: 11;
  outline: none;
  transform: scale(1.025);
}

.inp:focus + .inp-mask {
  z-index: 10;
  backdrop-filter: blur(1px) brightness(0.95);
}

.inp-mask {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1000;
  position: fixed;
  transition: backdrop-filter 0.25s ease-out;
  backdrop-filter: blur(0) brightness(1);
}

.inp::placeholder {
  color: var(--color);
  opacity: 0.8;
}

.inp.block {
  width: calc(100% - 2rem);
}
.inp.block.outline {
  width: calc(100% - 2rem - 0.09rem * 2);
}

.inp.outline {
  border: 0.09rem solid var(--color) !important;
  background: transparent !important;
}
</style>
