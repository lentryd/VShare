<template>
  <div
    v-if="file && !loading"
    class="file"
    @click="!file?.isLoaded ? remove() : download()"
  >
    <div class="mime-icon" :class="'ico-' + getExtension(file.name)">
      <div class="ico"></div>
    </div>

    <div class="info">
      <span class="title-small" v-text="file.name" />
      <span class="caption" v-text="size" />
    </div>

    <span v-if="!file.isLoaded" class="material-icons-round"> &#xe5cd; </span>
    <span v-else class="material-icons-round"> &#xe2c4; </span>
  </div>

  <div v-else-if="loading" class="file skeleton" />
</template>

<script lang="ts">
import { formatSize } from "@/composables/formats";
import { defineComponent } from "vue";

export default defineComponent({
  name: "File Item",

  props: {
    id: { type: Number, required: true },
  },

  data: () => ({
    loading: true,
  }),

  computed: {
    file() {
      return this.$fb.files.state.find((f) => f.id === this.id);
    },

    size() {
      if (!this.file) return "";
      return !this.file.transferredSize
        ? formatSize(this.file.size)
        : formatSize(this.file.transferredSize) +
            " / " +
            formatSize(this.file.size);
    },
  },

  watch: {
    id() {
      this.init();
    },
  },

  methods: {
    formatSize,
    getExtension(filename: string) {
      return filename.match(/\.(\w+)$/)?.[1] ?? "";
    },

    init() {
      this.loading = true;

      this.$fb.files
        .get(this.id)
        .catch(() => this.init())
        .finally(() => (this.loading = false));
    },
    remove() {
      this.$fb.files.remove(this.id);
    },
    download() {
      if (!this.file?.downloadURL) return;

      const a = document.createElement("a");
      a.href = this.file.downloadURL;
      a.download = this.file.name;
      a.click();
    },
  },

  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.file {
  gap: 16px;
  cursor: pointer;
  display: flex;
  padding: 8px 16px;
  transition: color 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  user-select: none;
  align-items: center;
  border-radius: 16px;
  flex-direction: row;

  &:hover {
    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
      background: lighten($md-sys-color-surface-light, 5%);
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
      background: lighten($md-sys-color-surface-dark, 5%);
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
        0px 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  .info {
    gap: 6px;
    width: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    .title-small {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.skeleton.file {
  cursor: progress;
  height: 76px - 16px;
}
</style>
