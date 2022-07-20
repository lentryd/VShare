<template>
  <div class="history-view">
    <Header v-if="$device.isMobile" :id="chatId" />

    <div class="content">
      <Message />
    </div>

    <Form :id="chatId" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Form from "@/components/history/view-form.vue";
import Header from "@/components/history/view-header.vue";
import Message from "@/components/message";

export default defineComponent({
  name: "History Viewer",

  components: { Form, Header, Message },

  props: {
    chatId: { type: String },
  },

  data: () => ({
    text: "",
  }),

  computed: {
    height() {
      const lines = this.text.match(/\n/g)?.length ?? 0;
      return (lines + 1) * 24 + "px";
    },
  },
});
</script>

<style lang="scss" scoped>
.history-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  width: calc(100% - 32px);
  padding: 0 16px;
  margin-top: auto;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
