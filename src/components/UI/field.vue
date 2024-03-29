<template>
  <label class="field" :class="{ empty: !modelValue, error, focussed }">
    <span v-if="label" class="label" v-text="label" />
    <input
      :type="type"
      :name="name"
      :value="modelValue"
      @input="inputText"
      :autocomplete="autocomplete"
      @focus="focussed = true"
      @blur="focussed = false"
    />
    <span
      class="icon material-icons-round"
      @click="$emit('update:modelValue', '')"
      v-text="error ? '&#xe001;' : '&#xe888;'"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Text Field",

  props: {
    type: { type: String, default: "text" },
    name: { type: String, default: "" },
    label: { type: String, default: "" },
    error: { type: Boolean, default: false },
    modelValue: { type: String, default: "" },
    autocomplete: { type: String, default: "off" },
  },

  emits: ["update:modelValue"],

  data: () => ({
    focussed: false,
  }),

  methods: {
    inputText(e: Event) {
      const el = e.target as HTMLInputElement;
      if (!el) return;
      this.$emit("update:modelValue", el.value);
    },
  },
});
</script>

<style lang="scss" scoped>
.field {
  gap: 16px;
  width: calc(100% - 34px);
  cursor: text;
  margin: 8px 0;
  border: 1px solid;
  display: flex;
  padding: 8px 16px;
  position: relative;
  transition: border-color 250ms ease-in-out;
  align-items: center;
  border-radius: 4px;
  flex-direction: row;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-variant-light;
    border-color: $md-sys-color-outline-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-variant-dark;
    border-color: $md-sys-color-outline-dark;
  }

  &:hover {
    @media (prefers-color-scheme: light) {
      border-color: $md-sys-color-on-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      border-color: $md-sys-color-on-surface-dark;
    }
  }

  &.focussed {
    @media (prefers-color-scheme: light) {
      border-color: $md-sys-color-primary-light;
    }
    @media (prefers-color-scheme: dark) {
      border-color: $md-sys-color-primary-dark;
    }
  }

  &.error {
    @media (prefers-color-scheme: light) {
      border-color: $md-sys-color-error-light;
    }
    @media (prefers-color-scheme: dark) {
      border-color: $md-sys-color-error-dark;
    }
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    border-radius: 4px;
    @include body-large;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
    }
  }

  .label {
    @include body-large;

    top: 50%;
    left: 14px;
    padding: 0 4px;
    position: absolute;
    transform: translateY(-50%);
    transition: top 250ms ease-in-out, font 250ms ease-in-out,
      color 250ms ease-in-out;
    user-select: none;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
      background: $md-sys-color-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
      background: $md-sys-color-surface-dark;
    }
  }

  &.focussed .label,
  &:not(.empty) .label {
    @include body-small;
    top: -0px;
  }

  &.focussed .label {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-primary-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-primary-dark;
    }
  }

  &.error .icon,
  &.error .label {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-error-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-error-dark;
    }
  }

  .icon {
    cursor: pointer;
    transition: color 250ms ease-in-out;
    -webkit-tap-highlight-color: transparent;
  }
  .icon:active {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
    }
  }
}
</style>
