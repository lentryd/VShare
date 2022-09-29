<template>
  <component
    :is="component"
    title="Отправить"
    permanent
    description="Не загружайте никакой конфиденциальный информации."
    v-model="show"
  >
    <template v-slot:body>
      <Content ref="content" v-model:text="text" v-model:files="files" />
    </template>

    <template v-slot:actions>
      <Btn label="Добавить файлы" style="margin-right: auto" @click="addFile" />

      <Btn v-if="$device.isDesktop" @click="show = false" label="Отмена" />

      <Btn
        label="Продолжить"
        @click="send"
        filled
        :loading="loading"
        :disabled="!canContinue"
      />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Content from "./content.vue";

export default defineComponent({
  name: "Send",

  components: { Content },

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    text: "",
    files: [] as File[],
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

    description() {
      return (
        this.text ||
        `${this.$fb.users.state.name} хочет поделиться с вами файлами!`
      );
    },

    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },

    canContinue() {
      return this.text.length > 0 || this.files.length > 0;
    },
  },

  watch: {
    show(val) {
      if (val) return;
      this.text = "";
      this.files = [];
    },
  },

  methods: {
    addFile() {
      (this.$refs.content as any)?.addFile();
    },

    async send() {
      this.loading = true;
      const bId = await this.$fb.bubbles
        .add(this.description, this.files.length > 0)
        .catch(() => undefined);
      if (!bId) {
        this.loading = false;
        this.$device.toast("Что-то пошло не так. Попробуйте еще раз позже.");
        return;
      }

      this.files.forEach(async (f) => {
        this.$idb.files.write(
          await this.$idb.files.formateFile(
            f,
            bId,
            bId,
            this.$fb.users.state.id
          )
        );
      });
      this.$router.replace({
        name: "History",
        params: { id: bId },
      });
    },
  },
});
</script>
