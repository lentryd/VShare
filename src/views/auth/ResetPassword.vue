<template>
  <h1>Восстановление пароля</h1>

  <div v-if="!isSend" class="group">
    <Inp
      block
      outline
      v-model="email"
      placeholder="Email"
      autocomplete="email"
    />

    <Btn block @click="sendEmail" color="#ffffff" background="#000000">
      Восстановить
    </Btn>
  </div>

  <div v-else class="group">
    <p>
      Если учетная запись для <strong>{{ email }}</strong> существует, вы
      получите электронное письмо с инструкциями по восстановлению пароля. Если
      письма нет, проверьте папку "Спам".
    </p>
  </div>

  <router-link to="/auth/signIn">
    Вспомнил пароль? <span>Войти.</span>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/UI/btn.vue";
import Inp from "@/components/UI/input.vue";

export default defineComponent({
  components: { Btn, Inp },

  data: () => ({
    email: "",
    isSend: false,
  }),

  methods: {
    sendEmail() {
      if (!this.email) return;
      this.isSend = true;

      this.$firebase.auth.resetPassword(this.email);
    },
  },
});
</script>
