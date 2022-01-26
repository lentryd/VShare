<template>
  <div class="container">
    <div>
      <h1>Введите название новой комнаты</h1>

      <Inp block outline color="unset" v-model.trim="name" />

      <div class="btn-container">
        <Btn
          block
          color="var(--color)"
          @click="goBack"
          background="var(--cancel-btn)"
        >
          Отмена
        </Btn>

        <Btn
          block
          color="var(--color)"
          @click="addRoom"
          background="var(--scan-btn)"
        >
          Готово
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Inp from "@/components/UI/input.vue";
import Btn from "@/components/UI/btn.vue";

export default defineComponent({
  components: { Inp, Btn },

  data: () => ({
    name: "",
    isLoading: false,
  }),

  methods: {
    goBack() {
      if (this.isLoading) return;
      window.history?.state.back?.startsWith("/app/rooms")
        ? this.$router.back()
        : this.$router.replace("/app/rooms/");
    },
    addRoom() {
      if (this.isLoading || !this.name) return;
      this.isLoading = true;

      this.$firebase
        .createRoom(this.name)
        .then((id) => {
          this.$router.replace("/app/rooms/" + id);
        })
        .catch(console.error)
        .finally(() => (this.isLoading = false));
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .container {
    --scan-btn: #3ba55d;
    --cancel-btn: #1771e6;
  }
}

@media (prefers-color-scheme: dark) {
  .container {
    --scan-btn: #2fa955;
    --cancel-btn: #3f9bff;
  }
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.container > div {
  gap: 1rem;
  width: 25rem;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  align-items: center;
  flex-direction: column;
}

.btn-container {
  gap: 1.5rem;
  width: 100%;
  display: flex;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}
</style>