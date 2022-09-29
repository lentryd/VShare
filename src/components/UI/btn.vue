<template>
  <div
    @click="onclick"
    @keypress.enter="onclick"
    class="btn"
    :class="classes"
    tabindex="0"
  >
    <slot />
    <span class="label-large" v-text="label" />
    <div class="state-layer">
      <div v-show="loading" class="loader" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteLocationRaw } from "vue-router";

export default defineComponent({
  name: "Button",

  props: {
    to: Object as PropType<RouteLocationRaw>,
    replace: { type: Boolean, default: false },

    label: { type: String, required: true },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },

    text: { type: Boolean, default: true },
    filled: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
  },

  emits: ["click"],

  computed: {
    classes() {
      return {
        icon: !!this.$slots.default,
        loading: this.loading,
        disabled: this.disabled,

        text: this.isText,
        filled: this.isFilled,
        outlined: this.isOutlined,
      };
    },

    isText() {
      return !this.isFilled && !this.isOutlined && this.text;
    },

    isFilled() {
      return !this.isOutlined && this.filled;
    },

    isOutlined() {
      return this.outlined;
    },
  },

  methods: {
    onclick(e: Event) {
      if (this.disabled || this.loading) return;
      else if (this.to) {
        if (this.replace) this.$router.replace(this.to as any);
        else this.$router.push(this.to as any);
      } else this.$emit("click", e);
    },
  },
});
</script>

<style lang="scss">
.btn {
  gap: 8px;
  width: fit-content;
  height: 40px;
  cursor: pointer;
  display: flex;
  padding: 0 24px;
  overflow: hidden;
  position: relative;
  user-select: none;
  align-items: center;
  border-radius: 20px;
  flex-direction: row;
  -webkit-tap-highlight-color: transparent;

  .state-layer {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    transition: background 250ms ease-in-out;
  }
  &.disabled .state-layer {
    display: none;
  }

  .loader,
  .loader:after {
    width: 0.734rem;
    height: 0.734rem;
    border-radius: 50%;
  }
  .loader {
    margin: auto;
    border: 0.15rem solid transparent;
    font-size: 0;
    animation: load8 1.1s infinite linear;
    text-indent: -9999em;
    border-top-color: unset;
  }

  &.icon {
    padding-left: 16px;
  }

  &.text {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-primary-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-primary-dark;
    }

    &.disabled {
      @media (prefers-color-scheme: light) {
        color: rgb($md-sys-color-on-surface-light, 38%);
      }
      @media (prefers-color-scheme: dark) {
        color: rgb($md-sys-color-on-surface-dark, 38%);
      }
    }

    &:not(.loading):hover .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-primary-light, 8%);
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-primary-dark, 8%);
      }
    }
    &:not(.loading):focus .state-layer,
    &:not(.loading):active .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-primary-light, 12%);
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-primary-dark, 12%);
      }
    }

    &.loading .state-layer {
      @media (prefers-color-scheme: light) {
        background: $md-sys-color-surface-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-surface-dark;
      }
    }
  }

  &.filled {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-primary-light;
      background: $md-sys-color-primary-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-primary-dark;
      background: $md-sys-color-primary-dark;
    }

    &.disabled {
      @media (prefers-color-scheme: light) {
        color: rgb($md-sys-color-on-surface-light, 38%);
        background: rgb($md-sys-color-on-surface-light, 12%);
      }
      @media (prefers-color-scheme: dark) {
        color: rgb($md-sys-color-on-surface-dark, 38%);
        background: rgb($md-sys-color-on-surface-dark, 12%);
      }
    }

    &:not(.loading):hover .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-on-primary-light, 8%);
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-on-primary-dark, 8%);
      }
    }
    &:not(.loading):focus .state-layer,
    &:not(.loading):active .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-on-primary-light, 12%);
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-on-primary-dark, 12%);
      }
    }

    &.loading .state-layer {
      @media (prefers-color-scheme: light) {
        background: $md-sys-color-primary-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-primary-dark;
      }
    }
  }

  &.outlined {
    height: 38px;
    border: 1px solid;
    transition: border-color 250ms ease-in-out;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-primary-light;
      background: $md-sys-color-surface-light;
      border-color: $md-sys-color-outline-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-primary-dark;
      background: $md-sys-color-surface-dark;
      border-color: $md-sys-color-outline-dark;
    }

    &.disabled {
      @media (prefers-color-scheme: light) {
        color: rgb($md-sys-color-on-surface-light, 38%);
        border-color: rgb($md-sys-color-on-surface-light, 12%);
      }
      @media (prefers-color-scheme: dark) {
        color: rgb($md-sys-color-on-surface-dark, 38%);
        border-color: rgb($md-sys-color-on-surface-dark, 12%);
      }
    }

    &:not(.loading):hover .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-primary-light, 8%);
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-primary-dark, 8%);
      }
    }
    &:not(.loading):focus .state-layer,
    &:not(.loading):active .state-layer {
      @media (prefers-color-scheme: light) {
        background: rgb($md-sys-color-primary-light, 12%);
        border-color: $md-sys-color-primary-light;
      }
      @media (prefers-color-scheme: dark) {
        background: rgb($md-sys-color-primary-dark, 12%);
        border-color: $md-sys-color-primary-dark;
      }
    }

    &.loading .state-layer {
      @media (prefers-color-scheme: light) {
        background: $md-sys-color-surface-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-surface-dark;
      }
    }
  }

  &:focus {
    outline: none;
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
