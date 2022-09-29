<template>
  <span v-show="totalSize" class="size-stat title-medium">
    {{ formatSize(totalSize) }} из {{ formatSize(maxSize) }}
  </span>

  <div
    ref="container"
    class="files-container"
    v-show="showFilesList"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <div @click="addFile" v-show="files.length == 0" class="skeleton">
      <span class="material-icons-round md-48"> &#xe2c3; </span>
      <span class="body-medium" v-text="skeletonText" />
    </div>

    <div :key="name" v-for="({ name, size }, i) in files" class="file">
      <div class="mime-icon" :class="'ico-' + getExtension(name)">
        <div class="ico"></div>
      </div>
      <div class="info">
        <span class="title-small" v-text="name" />
        <span class="caption" v-text="formatSize(size)" />
      </div>
      <span @click="removeFile(i)" class="material-icons-round">&#xe5cd;</span>
    </div>
  </div>

  <Field label="Подпись" autocomplete="off" v-model="caption" />

  <input ref="input-file" type="file" multiple hidden @change="changeFiles" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { formatSize } from "@/composables/formats";

export default defineComponent({
  name: "Send Content",

  props: {
    text: { type: String, default: "" },
    files: { type: Array as PropType<File[]>, default: [] },
  },

  emits: ["update:text"],

  data: () => ({
    maxSize: 52428800,
    isDragging: false,
  }),

  computed: {
    showFilesList() {
      if (this.$device.isMobile) return this.files.length != 0;
      else return true;
    },

    skeletonText() {
      return this.isDragging ? "Отпустите тут" : "Перетащите файл сюда";
    },

    caption: {
      get() {
        return this.text;
      },
      set(val: string) {
        this.$emit("update:text", val);
      },
    },

    totalSize() {
      let size = 0;
      for (const file of this.files) size += file.size;

      return size;
    },
  },

  methods: {
    formatSize,
    getExtension(filename: string) {
      return filename.match(/\.(\w+)$/)?.[1] ?? "";
    },

    onDragOver(e: DragEvent) {
      const { items } = e.dataTransfer ?? {};
      const files = Array.from(items ?? []).filter((i) => i.kind == "file");
      if (!files.length) return;
      e.preventDefault();

      this.isDragging = true;
    },
    onDragLeave(e: DragEvent) {
      const element = e.relatedTarget as null | HTMLElement;
      if (element?.closest(".files-container")) return;
      this.isDragging = false;
    },
    onDrop(e: DragEvent) {
      e.preventDefault();
      if (!this.isDragging) return;
      this.isDragging = false;

      const { items } = e.dataTransfer ?? {};
      const files = Array.from(items ?? []).filter((i) => i.kind == "file");

      files.forEach((f) => {
        const file = f.getAsFile();
        if (!file) return;
        this.files.push(file);
      });
    },

    addFile() {
      const el = this.$refs["input-file"] as HTMLElement;
      if (!el) return;
      el.click();
    },
    removeFile(index: number) {
      this.files.splice(index, 1);
    },
    changeFiles(e: Event) {
      const input = e.target as HTMLInputElement;
      const files = input.files ?? [];

      for (const file of files) {
        if (this.totalSize + file.size > this.maxSize) {
          this.$device.toast(
            "Не удалось загрузить файл.\nВы можете загрузить файлы на " +
              this.formatSize(this.maxSize),
            9999
          );
          break;
        }
        if (!this.files.find((f) => f.name == file.name)) this.files.push(file);
      }
      input.value = "";
    },
  },
});
</script>

<style lang="scss" scoped>
.size-stat {
  margin: 0 auto;
}

.files-container {
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;

  .skeleton {
    gap: 12px;
    cursor: pointer;
    padding: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .file {
    gap: 12px;
    display: flex;
    padding: 6px 12px;
    align-items: center;
    flex-direction: row;

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

    > :last-child {
      cursor: pointer;
    }
  }
}
</style>
