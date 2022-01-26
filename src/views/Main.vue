<template>
  <div>
    <h1>ПРЕДСТАВЬТЕ СЕБЕ…</h1>

    <p>
      ...инструмент, с помощью которого вы можете передавать документы,
      изображения, видео и просто текст. Инструмент, для использования которого
      не требуются провода и регистрация.
    </p>

    <router-link to="/auth" custom v-slot="{ navigate }">
      <Btn color="#ffffff" @click="navigate" background="#000000">
        Попробовать
      </Btn>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/UI/btn.vue";

export default defineComponent({
  components: { Btn },
});
</script>


<style scoped>
div {
  --color: #383838;
  --background: #baa5ff;
}

div {
  gap: 1.82rem;
  width: calc(100vw - 3rem);
  height: calc(100vh - 3rem);
  display: flex;
  padding: 1.5rem;
  background: var(--background);
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
div *::selection {
  color: var(--background);
  background: black;
}

h1 {
  color: black;
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
}

p {
  color: var(--color);
  margin: 0;
  max-width: 555px;
  font-size: 1.125rem;
  text-align: center;
  font-weight: 400;
}
@media screen and (max-width: 42em) {
  p {
    text-align: left;
  }
  .btn {
    width: 100%;
  }
}
</style>
