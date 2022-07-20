<template>
  <div class="history-view-header">
    <span class="material-icons-round" @click="goBack">&#xe5c4;</span>

    <img :src="chatInfo?.avatarUrl" />

    <span class="title-large" v-text="chatInfo?.name" />

    <div v-show="chatInfo?.isMy" class="actions">
      <span @click="confirmDelete = true" class="material-icons-round"
        >&#xe872;</span
      >
      <span @click="updateStatus" class="material-icons-round">{{
        chatInfo?.saved ? "&#xe838;" : "&#xe83a;"
      }}</span>
    </div>
  </div>

  <Dialog
    v-model="confirmDelete"
    title="Удалить чат?"
    description="Если вы удалите этот чат, то вы потеряете доступ к файлам и сообщениям. Это нельзя отменить."
  >
    <template v-slot:actions>
      <Btn @click="confirmDelete = false" label="Отмена" />

      <Btn filled label="Удалить" @click="deleteChat" />
    </template>
  </Dialog>

  <Dialog
    v-model="confirmStatus"
    title="Снять метку?"
    description="Этот чат очень старый, если вы удалите ярлык сохранения, вы потеряете доступ к файлам и сообщениям."
  >
    <template v-slot:actions>
      <Btn @click="confirmStatus = false" label="Отмена" />

      <Btn filled label="Снять метку" @click="deleteChat" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { toRef, defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Dialog from "@/components/ui/dialog.vue";
import useChatInfo from "@/composables/useChatInfo";

export default defineComponent({
  name: "History Viewer Header",

  components: { Btn, Dialog },

  props: {
    id: { type: String, required: false },
  },

  setup(props) {
    return useChatInfo(toRef(props, "id"));
  },

  data: () => ({
    confirmDelete: false,
    confirmStatus: false,
  }),

  methods: {
    goBack() {
      if (window?.history.state?.back == "/history") this.$router.back();
      else this.$router.replace("/history");
    },
    deleteChat() {
      if (!this.id) return;
      this.confirmDelete = false;
      this.confirmStatus = false;
      return this.$chats.delete(this.id);
    },
    updateStatus() {
      if (!this.id) return;

      const now = Date.now();
      const timestamp = this.chatInfo?.timestamp.getTime() ?? now;
      if (this.chatInfo?.saved && now - timestamp >= 8.64e8) {
        this.confirmStatus = true;
        return;
      }

      return this.$chats.setStatus(this.id, !this.chatInfo?.saved);
    },
  },
});
</script>

<style lang="scss" scoped>
.history-view-header {
  width: calc(100% - 32px);
  height: 64px;
  display: flex;
  padding: 0 16px;
  flex-shrink: 0;
  user-select: none;
  align-items: center;
  flex-direction: row;

  .material-icons-round {
    width: 48px;
    height: 48px;
    cursor: pointer;
    display: flex;
    transition: color 200ms ease-in-out;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-variant-light;
    }

    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-variant-dark;
    }

    &:active {
      @media (prefers-color-scheme: light) {
        color: $md-sys-color-on-surface-light;
      }

      @media (prefers-color-scheme: dark) {
        color: $md-sys-color-on-surface-dark;
      }
    }
  }

  > .material-icons-round:first-child {
    margin-right: 16px;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
    }

    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
    }
  }

  img {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .title-large {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .actions {
    gap: 24px;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
  }
}
</style>
