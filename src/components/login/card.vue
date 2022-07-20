<template>
  <div class="login-card">
    <span class="title-medium">Войдите в аккаунт</span>
    <span class="body-medium">Чтобы не потерять доступ к файлам.</span>

    <Btn to="/signIn" label="Войти" filled />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/ui/btn.vue";

export default defineComponent({
  name: "Login Card",

  components: { Btn },
});
</script>

<style lang="scss" scoped>
.login-card {
  margin: 16px;
  border: 1px solid;
  padding: 16px;
  display: flex;
  margin-top: 0;
  align-items: flex-start;
  margin-bottom: 12px;
  border-radius: 12px;
  flex-direction: column;

  @media (prefers-color-scheme: light) {
    border-color: $md-sys-color-outline-light;
  }
  @media (prefers-color-scheme: dark) {
    border-color: $md-sys-color-outline-dark;
  }

  .body-medium {
    margin-bottom: 24px;
  }

  .btn {
    margin-left: auto;
  }
}
</style>