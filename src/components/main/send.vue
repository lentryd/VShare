<template>
  <div class="sent">
    <div
      class="attachments"
      :class="{ hidden: !canContinue }"
      @click="canContinue ? null : $refs['upload-file'].click()"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <div v-show="!canContinue" class="empty-item">
        <span class="material-icons-round md-48"> &#xe2c3; </span>
        <span class="body-medium">{{
          isDragging ? "Отпустите тут" : "Перетащите файл сюда"
        }}</span>
      </div>

      <transition-group name="attachment-transition">
        <div
          :key="name"
          v-for="({ name }, i) in files"
          class="attachments-item"
        >
          <div class="mime-icon" :class="'ico-' + getExtension(name)">
            <div class="ico"></div>
          </div>
          <span class="caption" v-text="name" />
          <span class="material-icons-round" @click="removeFile(i)"
            >&#xe5cd;</span
          >
        </div>

        <div :key="text" v-for="(text, i) in texts" class="attachments-item">
          <div class="mime-icon ico-text">
            <div class="ico"></div>
          </div>
          <span class="caption" v-text="text" />
          <span class="material-icons-round" @click="removeText(i)"
            >&#xe5cd;</span
          >
        </div>
      </transition-group>
    </div>

    <div class="items">
      <div @click="$refs['upload-file'].click()" class="item" tabindex="0">
        <span class="material-icons-round">&#xe9fc;</span>
        <span>Добавить файл</span>
        <input
          ref="upload-file"
          type="file"
          hidden
          multiple
          @change="changeFiles"
        />
      </div>

      <div @click="addText = true" class="item" tabindex="0">
        <span class="material-icons-round">&#xe264;</span>
        <span>Добавить текст</span>
      </div>
    </div>

    <Btn
      label="Продолжить"
      filled
      @click="send"
      :loading="loading"
      :disabled="!canContinue"
    />
  </div>

  <Dialog
    title="Добавить текст"
    description="Введенный вами текст будет доступен другому человеку. Не вводите конфиденциальную информацию."
    v-model="addText"
  >
    <template v-slot:icon>
      <span class="material-icons-round">&#xe264;</span>
    </template>

    <template v-slot:body>
      <textarea ref="textarea" v-focus v-model.trim="text"></textarea>
    </template>

    <template v-slot:actions>
      <Btn @click="addText = false" label="Отмена" />

      <Btn
        @click="changeTexts(text)"
        label="Добавить"
        :disabled="!text.length"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Dialog from "@/components/ui/dialog.vue";

export default defineComponent({
  name: "Sent",

  components: { Btn, Dialog },

  data: () => ({
    text: "",
    files: [] as File[],
    texts: [] as string[],
    addText: false,
    loading: false,
    isDragging: false,
  }),

  computed: {
    canContinue() {
      return !!this.files.length || !!this.texts.length;
    },
  },

  watch: {
    addText(v) {
      if (!v) return;
      this.text = "";
      setTimeout(() => (this.$refs.textarea as HTMLElement)?.focus(), 0);
    },
  },

  methods: {
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
      if (element?.closest(".attachments")) return;
      this.isDragging = false;
    },
    onDrop(e: DragEvent) {
      if (!this.isDragging) return;
      e.preventDefault();
      this.isDragging = false;
      const { items } = e.dataTransfer ?? {};
      const files = Array.from(items ?? []).filter((i) => i.kind == "file");
      files.forEach((f) => {
        const file = f.getAsFile();
        if (!file) return;
        this.files.push(file);
      });
    },

    changeFiles(e: Event) {
      const input = e.target as HTMLInputElement;
      const files = input.files ?? [];

      for (const file of files)
        if (!this.files.find((f) => f.name == file.name)) this.files.push(file);
    },
    changeTexts(str: string) {
      this.texts.push(str.trim());
      this.addText = false;
    },

    removeFile(index: number) {
      this.files.splice(index, 1);
    },
    removeText(index: number) {
      this.texts.splice(index, 1);
    },

    send() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 5000);
    },
  },
});
</script>

<style lang="scss" scoped>
.sent {
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.attachments {
  gap: 8px;
  width: calc(100% - 34px);
  height: 94px;
  border: 1px solid;
  display: flex;
  padding: 12px 16px;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  border-radius: 12px;
  flex-direction: row;

  @media (prefers-color-scheme: light) {
    border-color: $md-sys-color-outline-light;
  }
  @media (prefers-color-scheme: dark) {
    border-color: $md-sys-color-outline-dark;
  }
  @media screen and (min-width: 768px) {
    max-width: 350px - 34px;
  }

  &.hidden {
    cursor: pointer;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .empty-item {
    gap: 8px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .attachments-item {
    width: 102px;
    margin: 0 auto;
    display: flex;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    align-items: center;
    flex-direction: column;

    span.caption {
      width: 100%;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    span.material-icons-round {
      top: 2px;
      right: 2px;
      cursor: pointer;
      padding: 4px;
      font-size: 20px;
      position: absolute;
      border-radius: 50%;
      -webkit-tap-highlight-color: transparent;

      @media (prefers-color-scheme: light) {
        color: $md-sys-color-on-secondary-container-light;
        background: $md-sys-color-secondary-container-light;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
          0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      }
      @media (prefers-color-scheme: dark) {
        color: $md-sys-color-on-secondary-container-dark;
        background: $md-sys-color-secondary-container-dark;
        box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
        filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
      }
    }
  }
}

.items {
  width: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: calc(100% + 36px);
  }
  @media screen and (min-width: 768px) {
    max-width: 350px;
  }
}

.item {
  gap: 16px;
  cursor: pointer;
  padding: 16px;
  display: flex;
  user-select: none;
  align-items: center;
  flex-direction: row;
  transition: background 250ms ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-on-surface-light, 12%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-on-surface-dark, 12%);
    }
  }
  &:focus,
  &:active {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-on-surface-light, 24%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-on-surface-dark, 24%);
    }
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 4px;
    border-radius: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

textarea {
  @include body-large;

  width: calc(100% - 18px);
  resize: none;
  height: 90px - 18px;
  border: 1px solid;
  outline: none;
  padding: 8px;
  background: transparent;
  transition: border-color 250ms ease-in-out;
  border-radius: 4px;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-variant-light;
    border-color: $md-sys-color-outline-light;
  }
  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-variant-dark;
    border-color: $md-sys-color-outline-dark;
  }

  &:hover {
    @media (prefers-color-scheme: light) {
      border-color: $md-sys-color-on-surface-light;
    }
    @media (prefers-color-scheme: dark) {
      border-color: $md-sys-color-on-surface-dark;
    }
  }

  &:focus {
    @media (prefers-color-scheme: light) {
      border-color: $md-sys-color-primary-light;
    }
    @media (prefers-color-scheme: dark) {
      border-color: $md-sys-color-primary-dark;
    }
  }
}

.attachment-transition-transition-enter-active,
.attachment-transition-leave-active,
.attachments-item {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.attachment-transition-enter-from,
.attachment-transition-leave-to {
  opacity: 0;
  transform: scale(0);
}

.attachment-transition-leave-active {
  position: absolute !important;
}
</style>
