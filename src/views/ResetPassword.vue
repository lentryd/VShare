<template>
  <Bar title="Восстановление" />

  <div class="reset-password">
    <span v-if="send" class="body-medium">
      Если учетная запись для <b>{{ email }}</b> существует, вы получите письмо
      с инструкциями по восстановлению пароля. Если письма нет, проверьте папку
      "Спам".
    </span>

    <Field
      v-if="!send"
      type="email"
      label="Email"
      v-model="email"
      autocomplete="email"
    />

    <Btn
      v-if="!send"
      label="Восстановить"
      @click="onclick"
      :loading="loading"
      filled
    />

    <Btn :to="{ name: 'SignIn' }" replace label="Войти в аккаунт" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";
import Field from "@/components/ui/field.vue";
import { Bar } from "@/components/login";

export default defineComponent({
  components: { Btn, Field, Bar },

  data: () => ({
    send: false,
    email: "",
    loading: false,
  }),

  methods: {
    onclick() {
      if (!this.email) return;
      this.loading = true;
      this.$auth
        .resetPassword(this.email)
        .then(() => (this.send = true))
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
