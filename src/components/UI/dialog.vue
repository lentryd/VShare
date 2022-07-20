<template>
  <Teleport to="body">
    <transition name="dialog-transition">
      <div v-if="show" class="dialog" @click.self="show = false">
        <div class="dialog-content">
          <slot name="icon" />

          <span v-show="title" class="headline-small" v-text="title" />

          <div class="body">
            <span
              v-show="description"
              class="body-medium"
              v-text="description"
            />

            <slot name="body" />
          </div>

          <div class="actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dialog",

  props: {
    title: { type: String },
    description: { type: String },
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(v: boolean) {
        this.$emit("update:modelValue", v);
      },
    },
  },
});
</script>

<style lang="scss">
.dialog {
  top: 0;
  left: 0;
  width: calc(100% - 2 * 48px);
  height: calc(100% - 2 * 48px);
  z-index: 999;
  display: flex;
  padding: 48px;
  position: fixed;
  background: #0000009b;

  @media screen and (min-width: 768px) {
    width: calc(100% - 2 * 56px);
    height: calc(100% - 2 * 56px);
    padding: 56px;
  }
}

.dialog-content {
  gap: 16px;
  margin: auto;
  padding: 24px;
  display: flex;
  min-width: 280px - 2 * 24px;
  max-width: min(calc(100% - 2 * 24px), 560px - 2 * 24px);
  max-height: calc(100% - 2 * 24px);
  border-radius: 28px;
  flex-direction: column;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-light;
    background: $md-sys-color-surface-light;
  }

  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-dark;
    background: $md-sys-color-surface-dark;
  }

  > span:first-child:not(.headline-small) {
    margin: 0 auto;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-secondary-light;
    }

    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-secondary-dark;
    }
  }

  > span:first-child:not(.headline-small) + span {
    text-align: center;
  }

  .body {
    gap: 16px;
    display: flex;
    overflow: auto;
    flex-direction: column;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-variant-light;
    }

    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-variant-dark;
    }
  }

  .actions {
    gap: 8px;
    display: flex;
    margin-top: 8px;
    flex-direction: row;
    justify-content: flex-end;
  }
}

.dialog-transition-enter-active,
.dialog-transition-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-transition-enter-active > .dialog-content,
.dialog-transition-leave-active > .dialog-content {
  transition: transform 0.2s ease;
}

.dialog-transition-leave-to,
.dialog-transition-enter-from {
  opacity: 0;
}

.dialog-transition-leave-to > .dialog-content,
.dialog-transition-enter-from > .dialog-content {
  transform: scale(0);
}
</style>
