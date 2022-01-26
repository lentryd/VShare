<template>
  <Rooms />

  <Room v-show="roomExists" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Room from "@/components/Room";
import Rooms from "@/components/RoomsList";

export default defineComponent({
  components: { Room, Rooms },

  computed: {
    roomId() {
      return this.$firebase.room.data.id;
    },
    roomExists() {
      return this.$firebase.room.data.isExist;
    },
    roomMessages() {
      return this.$firebase.room.messages;
    },
  },

  watch: {
    "$route.params.roomId"(value, oldValue) {
      if (value?.join?.("") !== oldValue?.join?.("")) this.selectRoom();
    },
  },

  methods: {
    selectRoom() {
      this.$firebase.room.selectRoom(
        this.$route.params.roomId?.toString() || "none"
      );
    },
  },

  beforeMount() {
    console.log("ggg");
    this.selectRoom();
  },
});
</script>

<style scoped>
.rooms {
  border-radius: 0.4rem;
}
</style>