<template>
  <div class="file text" @click="cancel ? cancel() : download()">
    <div class="icon">
      <svg
        v-if="isPending"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g><rect fill="none" height="24" width="24" /></g>
        <g>
          <path
            d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z"
          />
        </g>
      </svg>

      <svg
        v-else-if="isDownloading"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g><rect fill="none" height="24" width="24" /></g>
        <g>
          <path
            d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"
          />
        </g>
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
        />
      </svg>
    </div>

    <div class="info">
      <span class="name" v-text="name" />
      <span class="size">
        <span
          :key="i"
          v-for="(c, i) in parseTransferredSize()"
          style="position: relative"
        >
          <transition-group name="size-complete">
            <span :key="c + i" v-text="c" class="size-complete" />
          </transition-group> </span
        >{{ parseTransferredSize() ? " / " : "" }}{{ parseSize() }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const postfixSize = ["B", "KB", "MB", "GB", "TB"];
function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default defineComponent({
  props: {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    roomId: { type: String, required: true },
    fileId: { type: Number, required: true },
    cancel: { type: Function, required: false },
    isPending: { type: Boolean, required: false },
    transferredSize: { type: Number, required: false },
  },

  computed: {
    isDownloading() {
      return !!this.$idb.files.downloading.find(({ id }) => id == this.fileId);
    },
    cancelDownload() {
      return this.$idb.files.downloading.find(({ id }) => id == this.fileId)
        ?.cancel;
    },
    downloadedSize() {
      return this.$idb.files.downloading.find(({ id }) => id == this.fileId)
        ?.transferredSize;
    },
  },

  methods: {
    roundBytes(bytes: number) {
      let i = 0;
      while (bytes / 1024 > 1) {
        i++;
        bytes /= 1024;
      }
      return Math.round(bytes * 100) / 100 + " " + postfixSize[i];
    },
    parseSize() {
      return this.roundBytes(this.size);
    },
    parseTransferredSize() {
      const size = this.transferredSize || this.downloadedSize;
      if (!size) return undefined;

      let [number, postfix] = this.roundBytes(size).split(" ");
      if (parseFloat(number) % 1 == 0) number += ".00";
      else if (Math.round((parseFloat(number) % 1) * 100) % 10 == 0)
        number += "0";

      return (number + " " + postfix).split("");
    },

    download() {
      if (this.isDownloading) {
        this.cancelDownload?.();
        return;
      }
      const { id, name, type, data } = this.$idb.files.get(this.fileId) ?? {};
      if (!id || !name || !type || !data) {
        this.$idb.files
          .download(this.roomId, this.fileId, this.name)
          .then(() => this.download());
        return;
      }

      const link = document.createElement("a");
      link.setAttribute("download", name);
      link.setAttribute(
        "href",
        `data:${type};base64,` + arrayBufferToBase64(data)
      );
      link.click();
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .file {
    --color: #eef5f4;
    --icon-background: #6e92ee;
  }
}

@media (prefers-color-scheme: dark) {
  .file {
    --color: #ffffff;
    --icon-background: #3d4e7b;
  }
}

.file {
  gap: 0.5rem;
  width: 12rem;
  cursor: pointer;
  display: flex;
  max-width: 100%;
  user-select: none;
  align-items: center;
  flex-direction: row;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.25rem;
  background: var(--icon-background);
  border-radius: 50%;
}
.icon svg {
  fill: var(--color);
}

.info {
  width: calc(100% - 3rem);
  display: flex;
  flex-direction: column;
}

.name {
  width: 100%;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
}
.size {
  opacity: 0.8;
  font-size: 85%;
}

.size-complete {
  display: inline-block;
  transition: opacity 0.15s ease-in-out, transform 0.2s ease-in-out;
}
.size-complete-enter-from {
  opacity: 0 !important;
  transform: translateY(-40%);
}
.size-complete-leave-to {
  opacity: 0 !important;
  transform: translateY(40%);
}
.size-complete-leave-active {
  position: absolute;
}
</style>