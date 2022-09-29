<template>
  <component :is="component" title="Регистрация">
    <template v-slot:body>
      <form>
        <Google />

        <span class="caption">или</span>

        <Field
          type="email"
          label="Email"
          v-model="email"
          autocomplete="email"
        />

        <Field
          type="password"
          label="Пароль"
          v-model="password"
          autocomplete="new-password"
        />
      </form>
    </template>

    <template v-slot:actions>
      <Btn
        :to="{ query: { signIn: null } }"
        label="Войти в аккаунт"
        style="margin-right: auto"
        replace
      />

      <Btn label="Создать" filled @click="onclick" :loading="loading" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Google from "./google.vue";

export default defineComponent({
  components: { Google },

  data: () => ({
    email: "",
    password: "",
    loading: false,
  }),

  computed: {
    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },
  },

  methods: {
    onclick() {
      if (!this.email || !this.password) return;
      this.loading = true;
      this.$fb.auth
        .signUp(this.email, this.password)
        .then(() => {
          if (window?.history.state?.back == "/profile") this.$router.back();
          else this.$router.replace("/profile");
        })
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss" scoped>
form {
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
