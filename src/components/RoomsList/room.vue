<template>
  <router-link :to="path" custom v-slot="{ navigate, isActive }">
    <div @click="navigate" class="room-preview" :class="{ selected: isActive }">
      <div class="avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
          />
        </svg>
      </div>

      <div class="info">
        <span class="name">
          <svg
            v-if="isProtected"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            />
          </svg>

          {{ name }}
        </span>
        <span class="devices"> {{ members }} {{ declension }} </span>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: { type: String, required: true },
    isMy: { type: Boolean },
    name: { type: String, required: true },
    members: { type: Number, required: true },
  },

  computed: {
    path() {
      return `/app/rooms/${this.id}`;
    },
    declension() {
      const n = this.members;
      const l = n % 10;
      const l1 = ((n - (n % 10)) / 10) % 10;

      if (l1 != 1 && l == 1) return "участник";
      else if (l1 != 1 && l >= 2 && l <= 4) return "участника";
      else return "участников";
    },
    isProtected() {
      return this.$idb.passwords.exists(this.id);
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

.room-preview {
  gap: 0.6rem;
  cursor: pointer;
  margin: 0 0.5rem;
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
.room-preview:hover .name svg {
  fill: var(--room-hover-color) !important;
}
.room-preview.selected {
  color: var(--room-selected-color) !important;
  background: var(--room-selected-background) !important;
}
.room-preview.selected .name svg {
  width: 0.8rem;
  fill: var(--room-selected-color) !important;
}

.room-preview .avatar {
  width: 1rem;
  height: 1rem;
  padding: 0.5rem;
  min-width: 1rem;
  min-height: 1rem;
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
  gap: 0.25rem;
  padding: 0;
  display: flex;
  overflow: hidden;
  font-size: 0.8rem;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.room-preview .name svg {
  fill: var(--color);
  width: 0.8rem;
  min-width: 0.8rem;
}
.room-preview .devices {
  font-size: 0.6rem;
}
</style>