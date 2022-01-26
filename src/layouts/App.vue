<template>
  <div id="app-layout" :class="{ roomSelect }">
    <div class="nav-bar">
      <span id="app-name" />

      <router-link to="/app/user" custom v-slot="{ navigate }">
        <div @click="navigate" class="user-profile">
          <div>
            <img v-if="photo" :src="photo" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
          </div>

          <span v-text="name" />
        </div>
      </router-link>
    </div>

    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>

      <PopUp v-model:route="popRoute" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteLocationNormalized } from "vue-router";
import PopUp from "@/components/UI/PopUp.vue";

export default defineComponent({
  components: { PopUp },

  data: () => ({ popRoute: null as null | RouteLocationNormalized }),

  computed: {
    name() {
      return this.$firebase.auth.user.name;
    },
    photo() {
      return this.$firebase.auth.user.photo;
    },

    roomSelect() {
      return (
        this.$route.name == "Rooms" && this.$firebase.room.data.id != "none"
      );
    },
  },

  watch: {
    "$firebase.auth.state.uid"() {
      this.redirect();
    },
  },

  methods: {
    redirect() {
      if (this.$firebase.auth.state.uid) return;
      this.$router.replace("/auth");
    },
  },

  beforeRouteUpdate(to) {
    if (!to.meta.popUp) {
      if (this.popRoute) this.popRoute = null;
      return;
    }

    this.popRoute = to;
    this.$router.options.history.push(to.path);

    return false;
  },

  beforeMount() {
    this.redirect();
  },
});
</script>

<style scoped>
#app-layout {
  --hide-duration: 0.25s;
}

#app-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Шапка */
.nav-bar {
  height: 1.4585rem;
  display: flex;
  padding: 0.5rem 0.75rem;
  overflow: hidden;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

#app-name {
  gap: 0.225rem;
  display: flex;
  font-size: 0.9rem;
  user-select: none;
  align-items: center;
}
#app-name::after,
#app-name::before {
  height: 1.125rem;
  display: flex;
  overflow: hidden;
  min-width: 1.125rem;
  align-items: center;
  justify-content: center;
}
#app-name::before {
  color: var(--background);
  content: "V";
  background: var(--color);
  font-weight: 500;
}
#app-name::after {
  color: var(--color);
  border: 0.09rem solid var(--color);
  content: "Share";
  font-weight: 400;
  border-left: none;
  border-right: none;
}

.user-profile {
  gap: 0.25rem;
  cursor: pointer;
  display: flex;
  max-width: 60%;
  font-size: 0.9rem;
  user-select: none;
  align-items: center;
  flex-direction: row;
}
.user-profile > div {
  width: 1.305rem;
  height: 1.305rem;
  overflow: hidden;
  min-width: 1.305rem;
  border-radius: 50%;
}
.user-profile > div svg {
  fill: var(--color);
}
.user-profile > div img {
  width: 100%;
}
.user-profile > span {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Контент */
.content {
  gap: 0.5rem;
  width: calc(100% - 1.5rem);
  height: calc(100% - 0.9rem);
  display: flex;
  padding: 0.45rem 0.75rem;
  overflow: hidden;
  position: relative;
  flex-direction: row;
}
@media screen and (min-width: 42em) {
  .content {
    padding-bottom: 0.75rem;
  }
}

/* Анимация скрытия (для телефонов) */
@media screen and (max-width: 42em) {
  .content {
    transition: gap var(--hide-duration) ease-in-out;
  }

  .nav-bar {
    transition: opacity var(--hide-duration) ease-in-out,
      height var(--hide-duration) ease-in-out,
      padding var(--hide-duration) ease-in-out,
      transform var(--hide-duration) ease-in-out;
  }

  #app-layout.roomSelect {
    gap: 0;
  }

  #app-layout.roomSelect .nav-bar {
    height: 0;
    opacity: 0;
    transform: translateY(-100%);
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>