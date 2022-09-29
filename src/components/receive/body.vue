<template>
  <Content v-model="show" v-model:showScan="showScanner" />
  <ScanContent v-model="showScanner" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Content from "./content.vue";
import ScanContent from "./scannerContent.vue";

export default defineComponent({
  name: "Receive",

  props: {
    modelValue: { type: Boolean, default: false },
  },

  components: { Content, ScanContent },

  emits: ["update:modelValue"],

  data: () => ({
    showScanner: false,
  }),

  computed: {
    show: {
      get() {
        return this.modelValue && !this.showScanner;
      },
      set(value: boolean) {
        if (this.showScanner) return;
        this.$emit("update:modelValue", value);
      },
    },
  },
});
</script>
