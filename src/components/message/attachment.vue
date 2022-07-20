<template>
  <div class="message-attachment" @click="openAttachment">
    <img v-if="isImage" :src="url" @dragstart.prevent />
    <div v-else class="mime-icon" :class="'ico-' + extension">
      <div class="ico" />
    </div>

    <div class="info">
      <span class="body-medium" v-text="name" />
      <span class="body-small" v-text="size" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Message Attachment",

  data: () => ({
    url: "https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png",
    name: "Название",
    size: "1.43 МБ",
  }),

  computed: {
    isImage() {
      return true;
    },
    extension() {
      return "txt";
    },
  },

  methods: {
    openAttachment() {
      window.open(this.url, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.message-attachment {
  gap: 12px;
  cursor: pointer;
  display: flex;
  overflow: hidden;
  min-width: 250px;
  user-select: none;
  align-items: center;
  flex-direction: row;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }

  .info {
    display: flex;
    word-break: break-word;
    flex-direction: column;

    .body-medium {
      font-weight: 500;
    }
  }
}
</style>
