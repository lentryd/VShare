<template>
  <div @click="onclick" class="profile-item" tabindex="0">
    <span v-if="icon" :class="iconClass" v-text="icon" />
    <slot v-else />
    <span v-text="label" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Profile Item",

  props: {
    to: {},
    replace: { type: Boolean, default: false },

    label: { type: String, required: true },

    icon: { type: String, required: false },
    iconRound: { type: Boolean, default: false },
    iconOutlined: { type: Boolean, default: false },
  },

  emits: ["click"],

  computed: {
    iconClass() {
      return this.iconRound
        ? "material-icons-round"
        : this.iconOutlined
        ? "material-icons-outlined"
        : "material-icons";
    },
  },

  methods: {
    onclick(e: Event) {
      if (this.to) {
        if (this.replace) this.$router.replace(this.to as any);
        else this.$router.push(this.to as any);
      } else this.$emit("click", e);
    },
  },
});
</script>

<style lang="scss">
.profile-item {
  gap: 16px;
  cursor: pointer;
  padding: 16px;
  display: flex;
  user-select: none;
  align-items: center;
  flex-direction: row;
  transition: background 250ms ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-on-surface-light, 12%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-on-surface-dark, 12%);
    }
  }
  &:focus,
  &:active {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-on-surface-light, 24%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-on-surface-dark, 24%);
    }
  }

  @media screen and (min-width: 640px) {
    margin: 0 16px;
    margin-bottom: 4px;
    border-radius: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  svg {
    width: 24px;
    height: 24px;

    @media (prefers-color-scheme: light) {
      fill: $md-sys-color-on-background-light;
    }
    @media (prefers-color-scheme: dark) {
      fill: $md-sys-color-on-background-dark;
    }
  }
}
</style>
