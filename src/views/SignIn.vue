<template>
  <Bar title="Авторизация" />

  <div class="sign-in">
    <Google />

    <span class="caption">или</span>

    <Field type="email" label="Email" v-model="email" autocomplete="email" />

    <Field
      type="password"
      label="Пароль"
      v-model="password"
      autocomplete="password"
    />

    <Btn label="Войти" filled @click="onclick" :loading="loading" />

    <div class="btn-group">
      <Btn :to="{ name: 'SignUp' }" replace label="Создать аккаунт" />

      <Btn :to="{ name: 'ResetPassword' }" replace label="Забыли пароль?" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import { Bar, Google } from "@/components/login";

export default defineComponent({
  components: { Btn, Field, Bar, Google },

  data: () => ({
    email: "",
    password: "",
    loading: false,
  }),

  methods: {
    onclick() {
      if (!this.email || !this.password) return;
      this.loading = true;
      this.$auth
        .signIn(this.email, this.password)
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss" scoped>
.sign-in {
  gap: 12px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    width: 50%;
    margin: auto;
    max-width: 560px;
  }
}

.btn-group {
  gap: 16px;
  display: flex;
  flex-direction: row;
}
</style>
