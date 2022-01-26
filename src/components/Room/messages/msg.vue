<template>
  <div :id="id" class="message" :class="{ my: isMy }">
    <span v-if="!isMy" class="name" v-text="fromName" />

    <span v-if="type == 'message'" class="text" v-text="text" />
    <MFile
      v-else
      v-bind="{
        name,
        size,
        roomId,
        fileId,
        cancel,
        isPending,
        transferredSize,
      }"
    />

    <div class="time">
      <span v-text="parseTime()" />

      <transition name="fade-time">
        <svg
          v-if="isPending"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 600 600"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
        >
          <g transform="matrix(1 0 0 1 19.991013 -20.019775)">
            <ellipse
              rx="180"
              ry="180"
              fill="none"
              transform="matrix(1 0 0 1 280.008982 320.019785)"
            />
            <g
              id="time-arrow"
              transform="translate(280.008987,320.019785) rotate(0)"
            >
              <path
                d="M265.150298,229.743893L265.150298,89.743893"
                transform="translate(-265.150304,-229.743893)"
                stroke-linecap="round"
              />
            </g>
          </g>
        </svg>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MFile from "./msg-file.vue";

export default defineComponent({
  props: {
    id: { type: String, required: true },
    from: { type: String, required: true },
    type: { type: String, required: true },
    roomId: { type: String, required: true },
    timestamp: { type: Number, required: true },
    isPending: { type: Boolean, required: true },
    // Текстовое сообщение
    text: { type: String, required: false },
    // Файл
    name: { type: String, required: false },
    size: { type: Number, required: false },
    fileId: { type: Number, required: false },
    // Отправляющийся файл
    cancel: { type: Function, required: false },
    transferredSize: { type: Number, required: false },
  },

  components: { MFile },

  computed: {
    isMy() {
      return this.from == this.$firebase.auth.state.uid;
    },

    fromName() {
      return this.$firebase.room.getMember(this.from)?.name ?? "anonymous";
    },
  },

  methods: {
    parseTime() {
      const date = new Date(this.timestamp);
      let hours: any = date.getHours();
      if (hours < 10) hours = "0" + hours;
      let minutes: any = date.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;

      return hours + ":" + minutes;
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .message {
    --color: #060607;

    --date-background: #fefefede;

    --border: #dedede;
    --background: #f1f1f1;

    --my-background: #b1ceff;
  }
}

@media (prefers-color-scheme: dark) {
  .message {
    --color: #ffffff;

    --border: #303b42;
    --background: #181922;

    --my-background: #202437;
  }
}

.message {
  width: fit-content;
  color: var(--color);
  display: flex;
  padding: 4px 6px;
  max-width: calc(90% - 12px);
  margin-top: 0.25rem;
  background: var(--background);
  box-shadow: 0 0 1px var(--border);
  border-radius: 6px;
  flex-direction: column;
}
.message:first-child {
  margin-top: 0;
}
.message.my {
  background: var(--my-background);
}

.name {
  overflow: hidden;
  font-size: 0.8rem;
  user-select: none;
  text-overflow: ellipsis;
}
.message.my .name,
.message:not(:first-child) .name {
  display: none;
}

.text {
  font-size: 0.8rem;
  white-space: break-spaces;
  overflow-wrap: break-word;
}

.time {
  opacity: 0.8;
  display: flex;
  user-select: none;
  align-items: center;
  flex-direction: row;
  justify-content: end;
}
.time span {
  font-size: 0.6rem;
}
.time svg {
  fill: var(--color);
  width: 0.8rem;
  stroke: var(--color);
  stroke-width: 40px;
}

#time-arrow {
  animation: rotate 3000ms linear infinite;
}
@keyframes rotate {
  0% {
    transform: translate(280.008987px, 320.019785px) rotate(0deg);
  }
  100% {
    transform: translate(280.008987px, 320.019785px) rotate(360deg);
  }
}

.fade-time-enter-active,
.fade-time-leave-active {
  transition: width 0.25s ease-out;
}

.fade-time-enter-from,
.fade-time-leave-to {
  width: 0 !important;
}
</style>