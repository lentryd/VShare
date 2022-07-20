<template>
  <div class="history-view-form">
    <label v-if="canWrite">
      <span class="material-icons-round">&#xe9fc;</span>
      <input
        ref="inputFile"
        type="file"
        hidden
        multiple
        @change="changeFiles"
      />
    </label>

    <label id="form" v-if="canWrite">
      <textarea
        ref="textarea"
        v-focus
        v-model="text"
        placeholder="Сообщение"
        @keypress.enter="keypress"
      />
      <span class="material-icons-round" @click="sendMessage">&#xe163;</span>
    </label>

    <div v-if="!canWrite" class="banner">
      <span class="material-icons-round">&#xe001;</span>
      <span class="body-medium">
        Чат слишком старый, вы не можете отправлять сообщения.
      </span>
    </div>
  </div>

  <Teleport to="body">
    <div ref="dummyTextarea" class="dummy-textarea" v-text="text + '.'" />
  </Teleport>

  <Dialog v-model="showAttachments">
    <template v-slot:body>
      <div class="history-view-form-attachments">
        <div
          :key="name"
          v-for="({ name }, i) in files"
          class="attachments-item"
        >
          <div class="mime-icon" :class="'ico-' + getExtension(name)">
            <div class="ico"></div>
          </div>
          <span class="body-medium" v-text="name" />
          <span class="material-icons-round" @click="removeFile(i)">
            &#xe872;
          </span>
        </div>
      </div>

      <Field
        label="Подпись"
        v-focus
        v-model="filesCaption"
        @keypress.enter.prevent="sendMessage"
      />
    </template>

    <template v-slot:actions>
      <Btn
        @click="$refs.inputFile?.click()"
        label="Добавить"
        style="margin-right: auto"
      />

      <Btn @click="showAttachments = false" label="Отмена" />

      <Btn filled label="Отправить" @click="sendMessage" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { toRef, defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import Dialog from "@/components/ui/dialog.vue";
import useChatInfo from "@/composables/useChatInfo";

export default defineComponent({
  name: "History Viewer Form",

  components: { Btn, Field, Dialog },

  props: {
    id: { type: String, required: false },
  },

  setup(props) {
    return useChatInfo(toRef(props, "id"));
  },

  data: () => ({
    text: "",
    files: [] as File[],
    filesCaption: "",
  }),

  computed: {
    canWrite() {
      const now = Date.now();
      const timestamp = this.chatInfo?.timestamp?.getTime() ?? now;

      return now - timestamp <= 8.64e7;
    },
    showAttachments: {
      get() {
        return this.files.length > 0;
      },
      set(v: boolean) {
        if (!v) this.files = [];
      },
    },
  },

  watch: {
    text() {
      this.setHeight();
    },
    showAttachments(v) {
      if (!v) this.filesCaption = "";
      else (this.filesCaption = this.text), (this.text = "");
    },
  },

  methods: {
    setHeight() {
      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      const dummyTextarea = this.$refs.dummyTextarea as HTMLDivElement;
      if (!textarea || !dummyTextarea) return;

      dummyTextarea.style.width = getComputedStyle(textarea).width;
      setTimeout(() => {
        textarea.style.height = getComputedStyle(dummyTextarea).height;
      }, 0);
    },
    keypress(e: KeyboardEvent) {
      if (e.shiftKey) return;
      e.preventDefault();
      this.sendMessage();
    },

    getExtension(filename: string) {
      return filename.match(/\.(\w+)$/)?.[1] ?? "";
    },

    changeFiles(e: Event) {
      const input = e.target as HTMLInputElement;
      const files = input.files ?? [];

      for (const file of files)
        if (!this.files.find((f) => f.name == file.name)) this.files.push(file);
      input.value = "";
    },
    removeFile(index: number) {
      this.files.splice(index, 1);
    },

    sendMessage() {
      const text = (this.text || this.filesCaption).trim();
      const attachments = this.files;
      if (!text && !attachments.length) return;

      this.text = "";
      this.files = [];
      this.filesCaption = "";
      console.log(text, attachments);
    },
  },

  mounted() {
    this.setHeight();
  },
});
</script>

<style lang="scss" scoped>
.history-view-form {
  gap: 16px;
  width: calc(100% - 32px);
  display: flex;
  padding: 12px 16px;
  overflow: hidden;
  flex-shrink: 0;
  align-items: flex-end;
  flex-direction: row;
}

.banner {
  gap: 12px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: row;
}

label .material-icons-round {
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  transition: color 200ms ease-in-out;
  flex-shrink: 0;
  align-items: center;
  border-radius: 50%;
  justify-content: center;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-variant-light;
    background: $md-sys-color-surface-variant-light;

    @media (min-width: 768px) {
      background: $md-sys-color-surface-light;
    }
  }

  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-variant-dark;
    background: $md-sys-color-surface-variant-dark;

    @media (min-width: 768px) {
      background: $md-sys-color-surface-dark;
    }
  }

  &:hover {
    @media (prefers-color-scheme: light) {
      color: rgba($md-sys-color-on-surface-light, 85%);
    }

    @media (prefers-color-scheme: dark) {
      color: rgba($md-sys-color-on-surface-dark, 85%);
    }
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

#form {
  width: 100%;
  cursor: text;
  display: flex;
  padding: 4px 16px;
  align-items: flex-end;
  padding-right: 8px;
  border-radius: 24px;

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

  .material-icons-round {
    width: 48px - 2 * 4px;
    height: 48px - 2 * 4px;
  }
}

.dummy-textarea {
  top: -999px;
  left: -999px;
  position: fixed;
  white-space: break-spaces;
}

textarea,
.dummy-textarea {
  @include body-large;

  width: 100%;
  resize: none;
  border: none;
  margin: auto 0;
  min-height: 24px;
  max-height: 120px;
  word-break: break-word;
  background: transparent;

  @media (prefers-color-scheme: light) {
    color: $md-sys-color-on-surface-light;
  }

  @media (prefers-color-scheme: dark) {
    color: $md-sys-color-on-surface-dark;
  }
}

.history-view-form-attachments {
  display: flex;
  overflow: auto;
  flex-direction: column;

  > .attachments-item {
    gap: 12px;
    display: flex;
    padding: 6px 0;
    overflow: hidden;
    flex-shrink: 0;
    align-items: center;
    flex-direction: row;

    > .body-medium {
      width: 100%;
      height: 100%;
      overflow: hidden;
      word-break: break-word;
    }

    > .material-icons-round {
      cursor: pointer;
    }
  }
}
</style>
