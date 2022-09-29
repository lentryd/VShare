<template>
  <TopAppBar title="Профиль" scrollEl="#app .content" />

  <div class="profile">
    <div class="account-info">
      <div class="avatar">
        <img :src="'/img/avatars/' + me.avatar + '.png'" />
      </div>

      <div class="name">
        <span class="title-large" v-text="me.name" />
      </div>
    </div>

    <Card v-if="$fb.auth.isAnonymous" />

    <Item
      v-show="canLinkGoogle"
      label="Подключить аккаунт гугл"
      @click="$fb.auth.signInWithGoogle()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 510">
        <g>
          <g xmlns="http://www.w3.org/2000/svg">
            <g id="glass">
              <path
                d="M286.875,229.5v63.75h150.45c-15.3,89.25-86.7,153-175.95,153c-104.55,0-191.25-86.7-191.25-191.25    s86.7-191.25,191.25-191.25c53.55,0,99.45,22.95,132.6,58.65l45.9-45.9c-45.9-45.9-107.1-76.5-178.5-76.5    c-140.25,0-255,114.75-255,255s114.75,255,255,255s242.25-114.75,242.25-255v-25.5H286.875z"
              />
            </g>
          </g>
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
          <g xmlns="http://www.w3.org/2000/svg" />
        </g>
      </svg>
    </Item>

    <Item
      icon="&#xe3c9;"
      label="Изменить имя"
      iconRound
      @click="editName = true"
    />

    <Item
      icon="&#xe853;"
      label="Изменить аватар"
      iconRound
      @click="editAvatar = true"
    />

    <div class="info">
      <span class="caption">version: {{ version }}</span>
      <span class="caption">ID: {{ me.id }}</span>
    </div>
  </div>

  <UpdateName v-model="editName" />

  <UpdateAvatar v-model="editAvatar" />

  <SignIn v-model="signIn" />
  <SignUp v-model="signUp" />
  <ResetPassword v-model="resetPassword" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "@/components/profile/item.vue";
import TopAppBar from "@/components/ui/top-app-bar";
import UpdateName from "@/components/profile/update-name.vue";
import UpdateAvatar from "@/components/profile/update-avatar.vue";
import { Card, SignIn, SignUp, ResetPassword } from "@/components/login";

export default defineComponent({
  name: "Profile View",

  components: {
    Item,
    Card,
    TopAppBar,
    UpdateName,
    UpdateAvatar,
    SignIn,
    SignUp,
    ResetPassword,
  },

  data: () => ({
    editName: false,
    editAvatar: false,
  }),

  computed: {
    me() {
      return this.$fb.users.state;
    },
    version() {
      return process.env.VERSION;
    },
    signIn: {
      get() {
        return "signIn" in this.$route.query;
      },

      set(v: boolean) {
        if (v) this.$router.push({ query: { signIn: null } });
        else if (window?.history.state?.back == "/profile") this.$router.back();
        else this.$router.replace("/profile");
      },
    },
    signUp: {
      get() {
        return "signUp" in this.$route.query;
      },

      set(v: boolean) {
        if (v) this.$router.push({ query: { signUp: null } });
        else if (window?.history.state?.back == "/profile") this.$router.back();
        else this.$router.replace("/profile");
      },
    },
    resetPassword: {
      get() {
        return "resetPassword" in this.$route.query;
      },

      set(v: boolean) {
        if (v) this.$router.push({ query: { resetPassword: null } });
        else if (window?.history.state?.back == "/profile") this.$router.back();
        else this.$router.replace("/profile");
      },
    },

    component() {
      return this.$device.isDesktop ? "Dialog" : "Popup";
    },
    canLinkGoogle() {
      return (
        !this.$fb.auth.isAnonymous &&
        !this.$fb.auth.providers.includes("google.com")
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.profile {
  width: 100%;
  margin: 0 auto;
  display: flex;
  max-width: min(640px, 100%);
  min-height: calc(100% - 64px);
  flex-direction: column;
}

.account-info {
  gap: 16px;
  display: flex;
  padding: 16px;
  padding-top: 0;
  align-items: center;
  flex-direction: row;
  padding-bottom: 12px;
}

.avatar > img {
  width: 80px;
  height: 80px;
  transition: filter 250ms ease-in-out;
}

.name {
  display: flex;
  flex-direction: column;

  .body-medium {
    font-family: monospace;
  }
}

.info {
  gap: 12px;
  display: flex;
  padding: 12px;
  margin-top: auto;
  align-items: center;
  flex-direction: column;
}
</style>
