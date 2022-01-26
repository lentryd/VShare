<template>
  <div class="container">
    <Scan v-if="!userId" @goBack="goBack" @setUserId="(id) => (userId = id)" />
    <SelectRoom
      v-else-if="!roomId"
      @goBack="goBack"
      @setRoom="(id) => (roomId = id)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Scan from "@/components/AddUser/Scan.vue";
import SelectRoom from "@/components/AddUser/SelectRoom.vue";

export default defineComponent({
  components: { Scan, SelectRoom },

  data: () => ({
    userId: null as null | string,
    roomId: null as null | string,
  }),

  watch: {
    userId() {
      this.addUser();
    },
    roomId() {
      this.addUser();
    },
  },

  methods: {
    goBack() {
      window.history?.state.back?.startsWith("/app/rooms")
        ? this.$router.back()
        : this.$router.replace("/app/rooms/");
    },
    addUser() {
      if (!this.userId || !this.roomId) return;

      this.$firebase.addMember(this.roomId, this.userId);
      this.$router.replace("/app/rooms/" + this.roomId);
    },
  },

  beforeMount() {
    const { userId, roomId } = this.$route.params;
    if (userId?.[0]) this.userId = userId[0];
    if (roomId?.[0]) this.roomId = roomId[0];
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
</style>