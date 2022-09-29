<template>
  <component
    :is="component"
    title="Изменить аватар"
    v-model="value"
    description="Выбранный вами аватар будет виден другим пользователям."
  >
    <template v-slot:body>
      <div class="avatars">
        <div
          :class="{ selected: newAvatar == i }"
          @click="newAvatar = i"
          v-for="(_, i) in new Array(13)"
        >
          <img :src="'/img/avatars/' + i + '.png'" />
          <span class="material-icons-round">&#xe5ca;</span>
        </div>
      </div>
    </template>

    <template v-slot:actions>
      <Btn v-if="$device.isDesktop" label="Отмена" @click="value = false" />
      <Btn label="Продолжить" filled @click="update" :loading="loading" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Update Name",

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ["update:modelValue"],

  data: () => ({
    loading: false,
    newAvatar: 0,
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
    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },
  },

  watch: {
    value(v) {
      if (v) this.newAvatar = this.$fb.users.state.avatar;
    },
  },

  methods: {
    update() {
      this.loading = true;
      this.$fb.users
        .setAvatar(this.newAvatar)
        .then(() => (this.value = false))
        .catch((e) => console.error(e))
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss" scoped>
.avatars {
  gap: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  div {
    cursor: pointer;
    position: relative;

    img {
      height: 80px;
      transition: filter 200ms ease-in-out;
    }
    &.selected > img {
      filter: brightness(0.65);
    }

    span {
      top: 50%;
      left: 50%;
      color: $md-sys-color-surface-light;
      opacity: 0;
      position: absolute;
      font-size: 36px;
      transform: translate(-50%, -50%);
      transition: opacity 200ms ease-in-out;
    }
    &.selected > span {
      opacity: 1;
    }
  }
}
</style>
