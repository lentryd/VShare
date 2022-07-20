<template>
  <div class="history">
    <List />

    <Transition name="history-view-transition">
      <KeepAlive>
        <View v-if="$chats.exists(chatId)" :key="chatId" :chatId="chatId" />
      </KeepAlive>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { List, View } from "@/components/history";

export default defineComponent({
  name: "History View",

  components: { List, View },

  computed: {
    chatId() {
      const id = this.$route.params.id;
      return typeof id == "string" ? id : id[0];
    },
  },
});
</script>

<style lang="scss">
// Для пк
@media (min-width: 768px) {
  .history {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: row;

    > .history-list {
      height: 100%;
      overflow: auto;
      min-width: 350px;
      flex-basis: 40%;
    }

    > .history-view {
      margin: 16px;
      height: calc(100% - 2 * 16px);
      overflow: auto;
      max-width: calc(100% - 16px);
      flex-basis: calc(60% - 16px);
      margin-left: 0;
      border-radius: 16px;

      @media (prefers-color-scheme: light) {
        background: $md-sys-color-surface-variant-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-surface-variant-dark;
      }
    }
  }
}

// Для телефонов
@media (max-width: 768px) {
  .history {
    min-height: 100%;

    > .history-view {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      position: fixed;

      @media (prefers-color-scheme: light) {
        background: $md-sys-color-surface-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-surface-dark;
      }
    }
  }

  .history-view-transition-enter-active,
  .history-view-transition-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .history-view-transition-leave-to,
  .history-view-transition-enter-from {
    opacity: 0;
    transform: translateX(50%);
  }
}
</style>
