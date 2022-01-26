<template>
  <transition name="dissolution">
    <Check v-if="!isOpen" />
    <Enter v-else-if="showSet" @hide="$emit('update:set', $event)" />
    <Disable v-else-if="showDisable" @hide="$emit('update:set', $event)" />
  </transition>

  <div class="dissolution-container" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Enter from "./enter.vue";
import Check from "./check.vue";
import Disable from "./disable.vue";

export default defineComponent({
  components: { Enter, Check, Disable },

  props: { set: Boolean },

  emits: ["update:set"],

  data: () => ({}),

  computed: {
    roomId() {
      return this.$firebase.room.data.id;
    },
    isOpen() {
      return (
        this.$idb.passwords.data.find((p) => p.roomId === this.roomId)
          ?.isOpen ?? true
      );
    },
    isProtected() {
      return this.$idb.passwords.exists(this.roomId);
    },

    showSet() {
      return this.set && !this.isProtected;
    },
    showDisable() {
      return this.set && this.isProtected;
    },
  },
});
</script>

<style >
@media (prefers-color-scheme: light) {
  .dissolution {
    --dissolution: #ffffffa6;

    --cancel: #b3b9c5;
    --done: #6ddd25;
  }
}

@media (prefers-color-scheme: dark) {
  .dissolution {
    --dissolution: #0b0d11a6;

    --cancel: #3f414c;
    --done: #5fc81c;
  }
}

.dissolution {
  gap: 0.2rem;
  top: 2.5%;
  left: 2.5%;
  width: 95%;
  height: 95%;
  z-index: 2;
  display: flex;
  position: absolute;
  background: var(--dissolution);
  align-items: center;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.dissolution svg {
  fill: var(--color);
  width: 6rem;
}
.dissolution.enter-password svg {
  width: 10rem;
}

.dissolution span {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.dissolution .inp {
  text-align: center;
  -webkit-text-security: disc;
}

.dissolution .inp-mask {
  display: none !important;
}

.dissolution-container {
  width: 100%;
  height: 100%;
  z-index: 1;
  display: none;
  position: absolute;
}
.dissolution:not([style="display: none;"]) + .dissolution-container {
  display: block;
}
</style>