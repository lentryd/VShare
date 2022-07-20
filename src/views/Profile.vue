<template>
  <TopAppBar title="Профиль" scrollEl="#app .content" />

  <div class="profile">
    <div class="account-info">
      <div class="avatar" @click="editAvatar = true">
        <img :src="'/img/avatars/' + me.avatar + '.png'" />
        <span class="material-icons-round">&#xe3c9;</span>
      </div>

      <div class="name">
        <span class="title-large" v-text="me.name" />
      </div>
    </div>

    <Card v-if="$auth.isAnonymous" />

    <Item
      icon="&#xe3c9;"
      label="Изменить имя"
      iconRound
      @click="editName = true"
    />
  </div>

  <UpdateName v-model="editName" />
  <UpdateAvatar v-model="editAvatar" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Card } from "@/components/login";
import Item from "@/components/profile/item.vue";
import TopAppBar from "@/components/ui/top-app-bar";
import UpdateName from "@/components/profile/update-name.vue";
import UpdateAvatar from "@/components/profile/update-avatar.vue";

export default defineComponent({
  name: "Profile View",

  components: { Item, Card, TopAppBar, UpdateName, UpdateAvatar },

  data: () => ({
    editName: false,
    editAvatar: false,
  }),

  computed: {
    me() {
      return this.$users.me;
    },
  },
});
</script>

<style lang="scss" scoped>
.profile {
  @media screen and (min-width: 768px) {
    width: 50%;
    margin: 0 auto;
    max-width: 560px;
  }
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

.avatar {
  cursor: pointer;
  position: relative;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  img {
    width: 80px;
    height: 80px;
    transition: filter 250ms ease-in-out;
  }
  &:hover img {
    filter: brightness(0.9);
  }
  &:focus img,
  &:active img {
    filter: brightness(0.75);
  }

  span {
    right: 0;
    bottom: 0;
    padding: 4px;
    font-size: 20px;
    position: absolute;
    border-radius: 50%;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-secondary-container-light;
      background: $md-sys-color-secondary-container-light;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-secondary-container-dark;
      background: $md-sys-color-secondary-container-dark;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
    }
  }
}

.name {
  display: flex;
  flex-direction: column;

  .body-medium {
    font-family: monospace;
  }
}
</style>
