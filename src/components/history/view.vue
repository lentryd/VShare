<template>
  <Popup v-model="show">
    <template v-slot:body>
      <div v-if="bubble || loading" class="author">
        <div class="avatar">
          <div v-if="loading" class="skeleton img" />
          <img v-else :src="avatarUrl" draggable="false" />
        </div>

        <div class="info">
          <div v-if="loading" class="skeleton author" />
          <span v-else class="title-large" v-text="creator?.name" />

          <div v-if="loading" class="skeleton label" />
          <span v-else class="title-medium" v-html="description" />

          <div class="extra">
            <div v-if="loading" class="skeleton text" />
            <span v-else class="body-medium" v-text="filesCount" />

            <div v-if="loading" class="skeleton text" />
            <span
              v-else
              class="body-medium"
              v-text="formatDate(bubble?.timestamp ?? new Date())"
            />
          </div>
        </div>
      </div>
      <div v-else class="error">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <g>
            <path
              d="M162.046,126.119a8.016,8.016,0,0,0,11.337,0l10.8-10.8,10.8,10.8a8.016,8.016,0,0,0,11.337-11.336l-10.8-10.8,10.8-10.8A8.016,8.016,0,1,0,194.978,81.85l-10.8,10.8-10.8-10.8a8.016,8.016,0,1,0-11.337,11.337l10.8,10.8-10.8,10.8A8.016,8.016,0,0,0,162.046,126.119Z"
            />
            <path
              d="M305.685,126.119a8.016,8.016,0,0,0,11.337,0l10.8-10.8,10.8,10.8a8.016,8.016,0,0,0,11.337-11.336l-10.8-10.8,10.8-10.8A8.016,8.016,0,1,0,338.617,81.85l-10.8,10.8-10.8-10.8a8.016,8.016,0,1,0-11.337,11.337l10.8,10.8-10.8,10.8A8.016,8.016,0,0,0,305.685,126.119Z"
            />
            <path
              d="M149.908,201.565,169.5,187.917a9.242,9.242,0,0,1,10.519,0L199.6,201.566a25.332,25.332,0,0,0,28.846,0l19.588-13.648a9.235,9.235,0,0,1,10.518,0l19.59,13.648a25.334,25.334,0,0,0,28.845,0l19.589-13.649a9.235,9.235,0,0,1,10.518,0l24.994,17.413a8.015,8.015,0,0,0,9.164-13.153l-24.994-17.414a25.325,25.325,0,0,0-28.846,0l-19.588,13.648a9.235,9.235,0,0,1-10.519,0L267.72,174.764a25.324,25.324,0,0,0-28.846,0l-19.587,13.647a9.24,9.24,0,0,1-10.52,0l-19.588-13.648a25.324,25.324,0,0,0-28.847,0l-19.588,13.648a8.015,8.015,0,0,0,9.164,13.153Z"
            />
            <path
              d="M512,193.482V193.4c0-.088-.01-.174-.013-.261a8,8,0,0,0-3.456-6.922L458.9,152.036V28.155A28.191,28.191,0,0,0,430.732,0H81.268A28.191,28.191,0,0,0,53.1,28.155V152.036L3.469,186.22a8,8,0,0,0-3.456,6.922c0,.087-.013.173-.013.261V474.887A37.163,37.163,0,0,0,37.127,512H474.873A37.163,37.163,0,0,0,512,474.887V193.482Zm-21.6-.285-31.5,21.695V171.5ZM81.268,16.031H430.732a12.142,12.142,0,0,1,12.133,12.124V223.116a8,8,0,0,0,.414,2.532L289.356,331.658a59.134,59.134,0,0,1-66.712,0L69.135,225.933V28.155A12.142,12.142,0,0,1,81.268,16.031ZM53.1,214.892,21.6,193.2,53.1,171.5ZM37.127,495.969a21.085,21.085,0,0,1-4.387-.466L154.865,357.777a8.015,8.015,0,0,0-11.994-10.636L19.441,486.34a20.934,20.934,0,0,1-3.41-11.453V208.826L213.55,344.861a75.253,75.253,0,0,0,84.9,0L495.969,208.826V474.887a20.934,20.934,0,0,1-3.41,11.453l-123.43-139.2a8.015,8.015,0,1,0-11.994,10.636L479.26,495.5a21.085,21.085,0,0,1-4.387.466Z"
            />
          </g>
        </svg>

        <span class="title-medium">
          Ничего не удалось найти. <br />Возможно, код был введен неправильно
          или файлы были удалены.
        </span>
      </div>

      <Banner
        v-if="!loading && bubble?.isLoading"
        :text="`${creator?.name} все еще загружает файлы.`"
      />

      <div class="files">
        <Item :id="f" v-for="f in files" />
      </div>
    </template>

    <template v-slot:actions>
      <Btn
        v-if="bubble"
        :to="{ query: { share: null } }"
        label="Поделиться"
        filled
      />

      <Btn v-if="!bubble && !loading" @click="show = false" label="Закрыть" />
      <Btn
        v-if="!bubble && !loading"
        :to="{ name: 'App', query: { receive: null }, replace: true }"
        label="Повторить"
        filled
      />
    </template>
  </Popup>

  <QrCode :id="bubble?.shortId" />
</template>

<script lang="ts">
import Item from "./file-item.vue";
import QrCode from "./qr-code.vue";
import { User } from "@/plugins/firebase/users";
import { Bubble } from "@/plugins/firebase/bubbles";
import { formatDate } from "@/composables/formats";
import { defineComponent } from "vue";

const ROUTES = ["/b/", "/h/", "/f/", "/history/"];
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const TAGS2REPLACE = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

export default defineComponent({
  name: "History Viewer",

  components: { Item, QrCode },

  data: () => ({
    bubble: undefined as undefined | Bubble,
    creator: undefined as undefined | User,
    loadingBubble: true,
    loadingCreator: false,
  }),

  computed: {
    id() {
      const id = this.$route.params.id;
      return typeof id === "string" ? id : id?.[0];
    },
    show: {
      get() {
        return !!this.id;
      },

      set(val: boolean) {
        if (val) {
          this.$router.push({ name: "History", params: { id: this.id } });
        } else if (ROUTES.includes(window?.history.state?.back)) {
          this.$router.back();
        } else {
          this.$router.replace({ name: "History" });
        }
      },
    },
    loading() {
      return this.loadingBubble || this.loadingCreator;
    },

    files() {
      if (!this.id) return [];

      const result = this.bubble?.files ?? [];
      this.$idb.files.state
        .filter((f) => f.bubbleId == this.id)
        .map((f) => f.id)
        .forEach((id) => {
          if (!result.includes(id)) result.push(id);
        });
      return result;
    },
    avatarUrl() {
      return "/img/avatars/" + (this.creator?.avatar ?? 0) + ".png";
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
    description() {
      const desc = this.bubble?.description ?? "";
      return desc
        .replace(/[&<>]/g, (tag) =>
          !(tag in TAGS2REPLACE)
            ? tag
            : TAGS2REPLACE[tag as keyof typeof TAGS2REPLACE]
        )
        .replace(URL_REGEX, (url) => {
          return `<a href="${url}" target="_blank">${url}</a>`;
        });
    },
  },

  watch: {
    id(v) {
      if (v) this.init();
      else this.bubble = undefined;
    },
    bubble(v) {
      if (v) this.initCreator();
      else this.creator = undefined;
    },
  },

  methods: {
    formatDate,

    init() {
      if (!this.id) return;
      this.loadingBubble = true;
      this.$fb.bubbles
        .get(this.id)
        .then((val) => (this.bubble = val))
        .catch(() => this.init())
        .finally(() => (this.loadingBubble = false));
    },
    initCreator() {
      if (!this.bubble) return;

      this.loadingCreator = true;
      this.$fb.users
        .getUser(this.bubble.creator)
        .then((val) => (this.creator = val))
        .catch(() => this.initCreator())
        .finally(() => (this.loadingCreator = false));
    },
  },

  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.author {
  gap: 16px;
  display: flex;
  align-items: center;
  flex-direction: row;

  .avatar {
    display: flex;
    position: relative;

    > img {
      width: 100px;
      height: 100px;
      user-select: none;
    }
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;

    .extra {
      gap: 8px;
      display: flex;
      margin-top: 4px;
      align-items: center;
      flex-direction: row;
    }
  }
}

.error {
  gap: 16px;
  display: flex;
  align-items: center;
  flex-direction: column;

  svg {
    width: 140px;

    * {
      @media (prefers-color-scheme: light) {
        fill: $md-sys-color-on-surface-light;
      }
      @media (prefers-color-scheme: dark) {
        fill: $md-sys-color-on-surface-dark;
      }
    }
  }

  span {
    text-align: center;
  }
}

.files {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.skeleton {
  opacity: 0.7;
  animation: skeleton-loading 1s linear infinite alternate;

  &.img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  &.text {
    width: 100px;
    height: 18px;
    border-radius: 5px;
  }

  &.label {
    width: 80%;
    height: 20px;
    border-radius: 5px;
    margin-bottom: 4px;
  }

  &.author {
    width: 180px;
    height: 22px;
    margin-bottom: 6px;
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
