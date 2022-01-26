<template>
  <h1>Вход в VShare</h1>

  <div class="group">
    <Btn block outline @click="signInGoogle" :isLoading="isLoading.google">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.25 9V11.5H17.15C16.55 15 13.75 17.5 10.25 17.5C6.15 17.5 2.75 14.1 2.75 10C2.75 5.9 6.15 2.5 10.25 2.5C12.35 2.5 14.15 3.4 15.45 4.8L17.25 3C15.45 1.2 13.05 0 10.25 0C4.75 0 0.25 4.5 0.25 10C0.25 15.5 4.75 20 10.25 20C15.75 20 19.75 15.5 19.75 10V9H11.25Z"
        />
      </svg>

      Войти через Google
    </Btn>
    <Btn
      block
      outline
      @click="signInAnonymous"
      :isLoading="isLoading.anonymous"
    >
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g>
          <g xmlns="http://www.w3.org/2000/svg">
            <path
              d="m8.52 29a6 6 0 1 1 6-6 6 6 0 0 1 -6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0 -4-4z"
            />
            <path
              d="m23.52 29a6 6 0 1 1 6-6 6 6 0 0 1 -6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0 -4-4z"
            />
            <path d="m13.52 22.01h5v2h-5z" />
            <circle cx="8.52" cy="23.01" r="5" />
            <circle cx="23.52" cy="23.01" r="5" />
            <rect height="2" rx="1" width="28" x="2.02" y="13.01" />
            <path
              d="m27.24 15h-22.44l2-9.75a2.8 2.8 0 0 1 2.69-2.25h13.05a2.8 2.8 0 0 1 2.74 2.25zm-20-2h17.56l-1.48-7.36a.8.8 0 0 0 -.78-.64h-13.05a.8.8 0 0 0 -.78.64z"
            />
            <path
              d="m26 14h-20l1.73-8.55a1.8 1.8 0 0 1 1.76-1.45h13.05a1.8 1.8 0 0 1 1.76 1.45z"
            />
          </g>
        </g>
      </svg>

      Продолжить анонимно
    </Btn>
  </div>

  <span class="divider">или</span>

  <div class="group">
    <Inp
      block
      outline
      v-model="email"
      placeholder="Email"
      autocomplete="email"
    />

    <Inp
      type="password"
      block
      outline
      v-model="password"
      placeholder="Пароль"
      autocomplete="password"
    />

    <Btn
      block
      color="#ffffff"
      @click="signIn"
      background="#000000"
      :isLoading="isLoading.classical"
    >
      Войти
    </Btn>

    <router-link to="/auth/resetPassword">
      <span>Забыли пароль?</span>
    </router-link>
  </div>

  <router-link to="/auth/signUp">
    Нет аккаунта? <span>Регистрация.</span>
  </router-link>

  <div
    v-show="isLoading.google || isLoading.anonymous || isLoading.classical"
    class="mask"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/UI/btn.vue";
import Inp from "@/components/UI/input.vue";

export default defineComponent({
  components: { Btn, Inp },

  data: () => ({
    // Кнопочки
    isLoading: {
      google: false,
      anonymous: false,
      classical: false,
    },

    // Поля
    email: "",
    password: "",
  }),

  methods: {
    signInGoogle() {
      this.isLoading.google = true;

      this.$firebase.auth
        .signInWithGoogle()
        .catch((e) => console.error("Ошибка авторизации через гугл:", e))
        .finally(() => (this.isLoading.google = false));
    },
    signInAnonymous() {
      this.isLoading.anonymous = true;

      this.$firebase.auth
        .signInAnonymously()
        .catch((e) => console.error("Ошибка авторизации anonymous:", e))
        .finally(() => (this.isLoading.anonymous = false));
    },
    signIn() {
      if (!this.email || !this.password) return;
      this.isLoading.classical = true;

      this.$firebase.auth
        .signIn(this.email, this.password)
        .catch((e) => console.error("Ошибка авторизации EmailPassword:", e))
        .finally(() => (this.isLoading.classical = false));
    },
  },
});
</script>
