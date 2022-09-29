<template>
  <Teleport to="body">
    <Transition name="popup-transition">
      <div v-if="show" class="popup" @click.self="show = false">
        <div
          ref="content"
          :style="style"
          class="popup-content"
          :class="{ 'no-animation': isTap }"
          @touchstart="onTap"
          @touchmove="onTapMove"
          @touchend="onTapEnd"
          @touchcancel="onTapEnd"
        >
          <span v-show="title" class="title-medium" v-text="title" />

          <div class="body">
            <span
              v-show="description"
              v-text="description"
              class="body-medium description"
            />

            <slot name="body" />
          </div>

          <div class="actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popup",

  props: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    diff: 0,
    isTap: false,
    position: {
      start: 0,
      current: 0,
    },
    height: "" as string | number,
    timestamp: 0,
  }),

  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(value: boolean) {
        this.height = "";
        this.$emit("update:modelValue", value);
      },
    },

    style() {
      return {
        height: this.num2px(this.height),
      };
    },
  },

  methods: {
    num2px(data: string | number) {
      return data + (typeof data === "number" ? "px" : "");
    },

    hasScrollingElement(e: { path: HTMLElement[] }) {
      const el = this.$refs.content as HTMLElement;
      const { path } = e;

      for (const i of path) {
        if (el == i) return false;
        if (i.scrollTop != 0) return true;
      }
      return false;
    },

    onTap(e: TouchEvent) {
      const el = this.$refs.content as HTMLElement;
      const positionY = e?.touches?.[0]?.pageY;
      if (!el || !positionY) return;

      this.isTap = false;
      this.height = "";
      this.timestamp = Date.now();
      this.position.start = positionY;
    },
    onTapMove(e: TouchEvent) {
      const el = this.$refs.content as HTMLElement;
      const positionY = e?.touches?.[0]?.pageY;
      if (
        positionY - this.position.start < 10 ||
        this.hasScrollingElement(e as any)
      )
        return;
      if (!this.height)
        this.diff = el.getBoundingClientRect().y - positionY + 24;

      this.isTap = true;
      this.height = document.body.clientHeight - positionY - this.diff;
      this.position.current = positionY;
    },
    onTapEnd() {
      const diff = this.position.current - this.position.start > 80;
      const timestamp = Date.now() - this.timestamp < 500;
      if (this.isTap && (diff || timestamp))
        return setTimeout(() => (this.show = false), 0);

      this.isTap = false;

      let height = "";
      const el = this.$refs.content as HTMLElement;
      const oldHeight = getComputedStyle(el).height;

      el.style.height = "auto";
      height = getComputedStyle(el).height;
      el.style.height = oldHeight;

      this.isTap = false;
      getComputedStyle(el).height;
      requestAnimationFrame(() => {
        el.style.height = height;
        setTimeout(() => (this.height = ""), 300);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.popup {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  position: fixed;
  background: #0000009b;
  flex-direction: column;
  justify-content: flex-end;
}

.popup-content {
  gap: 12px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 12px 16px;
  overflow: hidden;
  max-width: min(640px - 32px, calc(100% - 32px));
  max-height: calc(100% - 72px);
  transition: height 0.3s ease;
  border-radius: 24px 24px 0 0;
  flex-direction: column;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-light;
    background: $md-sys-color-surface-light;
  }

  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-dark;
    background: $md-sys-color-surface-dark;
  }

  &::before {
    content: "";
    width: 32px;
    height: 4px;
    margin: 4px auto;
    opacity: 0.4;
    border-radius: 8px;

    @media (prefers-color-scheme: light) {
      background: $md-sys-color-on-surface-light;
    }

    @media (prefers-color-scheme: dark) {
      background: $md-sys-color-on-surface-dark;
    }
  }
  &.no-animation {
    transition: none !important;
  }

  > .title-medium {
    margin: 0 auto;
  }

  > .body {
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

    > .description {
      margin: 0 auto;
      text-align: center;
    }
  }

  > .actions {
    gap: 8px;
    display: flex;
    margin-top: 8px;
    flex-direction: row;
    justify-content: flex-end;
  }
}

.popup-transition-enter-active,
.popup-transition-leave-active {
  transition: opacity 0.3s ease;
}

.popup-transition-enter-active > .popup-content,
.popup-transition-leave-active > .popup-content {
  transition: transform 0.3s ease !important;
}

.popup-transition-leave-to,
.popup-transition-enter-from {
  opacity: 0;
}

.popup-transition-leave-to > .popup-content,
.popup-transition-enter-from > .popup-content {
  transform: translateY(100%);
}
</style>
