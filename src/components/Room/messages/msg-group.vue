<template>
  <div class="m-group" :class="{ my: isMy }">
    <MAvatar v-if="!isMy" :id="from" />

    <div class="messages" :class="{ my: isMy }">
      <transition-group name="fade-message">
        <Message :key="i" v-for="(message, i) in messages" v-bind="message" />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MAvatar from "./msg-avatar.vue";
import Message from "./msg.vue";

export default defineComponent({
  props: {
    from: { type: String, required: true },
    messages: { type: Array, required: true },
  },

  components: { MAvatar, Message },

  computed: {
    isMy() {
      return this.from == this.$firebase.auth.state.uid;
    },
  },
});
</script>

<style scoped>
.m-group {
  gap: 0.4rem;
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: start;
}
.m-group.my {
  justify-content: end;
}

.messages {
  width: calc(100% - 2.4rem);
  display: flex;
  flex-direction: column;
}
.messages.my {
  align-items: end;
}

.fade-message-enter-active.my {
  animation: my-message 0.5s ease-out;
}
.fade-message-leave-active.my {
  animation: my-message 0.5s ease-out reverse;
}

@keyframes my-message {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(0);
  }
}

.fade-message-enter-active:not(.my) {
  animation: message 0.5s ease-out;
}
.fade-message-leave-active:not(.my) {
  animation: message 0.5s ease-out reverse;
}

@keyframes message {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(25%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>