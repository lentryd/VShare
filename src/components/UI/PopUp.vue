<template>
  <transition name="dissolution">
    <div class="pop-up" v-show="component">
      <Component :is="component" />
    </div>
  </transition>

  <div class="pop-up-container" @click.self="close" />
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  defineAsyncComponent,
  AsyncComponentLoader,
} from "vue";
import { RouteLocationNormalized } from "vue-router";

export default defineComponent({
  props: {
    route: Object as PropType<RouteLocationNormalized>,
  },

  emits: ["update:route"],

  computed: {
    component() {
      const component = this.route?.matched.at(-1)?.components.default;
      if (!component) return undefined;

      return "render" in component
        ? component
        : defineAsyncComponent(component as AsyncComponentLoader);
    },
  },

  methods: {
    close() {
      this.$emit("update:route", null);
      history.back();
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .pop-up {
    --pop-up-background: #ffffffbf;
  }
}

@media (prefers-color-scheme: dark) {
  .pop-up {
    --pop-up-background: #000000bf;
  }
}

.pop-up {
  top: 50%;
  left: 50%;
  width: calc(95% - 1.5rem);
  height: calc(95% - 0.9rem);
  z-index: 2;
  display: flex;
  overflow: auto;
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--pop-up-background);
  align-items: center;
  border-radius: 8px;
  justify-content: center;
  backdrop-filter: blur(6px);
}

@media screen and (max-width: 42em) {
  .pop-up {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

.pop-up-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: none;
  position: absolute;
}

.pop-up:not([style="display: none;"]) + .pop-up-container {
  display: unset;
}
</style>