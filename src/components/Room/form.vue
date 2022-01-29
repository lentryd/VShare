<template>
  <div class="room-form">
    <button @click="getFile">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
        />
      </svg>
    </button>
    <input
      ref="fileInput"
      type="file"
      multiple
      style="display: none"
      @change="sendFile"
    />

    <textarea
      ref="textarea"
      :style="{ height }"
      v-model="text"
      @keyup.shift.enter="sendMessage"
    />

    <button @click="sendMessage">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    text: "",
    height: "0",
    dummyTextarea: null as null | HTMLSpanElement,
  }),

  computed: {
    roomId() {
      return this.$firebase.room.data.id;
    },

    isOpen() {
      return (
        this.$idb.passwords.data.find((p) => p.roomId === this.roomId)
          ?.isOpen ?? true
      );
    },
  },

  watch: {
    text() {
      this.setHeight();
    },
  },

  methods: {
    setHeight() {
      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (!this.dummyTextarea || !textarea) return;

      const rem = parseFloat(getComputedStyle(document.body).fontSize);
      const width = parseFloat(getComputedStyle(textarea).width);

      this.dummyTextarea.style.width = width / rem + "rem";
      this.dummyTextarea.innerText = this.text + ".";

      const height = parseFloat(getComputedStyle(this.dummyTextarea).height);
      this.height = height / rem + 0.01 + "rem";
    },
    getFile() {
      if (!this.isOpen) return;
      const input = this.$refs.fileInput as HTMLInputElement;
      input.click();
    },
    pasteFile(e: ClipboardEvent) {
      if (!this.isOpen) return;
      const { files } = e.clipboardData ?? {};
      if (!files || !files.length) return;

      for (let i = 0; i < files.length; i++)
        this.$firebase.room.sendFile(this.roomId, files[i]);
    },
    sendFile() {
      if (!this.isOpen) return;
      const input = this.$refs.fileInput as HTMLInputElement;
      const { files } = input;
      if (!files) return;

      for (let i = 0; i < files.length; i++)
        this.$firebase.room.sendFile(this.roomId, files[i]);

      input.value = "";
    },
    sendMessage() {
      if (!this.isOpen) return;
      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (!this.text.trim()) return;
      this.$firebase.room.sendMessage(this.roomId, this.text.trim());
      this.text = "";
      textarea.focus();
    },
  },

  beforeMount() {
    this.dummyTextarea = document.createElement("span");
    this.dummyTextarea.classList.add("dummy-textarea");
    document.body.append(this.dummyTextarea);
  },

  mounted() {
    this.setHeight();

    const textarea = this.$refs.textarea as HTMLTextAreaElement;
    textarea.addEventListener("paste", this.pasteFile);
  },

  beforeUnmount() {
    if (this.dummyTextarea) document.body.removeChild(this.dummyTextarea);

    const textarea = this.$refs.textarea as HTMLTextAreaElement;
    textarea.removeEventListener("paste", this.pasteFile);
  },
});
</script>

<style>
@media (prefers-color-scheme: light) {
  .room-form {
    --textarea-color: #060607;
    --textarea-border: #f0f0f0;
    --textarea-background: #f6f6f6;
    --textarea-scroll-color: #dcdcdc;
    --textarea-scroll-background: #eeeeee;

    --button-color: #060607;
  }
}

@media (prefers-color-scheme: dark) {
  .room-form {
    --textarea-color: #ffffff;
    --textarea-border: #1e1e27;
    --textarea-background: #191922;
    --textarea-scroll-color: #28282c;
    --textarea-scroll-background: #1e1e27;

    --button-color: #ffffff;
  }
}

.room-form {
  gap: 0.4rem;
  padding: 6px;
  display: flex;
  background: var(--textarea-background);
  box-shadow: 0 0 1px var(--textarea-border);
  align-items: flex-end;
  border-radius: 8px;
  flex-direction: row;
}

.room-form button {
  width: fit-content;
  border: 0;
  cursor: pointer;
  height: fit-content;
  opacity: 0.7;
  padding: 0 0.25rem;
  background: transparent;
  transition: opacity 0.25s ease, transform 0.15s ease-out;
}
.room-form button:hover {
  opacity: 1;
}
.room-form button:active {
  transform: scale(1.1);
}
.room-form button svg {
  fill: var(--button-color);
  width: 1.25rem;
  height: 1.25rem;
}

.dummy-textarea {
  top: -999px;
  left: -999px;
  position: fixed;
}
.dummy-textarea,
.room-form textarea {
  color: var(--textarea-color);
  width: 100%;
  border: 0;
  resize: none;
  padding: 0.25rem 0;
  outline: none !important;
  font-size: 0.8rem;
  max-height: 5rem;
  background: transparent;
  font-family: Roboto, sans-serif;
}
.room-form textarea::-webkit-scrollbar-track {
  background-color: var(--textarea-scroll-background);
}
.room-form textarea::-webkit-scrollbar-thumb {
  background-color: var(--textarea-scroll-color);
}
</style>