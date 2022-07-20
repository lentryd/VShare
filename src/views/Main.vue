<template>
  <TopAppBar title="VShare" scrollEl="#app .content">
    <template v-slot:actions>
      <TopAppBarItem @click="supportBtn" icon="&#xea70;" iconRound />
    </template>
  </TopAppBar>

  <Component :is="component">
    <template v-slot:sent> <Send /> </template>
    <template v-slot:receive> <Receive /> </template>
  </Component>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { Send, Receive } from "@/components/main";
import TopAppBar, { Item as TopAppBarItem } from "@/components/ui/top-app-bar";

export default defineComponent({
  name: "Main View",

  components: {
    Send,
    Receive,
    TopAppBar,
    TopAppBarItem,
    Mobile: defineAsyncComponent(() => import("@/layouts/main/mobile.vue")),
    Desktop: defineAsyncComponent(() => import("@/layouts/main/desktop.vue")),
  },

  computed: {
    component() {
      return this.$device.isMobile ? "Mobile" : "Desktop";
    },
  },

  methods: {
    supportBtn() {
      window.open("https://pay.cloudtips.ru/p/55f81819", "_blank");
    },
  },
});
</script>
