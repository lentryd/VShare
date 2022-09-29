<template>
  <component
    :is="component"
    title="Восстановить пароль"
    description='Если учетная запись существует, вы получите письмо с инструкциями по восстановлению пароля. Если письма нет, проверьте папку "Спам".'
  >
    <template v-slot:body>
      <form>
        <Field
          type="email"
          label="Email"
          v-model="email"
          autocomplete="email"
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

      <Btn label="Восстановить" filled @click="onclick" :loading="loading" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    email: "",
    loading: false,
  }),

  computed: {
    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },
  },

  methods: {
    onclick() {
      if (!this.email) return;
      this.loading = true;

      this.$fb.auth
        .resetPassword(this.email)
        .then(() => {
          if (window?.history.state?.back == "/profile") this.$router.back();
          else this.$router.replace("/profile");

          this.$device.toast("Письмо успешно отправлено вам на почту.")
        })
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style lang="scss" scoped>
.reset-password {
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
</style>
