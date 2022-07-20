<template>
  <div
    @click="openChat"
    @keypress.enter="openChat"
    class="history-item"
    :class="{ open, loading }"
    :tabindex="loading ? '-1' : '0'"
  >
    <div class="avatar">
      <div v-if="loading" class="skeleton img" />
      <img v-else :src="chatInfo?.avatarUrl" />

      <span class="material-icons-round">&#xe876;</span>
    </div>

    <div class="info">
      <div>
        <div v-if="loading" class="skeleton label" />
        <span v-else class="title-medium" v-text="chatInfo?.name" />

        <div v-if="loading" class="skeleton badge" />
        <span
          v-else
          :class="badgeClass"
          class="badge body-small"
          v-text="chatInfo?.saved ? 'Сохранено' : countdownString"
        />
      </div>
      <div v-if="loading" class="skeleton text" />
      <span v-else class="body-small" v-text="dateString" />
    </div>
  </div>
</template>

<script lang="ts">
import { toRef, defineComponent } from "vue";
import useChatInfo from "@/composables/useChatInfo";

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
function num2str(num: number) {
  if (num < 10) return "0" + num;
  else return num.toString();
}

export default defineComponent({
  name: "History Item",

  props: {
    id: { type: String, required: true },
  },

  setup(props) {
    return useChatInfo(toRef(props, "id"), true);
  },

  computed: {
    open() {
      return this.id == this.$route.params.id;
    },

    timestamp() {
      return this.chatInfo?.timestamp ?? new Date();
    },

    countdown() {
      const days = 10 - ~~((Date.now() - +this.timestamp) / 8.64e7);
      return days;
    },
    countdownString() {
      const days = this.countdown;
      if (days <= 0) return "Скоро удалится";

      let str = days > 1 ? "Осталось " : "Остался ";
      str += days + " ";

      if (days % 10 == 1) str += "день";
      else if (days % 10 >= 2 && days % 10 < 5) str += "дня";
      else str += "дней";

      return str;
    },

    badgeClass() {
      return this.chatInfo?.saved
        ? "saved"
        : this.countdown <= 3
        ? "warning"
        : "";
    },

    dateString() {
      let dateStr = "";
      const date = this.timestamp;
      if (this.countdown == 10) dateStr += "Сегодня";
      else if (this.countdown == 9) dateStr += "Вчера";
      else {
        dateStr += date.getDate() + " " + months[date.getMonth()];
        if (new Date().getFullYear() != date.getFullYear())
          dateStr += " " + date.getFullYear();
      }

      let timeStr = num2str(date.getHours()) + ":" + num2str(date.getMinutes());

      return dateStr + " " + timeStr;
    },
  },

  methods: {
    openChat() {
      if (this.loading) return;
      this.$router.push("/history/" + this.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.history-item {
  gap: 16px;
  cursor: pointer;
  display: flex;
  padding: 14px 16px;
  user-select: none;
  align-items: center;
  flex-direction: row;
  transition: background 250ms ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &.loading {
    cursor: progress;
  }

  &:not(.open):not(.loading):hover {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-tertiary-container-light, 30%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-tertiary-container-dark, 15%);
    }
  }
  &:not(.loading).open,
  &:not(.loading):focus,
  &:not(.loading):active {
    @media (prefers-color-scheme: light) {
      background: rgb($md-sys-color-tertiary-container-light, 60%);
    }
    @media (prefers-color-scheme: dark) {
      background: rgb($md-sys-color-tertiary-container-dark, 30%);
    }
  }

  @media screen and (min-width: 768px) {
    margin: 0 16px;
    margin-bottom: 4px;
    border-radius: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.avatar {
  display: flex;
  position: relative;

  > img {
    width: 48px;
    height: 48px;
  }

  > span {
    right: 0;
    bottom: 0;
    padding: 1px;
    position: absolute;
    font-size: 16px;
    transition: transform 250ms ease-in-out;
    border-radius: 50%;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-primary-container-light;
      background: $md-sys-color-primary-container-light;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-primary-container-dark;
      background: $md-sys-color-primary-container-dark;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
    }
  }
  > span:not(.selected) {
    transform: scale(0);
  }
}

.info {
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  > div {
    gap: 8px;
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;
    flex-direction: row;
  }

  .title-medium {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .badge {
    padding: 2px 8px;
    flex-shrink: 0;
    border-radius: 16px;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
      background: rgb($md-sys-color-on-surface-light, 12%);
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
      background: rgb($md-sys-color-on-surface-dark, 12%);
    }

    &.saved {
      @media (prefers-color-scheme: light) {
        color: $md-sys-color-on-primary-container-light;
        background: $md-sys-color-primary-container-light;
      }
      @media (prefers-color-scheme: dark) {
        color: $md-sys-color-on-primary-container-dark;
        background: $md-sys-color-primary-container-dark;
      }
    }
    &.warning {
      @media (prefers-color-scheme: light) {
        color: $md-sys-color-on-error-container-light;
        background: $md-sys-color-error-container-light;
      }
      @media (prefers-color-scheme: dark) {
        color: $md-sys-color-on-error-container-dark;
        background: $md-sys-color-error-container-dark;
      }
    }
  }
}

.skeleton {
  opacity: 0.7;
  animation: skeleton-loading 1s linear infinite alternate;

  &.img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  &.text {
    width: min(45%, 150px);
    height: 16px;
    margin-top: 4px;
    border-radius: 5px;
  }

  &.label {
    width: min(100%, 200px);
    height: 20px;
    border-radius: 5px;
  }

  &.badge {
    width: 80px;
    height: 20px;
    padding: 0;
    border-radius: 16px;
  }
}
@media (prefers-color-scheme: light) {
  @keyframes skeleton-loading {
    from {
      background-color: lighten($md-sys-color-on-surface-variant-light, 45%);
    }
    to {
      background-color: lighten($md-sys-color-on-surface-variant-light, 60%);
    }
  }
}
@media (prefers-color-scheme: dark) {
  @keyframes skeleton-loading {
    from {
      background-color: darken($md-sys-color-on-surface-variant-dark, 45%);
    }
    to {
      background-color: darken($md-sys-color-on-surface-variant-dark, 60%);
    }
  }
}
</style>
