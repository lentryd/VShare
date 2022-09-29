<template>
  <Dialog
    v-model="value"
    title="Изменить имя"
    permanent
    description="Введенное вами имя будет видно другим пользователям."
  >
    <template v-slot:body>
      <Field v-model="newName" v-focus outlined />
    </template>

    <template v-slot:actions>
      <Btn @click="value = false" label="Отмена" />

      <Btn
        filled
        label="Продолжить"
        @click="update"
        :loading="loading"
        :disabled="!newName.length"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import Dialog from "@/components/ui/dialog.vue";

export default defineComponent({
  name: "Update Name",

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    newName: "",
    loading: false,
  }),

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(v: boolean) {
        this.$emit("update:modelValue", v);
      },
    },
  },

  watch: {
    value(v) {
      if (v) this.newName = this.$fb.users.state.name;
    },
  },

  methods: {
    update() {
      this.loading = true;
      this.$fb.users
        .setName(this.newName.trim())
        .then(() => (this.value = false))
        .catch((e) => console.error(e))
        .finally(() => (this.loading = false));
    },
  },
});
</script>
