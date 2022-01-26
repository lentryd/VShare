<template>
  <div class="rooms">
    <BtnContainer>
      <router-link to="/app/myCode" custom v-slot="{ navigate }">
        <Btn text="Войти в комнату" color="var(--add-btn)" @click="navigate">
          <g><rect fill="none" height="24" width="24" /></g>
          <g>
            <g>
              <path d="M3,11h8V3H3V11z M5,5h4v4H5V5z" />
              <path d="M3,21h8v-8H3V21z M5,15h4v4H5V15z" />
              <path d="M13,3v8h8V3H13z M19,9h-4V5h4V9z" />
              <rect height="2" width="2" x="19" y="19" />
              <rect height="2" width="2" x="13" y="13" />
              <rect height="2" width="2" x="15" y="15" />
              <rect height="2" width="2" x="13" y="17" />
              <rect height="2" width="2" x="15" y="19" />
              <rect height="2" width="2" x="17" y="17" />
              <rect height="2" width="2" x="17" y="13" />
              <rect height="2" width="2" x="19" y="15" />
            </g>
          </g>
        </Btn>
      </router-link>

      <router-link to="/app/addRoom" custom v-slot="{ navigate }">
        <Btn text="Создать комнату" color="var(--create-btn)" @click="navigate">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </Btn>
      </router-link>
    </BtnContainer>

    <Room :key="room.id" v-for="room in rooms" v-bind="room" />

    <BtnContainer v-if="!isInstalled" position="bottom">
      <Btn
        @click="$pwa.install()"
        text="Установить приложение"
        color="var(--download-btn)"
      >
        <g><rect fill="none" height="24" width="24" /></g>
        <g>
          <path
            d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"
          />
        </g>
      </Btn>
    </BtnContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "./btn.vue";
import Room from "./room.vue";
import BtnContainer from "./btn-container.vue";

export default defineComponent({
  components: { Btn, Room, BtnContainer },

  computed: {
    rooms() {
      return this.$firebase.rooms.data;
    },

    isInstalled() {
      return this.$pwa.isInstalled;
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .rooms {
    --color: #6a7480;
    --background: #f6f6f6;

    --add-btn: #1771e6;
    --create-btn: #3ba55d;
    --download-btn: #48abf6;

    --scroll-track: #edeef0;
    --scroll-thumb: #e3e4e6;
  }
}

@media (prefers-color-scheme: dark) {
  .rooms {
    --color: #9fa4aa;
    --background: #191922;

    --add-btn: #3f9bff;
    --create-btn: #2fa955;
    --download-btn: #2d8dd6;

    --scroll-track: #1b1c21;
    --scroll-thumb: #25262b;
  }
}

.rooms {
  gap: 0.25rem;
  color: var(--color);
  height: 100%;
  display: flex;
  min-width: 13.5rem;
  flex-basis: 30%;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--background);
  flex-direction: column;
}

.rooms::-webkit-scrollbar-track {
  background: var(--scroll-track);
}
.rooms::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb);
}

@media screen and (max-width: 42em) {
  .rooms {
    min-width: 100%;
  }
}
</style>