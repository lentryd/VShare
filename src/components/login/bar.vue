<template>
  <TopAppBar :title="title" scrollEl="#app .content">
    <template v-slot:navigation>
      <TopAppBarItem @click="goBack" icon="&#xe5c4;" iconRound />
    </template>
  </TopAppBar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopAppBar, { Item as TopAppBarItem } from "@/components/ui/top-app-bar";

export default defineComponent({
  name: "Login Bar",

  components: { TopAppBar, TopAppBarItem },

  props: {
    title: { type: String, required: true },
  },

  methods: {
    goBack() {
      if (window?.history.state?.back) this.$router.back();
      else this.$router.replace("/profile");
    },
  },
});
</script>
