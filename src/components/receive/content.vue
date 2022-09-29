<template>
  <component
    :is="component"
    title="Получить"
    permanent
    description="Для получения доступа введите восьми значный код."
    v-model="show"
  >
    <template v-slot:body>
      <Field label="Код файла" v-focus v-model="code" autocomplete="off" />
    </template>

    <template v-slot:actions>
      <Btn
        label="Сканировать"
        style="margin-right: auto"
        @click="scan = true"
      />

      <Btn v-if="$device.isDesktop" @click="show = false" label="Отмена" />

      <Btn
        label="Продолжить"
        filled
        @click="send"
        :loading="loading"
        :disabled="!canContinue"
      />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReceiveContent",

  props: {
    showScan: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue", "update:showScan"],

  data: () => ({
    code: "",
    loading: false,
  }),

  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit("update:modelValue", value);
      },
    },
    scan: {
      get() {
        return this.showScan;
      },
      set(value: boolean) {
        this.$emit("update:showScan", value);
      },
    },

    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },

    canContinue() {
      return this.code.length == 8;
    },
  },

  watch: {
    show(val) {
      if (val) return;
      this.code = "";
      this.loading = false;
    },
  },

  methods: {
    send() {
      this.loading = true;
      this.$router.push("/b/" + this.code);
    },
  },
});
</script>
