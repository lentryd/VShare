<template>
  <div class="message my">
    <div v-if="attachments.length" class="attachments">
      <Attachment :key="i" v-for="(_, i) in attachments" />
    </div>

    <span v-if="text" class="content" v-html="htmlContent" />

    <LinkPreview :value="text" />

    <span class="time caption">19:22</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Attachment from "./attachment.vue";
import LinkPreview from "./link-preview.vue";

const urlRegex = /(https?:\/\/[^\s]+)/g;
const tagsToReplace = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

export default defineComponent({
  name: "Message",

  components: { Attachment, LinkPreview },

  data: () => ({
    text: "",
    attachments: [""],
  }),

  computed: {
    htmlContent() {
      return this.text
        .replace(/[&<>]/g, (tag) =>
          tag in tagsToReplace
            ? tagsToReplace[tag as keyof typeof tagsToReplace]
            : tag
        )
        .replace(
          urlRegex,
          (url) =>
            `<a href="${url}" style="color: unset" target="_blank"">${url}</a>`
        );
    },
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
.message {
  gap: 2px;
  width: fit-content;
  display: flex;
  padding: 4px 8px;
  max-width: 90%;
  border-radius: 12px;
  flex-direction: column;

  &.my {
    margin-left: auto;
    border-bottom-right-radius: 2px;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-secondary-light;
      background: $md-sys-color-secondary-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-secondary-dark;
      background: $md-sys-color-secondary-dark;
    }
  }

  &:not(.my) {
    border-bottom-left-radius: 2px;

    @media (prefers-color-scheme: light) {
      background: $md-sys-color-surface-variant-light;
    }
    @media (prefers-color-scheme: dark) {
      background: $md-sys-color-surface-variant-dark;
    }

    @media (min-width: 768px) {
      @media (prefers-color-scheme: light) {
        background: $md-sys-color-surface-light;
      }
      @media (prefers-color-scheme: dark) {
        background: $md-sys-color-surface-dark;
      }
    }
  }

  .attachments {
    gap: 8px;
    display: flex;
    padding: 2px 8px;
    flex-direction: column;
  }

  .content {
    white-space: break-spaces;
    overflow-wrap: break-word;
  }

  .time {
    user-select: none;
    margin-left: auto;
  }
}
</style>
