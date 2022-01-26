<template>
  <button :style="{ '--color': color }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <slot>
        <rect fill="none" height="24" width="24" />
        <path
          d="M11.71,17.99C8.53,17.84,6,15.22,6,12c0-3.31,2.69-6,6-6c3.22,0,5.84,2.53,5.99,5.71l-2.1-0.63C15.48,9.31,13.89,8,12,8 c-2.21,0-4,1.79-4,4c0,1.89,1.31,3.48,3.08,3.89L11.71,17.99z M22,12c0,0.3-0.01,0.6-0.04,0.9l-1.97-0.59C20,12.21,20,12.1,20,12 c0-4.42-3.58-8-8-8s-8,3.58-8,8s3.58,8,8,8c0.1,0,0.21,0,0.31-0.01l0.59,1.97C12.6,21.99,12.3,22,12,22C6.48,22,2,17.52,2,12 C2,6.48,6.48,2,12,2S22,6.48,22,12z M18.23,16.26L22,15l-10-3l3,10l1.26-3.77l4.27,4.27l1.98-1.98L18.23,16.26z"
        />
      </slot>
    </svg>

    <span class="room-name" v-text="text" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: { type: String, required: true },
    color: { type: String, default: "#3f9bff" },
  },
});
</script>

<style scoped>
button {
  gap: 0.5rem;
  color: var(--color);
  width: calc(100% - 1rem);
  border: 0;
  margin: 0 .5rem;
  cursor: pointer;
  display: flex;
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: transparent;
  transition: background 0.25s ease-in-out, color 0.25s ease-in-out;
  align-items: center;
  border-radius: 8px;
  flex-direction: row;
}
button:hover {
  color: #fefefe !important;
  background: var(--color) !important;
}

button svg {
  fill: var(--color);
  width: 1rem;
  height: 1rem;
  transition: fill 0.25s ease-in-out;
}
button:hover svg {
  fill: #fefefe !important;
}

button span {
  overflow: hidden;
  font-size: 0.8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>