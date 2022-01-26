<template>
  <div class="avatar">
    <img v-if="avatar" :src="avatar" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: { type: String, required: true },
  },

  computed: {
    avatar() {
      return this.$firebase.room.getMember(this.id)?.photo;
    },
  },
});
</script>

<style scoped>
.avatar {
  width: 2rem;
  bottom: 0;
  height: 2rem;
  display: flex;
  position: sticky;
  overflow: hidden;
  background: #6f9ceb;
  user-select: none;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
}
.avatar img {
  width: 100%;
}
.avatar svg {
  fill: white;
  width: 80%;
}
</style>