<template>
  <div class="select-room">
    <h1>Выберите комнату для пользователя</h1>

    <div class="rooms">
      <div
        :key="id"
        class="room-preview"
        @click="$emit('setRoom', id)"
        v-for="{ id, name, members } in rooms"
      >
        <div class="avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            />
          </svg>
        </div>

        <div class="info">
          <span class="name" v-text="name" />
          <span class="devices"> {{ members }} {{ declension(members) }} </span>
        </div>
      </div>
    </div>

    <div class="btn-container">
      <Btn
        block
        color="var(--color)"
        @click="$emit('goBack')"
        background="var(--cancel-btn)"
        >Отмена</Btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/UI/btn.vue";

export default defineComponent({
  components: { Btn },

  emits: ["goBack", "setRoom"],

  computed: {
    rooms() {
      return this.$firebase.rooms.data.filter((r) => r.isMy);
    },
  },

  methods: {
    declension(members: number) {
      const n = members;
      const l = n % 10;
      const l1 = ((n - (n % 10)) / 10) % 10;

      if (l1 != 1 && l == 1) return "участник";
      else if (l1 != 1 && l >= 2 && l <= 4) return "участника";
      else return "участников";
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .room-preview {
    --room-hover-color: #2e3338;
    --room-hover-background: #e8eaed;

    --room-selected-color: #060607;
    --room-selected-background: #d4d7dc;
  }
}

@media (prefers-color-scheme: dark) {
  .room-preview {
    --room-hover-color: #dcddde;
    --room-hover-background: #23232c;

    --room-selected-color: #ffffff;
    --room-selected-background: #2d2d36;
  }
}

.select-room {
  gap: 1rem;
  width: 30em;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  align-items: center;
  flex-direction: column;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.rooms {
  width: 100%;
  overflow-y: auto;
}

.room-preview {
  gap: 0.6rem;
  cursor: pointer;
  display: flex;
  padding: 0.25rem 0.35rem;
  user-select: none;
  align-items: center;
  border-radius: 6px;
  flex-direction: row;
  transition: color 0.2s ease-out, background 0.2s ease-out;
}
.room-preview:hover {
  color: var(--room-hover-color);
  background: var(--room-hover-background);
}
.room-preview.selected {
  color: var(--room-selected-color) !important;
  background: var(--room-selected-background) !important;
}

.room-preview .avatar {
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  min-width: 2rem;
  min-height: 2rem;
  background: #2d8dd6;
  border-radius: 50%;
}
.room-preview .avatar > svg {
  fill: white;
}

.room-preview .info {
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.room-preview .name {
  padding: 0;
  font-size: 1.4rem;
}
.room-preview .devices {
  font-size: 0.9rem;
}

.btn-container {
  width: 100%;
}
</style>