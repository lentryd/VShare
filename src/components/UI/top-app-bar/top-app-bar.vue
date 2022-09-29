<template>
  <div class="top-app-bar" :class="barClasses">
    <slot name="navigation" />

    <div class="headline" :class="headlineClass" v-text="title" />

    <div class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Top App Bar",

  props: {
    title: { type: String, default: "Page Title" },
    scrollEl: { type: String },
    centred: { type: Boolean, default: false },
    medium: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
  },

  data: () => ({
    scrollY: 0,
  }),

  computed: {
    barClasses() {
      return {
        centred: this.centred,
        medium: this.isMedium,
        large: this.isLarge,
        "on-scroll": this.scrollY > 0,
      };
    },
    headlineClass() {
      return this.isLarge
        ? "headline-medium"
        : this.isMedium
        ? "headline-small"
        : "title-large";
    },
    isMedium() {
      return this.medium && !this.isLarge;
    },
    isLarge() {
      return this.large;
    },
  },

  methods: {
    init() {
      (!this.scrollEl
        ? window
        : document.querySelector(this.scrollEl)
      )?.addEventListener("scroll", () => this.getScrollY());
    },
    unInit() {
      (!this.scrollEl
        ? window
        : document.querySelector(this.scrollEl)
      )?.removeEventListener("scroll", () => this.getScrollY());
    },
    getScrollY() {
      if (!this.scrollEl) this.scrollY = window.scrollY;
      else this.scrollY = document.querySelector(this.scrollEl)?.scrollTop ?? 0;
    },
  },

  mounted() {
    this.init();
    this.getScrollY();
  },

  beforeUnmount() {
    this.unInit();
  },
});
</script>

<style lang="scss">
.top-app-bar {
  top: 0;
  width: calc(100% - 32px);
  height: 64px;
  z-index: 1;
  display: flex;
  padding: 0 16px;
  overflow: hidden;
  position: sticky;
  flex-shrink: 0;
  user-select: none;
  align-items: center;
  flex-direction: row;
  transition: color 0.25s ease-in-out, background 0.25s ease-in-out;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-light;
    background: $md-sys-color-surface-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-dark;
    background: $md-sys-color-surface-dark;
  }

  &.medium {
    height: 72px;
    padding: 20px 16px;
    align-items: flex-start;
  }
  &.large {
    height: 104px;
    padding: 20px 16px 28px 16px;
    align-items: flex-start;
  }
  &.on-scroll {
    @media (prefers-color-scheme: light) {
      background: $md-sys-color-surface-variant-light;
    }
    @media (prefers-color-scheme: dark) {
      background: $md-sys-color-surface-variant-dark;
    }
  }
}

.top-app-bar > .headline {
  width: 100%;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
}

.top-app-bar > :first-child:not(.headline) {
  margin-right: 16px;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-dark;
  }
}

.top-app-bar.centred > .headline {
  width: fit-content;
  margin: 0 auto;
}
.top-app-bar.medium > .headline {
  margin: 0;
  margin-top: 41px;
}
.top-app-bar.large > .headline {
  margin: 0;
  margin-top: 68px;
}
.top-app-bar.medium > .headline:not(:first-child),
.top-app-bar.large > .headline:not(:first-child) {
  margin-left: -64px;
}

.top-app-bar > .actions {
  gap: 24px;
  display: flex;
  margin-left: auto;
}
.top-app-bar.centred > .actions {
  margin: 0;
}
</style>