<template>
  <div v-if="show" @click="onClick" class="link-preview">
    <span v-if="title" v-text="title" class="body-medium" />
    <span v-if="description" v-text="description" class="body-small" />
    <img v-if="src" :src="src" @dragstart.prevent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Link Preview",

  props: {
    value: { type: String, default: "" },
  },

  data: () => ({
    url: undefined as undefined | string,
    src: undefined as undefined | string,
    title: undefined as undefined | string,
    description: undefined as undefined | string,
  }),

  computed: {
    show() {
      return !!this.src || !!this.title || !!this.description;
    },
  },

  watch: {
    value() {
      this.url = this.value?.match(/(https?:\/\/[^\s]+)/)?.[1];
    },
    url() {
      this.init();
    },
  },

  methods: {
    async init() {
      this.src = undefined;
      this.title = undefined;
      this.description = undefined;
      if (!this.url) return;

      const result = await fetch(
        process.env.VUE_APP_LINK_PREVIEW + "?q=" + encodeURIComponent(this.url)
      ).then((res) => res.json());

      if ("title" in result) this.title = result.title;
      if ("images" in result) this.src = result.images[0];
      if ("description" in result) this.description = result.description;
      if (result.mediaType == "image") this.src = result.url;
    },

    onClick() {
      if (!this.url) return;
      window.open(this.url, "_blank");
    },
  },

  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.link-preview {
  cursor: pointer;
  display: flex;
  padding: 2px 8px;
  user-select: none;
  border-left: 1.5px solid;
  flex-direction: column;

  .body-medium {
    font-weight: 500;
  }

  img {
    margin: 0 auto;
    max-width: 100%;
    margin-top: 4px;
    max-height: 200px;
    border-radius: 4px;
  }
}
</style>
