<template>
  <div class="room-header">
    <button @click="goBack" class="hidden-mobile">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </button>

    <div class="room-info">
      <input
        v-if="isMy"
        class="room-name"
        :style="{ width }"
        v-model="dummyName"
        @change="saveName"
      />
      <span v-else class="room-name" v-text="name" />

      <span class="room-members"> {{ members }} {{ declension }}</span>
    </div>

    <router-link
      :to="{ name: 'AddUser', params: { roomId } }"
      custom
      v-slot="{ navigate }"
    >
      <button v-if="isMy" @click="navigate">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </button>
    </router-link>

    <button v-if="isMy">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        />
      </svg>
    </button>

    <button @click="$emit('enterPassword')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["enterPassword"],

  data: () => ({
    width: "0",
    dummyName: "",
    dummyInput: null as null | HTMLSpanElement,
  }),

  computed: {
    roomId() {
      return this.$firebase.room.data.id;
    },
    isMy() {
      return this.$firebase.room.data.isMy;
    },
    name() {
      return this.$firebase.room.data.name;
    },
    members() {
      return this.$firebase.room.data.members.length;
    },

    declension() {
      const n = this.$firebase.room.data.members.length ?? 0;
      const l = n % 10;
      const l1 = ((n - (n % 10)) / 10) % 10;

      if (l1 != 1 && l == 1) return "участник";
      else if (l1 != 1 && l >= 2 && l <= 4) return "участника";
      else return "участников";
    },
  },

  watch: {
    name(value) {
      this.dummyName = value;
    },
    dummyName() {
      this.setInputWidth();
    },
  },

  methods: {
    goBack() {
      window.history?.state?.back == "/app/rooms/"
        ? this.$router.back()
        : this.$router.replace("/app/rooms/");
    },
    setInputWidth() {
      if (!this.dummyInput) return;

      this.dummyInput.innerText = this.dummyName;

      const rem = parseFloat(getComputedStyle(document.body).fontSize);
      const width = parseFloat(getComputedStyle(this.dummyInput).width) / rem;

      this.width = width + "rem";
    },
    saveName() {
      if (!this.dummyName) return (this.dummyName = this.name ?? "");

      this.$firebase.room
        .renameRoom(this.dummyName)
        ?.catch(() => (this.dummyName = this.name ?? ""));
    },
  },

  beforeMount() {
    this.dummyInput = document.createElement("span");
    this.dummyInput.classList.add("room-name", "dummy-input");

    document.body.append(this.dummyInput);
  },

  mounted() {
    this.dummyName = this.name ?? "";
  },

  beforeUnmount() {
    if (this.dummyInput) document.body.removeChild(this.dummyInput);
  },
});
</script>

<style>
@media (prefers-color-scheme: light) {
  .room-header {
    --color: #060607;
    --background: #f6f6f6;

    --divider: #ececec;
  }
}

@media (prefers-color-scheme: dark) {
  .room-header {
    --color: #ffffff;
    --background: #191922;

    --divider: #23232c;
  }
}

.room-header {
  gap: 0.6rem;
  width: calc(100% - 1.6rem);
  color: var(--color);
  z-index: 1;
  display: flex;
  border-radius: 0.4rem;
  padding: 0.25rem 0.8rem;
  box-shadow: 0 0 1px var(--divider);
  background: var(--background);
  flex-direction: row;
}

.room-header button {
  border: 0;
  cursor: pointer;
  opacity: 0.8;
  display: flex;
  padding: 0.25rem;
  background: none;
  align-items: center;
}
.room-header button:hover {
  opacity: 1;
}
.room-header button svg {
  fill: var(--color);
  width: 1.2rem;
}

@media screen and (min-width: 42em) {
  .room-header button.hidden-mobile {
    display: none;
  }
}

.room-header .room-info {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.dummy-input,
.room-header .room-name {
  padding: 0 4px;
  font-size: 0.9rem;
  font-weight: 400;
  font-family: Roboto, sans-serif;
}
.dummy-input,
.room-header input.room-name {
  color: var(--color);
  border: none;
  max-width: calc(100% - 8px);
  background: transparent;
  border-radius: 4px;
}
.room-header input.room-name:hover,
.room-header input.room-name:focus {
  outline: 1.5px solid var(--divider);
}
.dummy-input {
  top: -999px;
  left: -999px;
  position: fixed;
  white-space: pre;
}
.room-header .room-members {
  opacity: 0.8;
  padding: 0 4px;
  font-size: 0.6rem;
  font-weight: 400;
}
</style>