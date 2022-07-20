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
          <span v-if="title" class="title-medium" v-text="title" />

          <div class="content">
            <slot />
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
    minHeight: { type: [String, Number], default: 0 },
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    diff: 0,
    isTap: false,
    isFull: false,
    height: "" as string | number,
    positionY: 0,
    lastPositionY: 0,
    timestamp: 0,
  }),

  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit("update:modelValue", value);
      },
    },

    style() {
      return {
        height: this.num2px(this.height),
        "min-height": this.num2px(this.minHeight),
      };
    },
  },

  methods: {
    num2px(data: string | number) {
      return data + (typeof data === "number" ? "px" : "");
    },

    onTap(e: TouchEvent) {
      const el = this.$refs.content as HTMLElement;
      if (!el) return;

      this.isTap = true;
      this.positionY = e.touches[0].pageY;
      this.diff = el.getBoundingClientRect().y - this.positionY;
      this.timestamp = Date.now();
      this.height = document.body.clientHeight - e.touches[0].pageY - this.diff;
    },
    onTapMove(e: TouchEvent) {
      const el = e.target as Element;
      if (!el) return;

      this.lastPositionY = e.touches[0].pageY;
      this.height = document.body.clientHeight - e.touches[0].pageY - this.diff;
    },
    onTapEnd() {
      this.isTap = false;
      if (typeof this.height != "number") return;

      const diff = this.positionY - this.lastPositionY;
      if (Math.abs(diff) < 20) this.height = "";
      else if (diff > 0) {
        this.isFull = true;
        this.height = "100%";
      } else if (this.isFull) {
        this.isFull = false;

        const el = this.$refs.content as HTMLElement;
        let height = "";
        const oldHeight = getComputedStyle(el).height;
        this.height = oldHeight;

        el.style.height = "auto";
        height = getComputedStyle(el).height;
        el.style.height = oldHeight;
        getComputedStyle(el).height;

        requestAnimationFrame(() => {
          el.style.height = height;
        });
      } else {
        this.show = false;
        this.height = "";
      }
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
  display: flex;
  padding: 12px 16px;
  overflow: hidden;
  max-height: 100%;
  transition: height 0.3s ease;
  border-radius: 24px 24px 0 0;
  flex-direction: column;

  @media (prefers-color-scheme: light) {
    background: $md-sys-color-surface-light;
  }

  @media (prefers-color-scheme: dark) {
    background: $md-sys-color-surface-dark;
  }

  @media screen and (min-width: 768px) {
    width: 50%;
    margin: 0 auto;
  }

  &::before {
    content: "";
    width: 25px;
    margin: 0 auto;
    min-height: 4px;
    border-radius: 8px;

    @media (prefers-color-scheme: light) {
      background: $md-sys-color-surface-variant-light;
    }

    @media (prefers-color-scheme: dark) {
      background: $md-sys-color-surface-variant-dark;
    }
  }
  &.no-animation {
    transition: none !important;
  }

  > .title-medium {
    margin: 0 auto;
  }

  > .content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.popup-transition-enter-active,
.popup-transition-leave-active {
  transition: opacity 0.2s ease;
}

.popup-transition-enter-active > .popup-content,
.popup-transition-leave-active > .popup-content {
  transition: transform 0.2s ease;
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
