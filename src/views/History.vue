<template>
  <TopAppBar title="История" scrollEl="#app .content" />

  <div class="history">
    <Item :id="b" v-for="b in bubbles" />
  </div>

  <View />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "@/components/history/item.vue";
import View from "@/components/history/view.vue";

export default defineComponent({
  name: "History View",

  components: { Item, View },

  computed: {
    bubbles() {
      return this.$fb.users.state.bubbles;
    },
  },
});
</script>

<style lang="scss">
.history {
  width: calc(100% - 4px);
  margin: 0 auto;
  padding: 2px;
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: 640px) {
    gap: 24px;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row-reverse;
    justify-content: center;
  }
}
</style>
