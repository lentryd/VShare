<template>
  <div @click="open" class="item-container" :class="{ loading }">
    <div class="avatar">
      <div v-if="loading" class="skeleton img" />
      <img v-else :src="avatarUrl" draggable="false" />
    </div>

    <div class="info">
      <div v-if="loading" class="skeleton label" />
      <span v-else class="title-medium" v-text="bubble?.description" />

      <div class="extra">
        <div v-if="loading" class="skeleton text" />
        <span v-else class="body-small" v-text="filesCount" />

        <div v-if="loading" class="skeleton text" />
        <span
          v-else
          class="body-small"
          v-text="formatDate(bubble?.timestamp ?? new Date())"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Bubble } from "@/plugins/firebase/bubbles";
import { formatDate } from "@/composables/formats";

export default defineComponent({
  name: "History Item",

  props: {
    id: { type: String, required: true },
  },

  data: () => ({
    bubble: undefined as undefined | Bubble,
    avatarId: 0,
    loadingInfo: true,
    loadingAvatar: true,
  }),

  computed: {
    loading() {
      return this.loadingInfo || this.loadingAvatar;
    },
    avatarUrl() {
      return "/img/avatars/" + this.avatarId + ".png";
    },

    files() {
      const result = this.bubble?.files ?? [];
      this.$idb.files.state
        .filter((f) => f.bubbleId == this.id)
        .map((f) => f.id)
        .forEach((id) => {
          if (!result.includes(id)) result.push(id);
        });
      return result;
    },
    filesCount() {
      const n = this.files.length;
      const l = n % 10;
      const l1 = ((n - (n % 10)) / 10) % 10;
      let result = n + " ";

      if (l1 != 1 && l == 1) result += "файл";
      else if (l1 != 1 && l >= 2 && l <= 4) result += "файла";
      else result += "файлов";

      return result;
    },
  },

  watch: {
    id() {
      this.init();
    },
    bubble() {
      this.initAvatar();
    },
  },

  methods: {
    formatDate,

    open() {
      this.$router.push({ name: "History", params: { id: this.id } });
    },

    init() {
      this.loadingInfo = true;
      this.$fb.bubbles
        .get(this.id)
        .then((val) => (this.bubble = val))
        .catch(() => this.init())
        .finally(() => (this.loadingInfo = false));
    },
    initAvatar() {
      if (!this.bubble) return;

      this.loadingAvatar = true;
      this.$fb.users
        .getUser(this.bubble.creator)
        .then((val) => (this.avatarId = val?.avatar ?? 0))
        .catch(() => this.initAvatar())
        .finally(() => (this.loadingAvatar = false));
    },
  },

  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.item-container {
  gap: 16px;
  cursor: pointer;
  display: flex;
  padding: 14px 16px;
  user-select: none;
  align-items: center;
  flex-direction: row;
  transition: background 250ms ease-in-out;
  -webkit-tap-highlight-color: transparent;

  @media screen and (min-width: 640px) {
    width: 350px - 32px;
    border-radius: 12px;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-surface-light;
      background: lighten($md-sys-color-surface-light, 5%);
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-surface-dark;
      background: lighten($md-sys-color-surface-dark, 5%);
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
        0px 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

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
}

.avatar {
  display: flex;
  position: relative;

  > img {
    width: 60px;
    height: 60px;
    user-select: none;
  }
}

.info {
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .extra {
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
}

.skeleton {
  opacity: 0.7;
  animation: skeleton-loading 1s linear infinite alternate;

  &.img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  &.text {
    width: 30%;
    height: 16px;
    margin-top: 4px;
    border-radius: 5px;
  }

  &.label {
    width: 90%;
    height: 20px;
    border-radius: 5px;
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
