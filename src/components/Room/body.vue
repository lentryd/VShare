<template>
  <div
    class="room"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <Password v-model:set="setPassword" />
    <Header @enterPassword="setPassword = true" />
    <Messages :roomId="roomId" />
    <Form />

    <transition name="dissolution">
      <div v-show="isDragging" class="dissolution drag">
        <span> Перетащите сюда файл{{ oneFile ? "" : "ы" }} </span>
        <span> для отправки в {{ roomName }} </span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Password from "./password";
import Header from "./header.vue";
import Messages from "./messages/";
import Form from "./form.vue";

export default defineComponent({
  components: { Password, Header, Messages, Form },

  props: {
    roomId: String,
  },

  data: () => ({
    oneFile: true,
    isDragging: false,
    setPassword: false,
  }),

  computed: {
    isOpen() {
      return (
        this.$idb.passwords.data.find((p) => p.roomId === this.roomId)
          ?.isOpen ?? true
      );
    },
    roomName() {
      return this.$firebase.room.data.name;
    },
  },

  watch: {
    password(v) {
      this.$idb.passwords.check(this.$firebase.room.data.id, v);
    },
  },

  methods: {
    onDragOver(e: DragEvent) {
      const { items } = e.dataTransfer ?? {};
      const files = Array.from(items ?? []).filter((i) => i.kind == "file");
      if (!files.length || !this.isOpen) return;
      e.preventDefault();

      this.oneFile = files.length == 1;
      this.isDragging = true;
    },
    onDragLeave(e: DragEvent) {
      const element = e.relatedTarget as null | HTMLElement;
      if (element?.closest(".room") || !this.isOpen) return;
      this.isDragging = false;
    },
    onDrop(e: DragEvent) {
      if (!this.isDragging || !this.isOpen) return;
      e.preventDefault();
      this.isDragging = false;

      const roomId = this.$firebase.room.data.id;
      const { items } = e.dataTransfer ?? {};
      const files = Array.from(items ?? []).filter((i) => i.kind == "file");

      files.forEach((f) => {
        const file = f.getAsFile();
        if (!file) return;

        this.$firebase.room.sendFile(roomId, file);
      });
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .room {
    --dissolution: #ffffffa6;
    --dissolution-shadow: #f5f5f5;

    --cancel: #b3b9c5;
    --done: #6ddd25;
  }
}

@media (prefers-color-scheme: dark) {
  .room {
    --dissolution: #0b0d11a6;
    --dissolution-shadow: #101216b3;

    --cancel: #3f414c;
    --done: #5fc81c;
  }
}

.room {
  width: calc(100% - 13.5rem);
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  background: var(--background);
}

.dissolution-container {
  width: 100%;
  height: 100%;
  z-index: 1;
  display: none;
  position: absolute;
}
.dissolution {
  gap: 0.2rem;
  top: 2.5%;
  left: 2.5%;
  width: 95%;
  height: 95%;
  z-index: 2;
  display: flex;
  position: absolute;
  background: var(--dissolution);
  box-shadow: 0 0 1px 1px var(--dissolution-shadow);
  align-items: center;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(6px);
}
.dissolution:not([style="display: none;"]) + .dissolution-container {
  display: block;
}

.drag span:nth-child(1) {
  font-size: 1.15rem;
  font-weight: 500;
}
.drag span:nth-child(2) {
  opacity: 0.85;
  font-size: 0.85rem;
  font-weight: 400;
}

.check-password svg {
  fill: var(--color);
  width: 6rem;
}
.check-password span {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}
.check-password input {
  width: 16.25rem;
  color: var(--color);
  border: 1px solid var(--color);
  padding: 0.25rem 0.45rem;
  font-size: 0.8rem;
  text-align: center;
  background: transparent;
  font-weight: 400;
  font-family: Roboto, sans-serif;
  border-radius: 6px;
  -webkit-text-security: disc;
}
.check-password input:focus {
  outline: none;
}

.enter-password svg {
  width: 10rem;
}
.enter-password span {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}
.enter-password input {
  width: 16.25rem;
  color: var(--color);
  border: 1px solid var(--color);
  padding: 0.25rem 0.45rem;
  font-size: 0.8rem;
  text-align: center;
  background: transparent;
  font-weight: 400;
  font-family: Roboto, sans-serif;
  border-radius: 6px;
  -webkit-text-security: disc;
}
.enter-password input:focus {
  outline: none;
}
.enter-password .btn-container {
  gap: 1rem;
  display: flex;
  margin-top: 0.4rem;
  flex-direction: row;
}
.enter-password .btn-container .btn {
  width: 5rem;
  color: var(--color);
  border: none;
  cursor: pointer;
  opacity: 0.8;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  background: red;
  font-weight: 400;
  user-select: none;
  font-family: Roboto, sans-serif;
  border-radius: 6px;
}
.enter-password .btn-container .btn:hover {
  opacity: 1;
}
.enter-password .btn-container .btn.cancel {
  background: var(--cancel);
}
.enter-password .btn-container .btn.done {
  background: var(--done);
}

@media screen and (max-width: 42em) {
  .room {
    width: calc(100% - 1.5rem);
    height: calc(100% - 0.9rem);
    z-index: 2;
    position: absolute;
  }
}
</style>