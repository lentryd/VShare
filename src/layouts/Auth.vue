<template>
  <div id="auth">
    <div>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  watch: {
    "$firebase.auth.state.uid"() {
      this.redirect();
    },
  },

  methods: {
    redirect() {
      if (!this.$firebase.auth.state.uid) return;
      this.$router.replace("/app");
    },
  },

  beforeMount() {
    this.redirect();
  },
});
</script>

<style>
#auth {
  --color: #000000;
  --background: #baa5ff;
}

#auth {
  width: 100vw;
  color: var(--color);
  display: flex;
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--background);
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

#auth > div {
  gap: 0.85rem;
  width: 20rem;
  display: flex;
  max-width: 90%;
  align-items: center;
  flex-direction: column;
}
#auth > div h1 {
  margin: 0;
  font-size: 1.7rem;
  text-align: center;
  font-weight: 800;
}
#auth > div p {
  margin: 0;
  font-size: 0.95rem;
}
#auth > div a {
  color: var(--color);
  font-size: 0.9rem;
  text-decoration: none;
}
#auth > div a > * {
  text-decoration: underline;
}

#auth > div .group {
  gap: 0.4rem;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
#auth > div .divider {
  font-size: 0.85rem;
  font-weight: 400;
}
#auth > div .mask {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  position: fixed;
}
</style>