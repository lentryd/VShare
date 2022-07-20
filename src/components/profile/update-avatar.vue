<template>
  <Popup v-model="value">
    <div class="select-avatar">
      <span class="title-large">Выберите аватар</span>

      <div class="content">
        <div
          :class="{ selected: newAvatar == i }"
          @click="newAvatar = i"
          v-for="(_, i) in new Array(13)"
        >
          <img :src="'/img/avatars/' + i + '.png'" />
          <span class="material-icons-round">&#xe5ca;</span>
        </div>
      </div>

      <Btn label="Выбрать" filled @click="update" :loading="loading" />
    </div>
  </Popup>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Popup from "@/components/ui/popup.vue";

export default defineComponent({
  name: "Update Name",

  components: { Btn, Popup },

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
  },

  watch: {
    value(v) {
      if (v) this.newAvatar = this.$users.me.avatar;
    },
  },

  methods: {
    update() {
      this.loading = true;
      this.$users
        .setAvatar(this.newAvatar)
        .then(() => (this.value = false))
        .catch((e) => console.error(e))
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss">
.select-avatar {
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .content {
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
}
</style>
