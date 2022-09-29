<template>
  <Btn
    @click="onclick"
    label="Продолжить через Google"
    :loading="loading"
    outlined
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 510">
      <g>
        <g xmlns="http://www.w3.org/2000/svg">
          <g id="glass">
            <path
              d="M286.875,229.5v63.75h150.45c-15.3,89.25-86.7,153-175.95,153c-104.55,0-191.25-86.7-191.25-191.25    s86.7-191.25,191.25-191.25c53.55,0,99.45,22.95,132.6,58.65l45.9-45.9c-45.9-45.9-107.1-76.5-178.5-76.5    c-140.25,0-255,114.75-255,255s114.75,255,255,255s242.25-114.75,242.25-255v-25.5H286.875z"
            />
          </g>
        </g>
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
        <g xmlns="http://www.w3.org/2000/svg" />
      </g>
    </svg>
  </Btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";

export default defineComponent({
  name: "Google Button",

  components: { Btn },

  data: () => ({
    loading: false,
  }),

  methods: {
    onclick() {
      this.loading = true;
      this.$fb.auth.signInWithGoogle().finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss" scoped>
.btn.outlined {
  width: calc(100% - 48px);
  justify-content: center;
}

svg {
  width: 18px;
  height: 18px;

  @media (prefers-color-scheme: light) {
    fill: $md-sys-color-primary-light;
  }
  @media (prefers-color-scheme: dark) {
    fill: $md-sys-color-primary-dark;
  }
}
</style>
