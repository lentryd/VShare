<template>
  <div class="history-list">
    <TopAppBar title="История" scrollEl="#app .content" />

    <div v-if="$chats.items.length" class="history-list-content">
      <div class="banner">
        <span class="material-icons-round">&#xe001;</span>
        <span class="body-small">
          Файлы, которыми вы делитесь, автоматически удаляются через 10 дней.
        </span>
      </div>

      <Item v-bind="chat" v-for="chat in $chats.items" />
    </div>

    <div v-else class="empty">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511 511">
        <g>
          <g xmlns="http://www.w3.org/2000/svg">
            <path
              d="m426.107 279.5 71.499-71.5h-133.212l-46.197 46.196 10.607 10.607 41.802-41.803h90.787l-49.001 49h-201.785l-64.001-64h-133.212l71.5 71.5-71.5 71.5h229.213l53.393-53.394v198.394h-193v-128.5h-15v143.5h335v-160h74.606zm-285.713-56.5 48.999 49h-90.786l-49.001-49zm96 113h-186.788l49-49h186.787zm171.606 160h-97v-209h97zm15-198.393 38.394 38.393h-38.394z"
            />
            <path
              d="m177.632 221.368 60.16-24.94c12.76 6.927 27.098 10.572 41.708 10.572 48.248 0 87.5-39.252 87.5-87.5s-39.252-87.5-87.5-87.5-87.5 39.252-87.5 87.5c0 14.61 3.645 28.948 10.572 41.708zm39.703-64.554c-6.761-11.236-10.335-24.139-10.335-37.314 0-39.977 32.523-72.5 72.5-72.5s72.5 32.523 72.5 72.5-32.523 72.5-72.5 72.5c-13.175 0-26.078-3.574-37.314-10.335l-3.243-1.952-33.574 13.919 13.919-33.574z"
            />
            <path
              d="m159.5 47c12.958 0 23.5-10.542 23.5-23.5s-10.542-23.5-23.5-23.5-23.5 10.542-23.5 23.5 10.542 23.5 23.5 23.5zm0-32c4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5z"
            />
            <path
              d="m408 143.5c0 12.958 10.542 23.5 23.5 23.5s23.5-10.542 23.5-23.5-10.542-23.5-23.5-23.5-23.5 10.542-23.5 23.5zm23.5-8.5c4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5z"
            />
            <path
              d="m260.5 167.106 19-19 19 19 28.606-28.606-19-19 19-19-28.606-28.606-19 19-19-19-28.606 28.606 19 19-19 19zm-7.394-66.606 7.394-7.394 19 19 19-19 7.394 7.394-19 19 19 19-7.394 7.394-19-19-19 19-7.394-7.394 19-19z"
            />
            <path
              d="m104 119.5h15v-16.5h16.5v-15h-16.5v-16.5h-15v16.5h-16.5v15h16.5z"
            />
            <path
              d="m392 71.5h15v-16.5h16.5v-15h-16.5v-16.5h-15v16.5h-16.5v15h16.5z"
            />
            <path d="m159.5 456h16v15h-16z" />
            <path d="m191.5 456h16v15h-16z" />
            <path d="m223.5 456h16v15h-16z" />
            <path
              d="m340.804 444.804 11.196-11.197v37.893h15v-37.893l11.196 11.197 10.608-10.608-29.304-29.302-29.304 29.302z"
            />
          </g>
        </g>
      </svg>

      <span class="title-medium">Похоже тут пусто</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "@/components/history/list-item.vue";
import TopAppBar from "@/components/ui/top-app-bar";

export default defineComponent({
  name: "History List",

  components: { Item, TopAppBar },
});
</script>

<style lang="scss" scoped>
.history-list {
  display: flex;
  min-height: 100%;
  flex-direction: column;
}

.history-list-content {
  display: flex;
  flex-direction: column;

  > .banner {
    gap: 12px;
    width: calc(100% - 64px);
    margin: 0 16px;
    display: flex;
    padding: 14px 16px;
    align-items: center;
    border-radius: 16px;
    margin-bottom: 12px;
    flex-direction: row;

    @media (prefers-color-scheme: light) {
      color: $md-sys-color-on-secondary-container-light;
      background: $md-sys-color-secondary-container-light;
    }
    @media (prefers-color-scheme: dark) {
      color: $md-sys-color-on-secondary-container-dark;
      background: $md-sys-color-secondary-container-dark;
    }
  }
}

.empty {
  gap: 16px;
  margin: auto;
  display: flex;
  align-items: center;
  flex-direction: column;

  > svg {
    width: 125px;
    height: 125px;

    @media (prefers-color-scheme: light) {
      fill: $md-sys-color-on-background-light;
    }
    @media (prefers-color-scheme: dark) {
      fill: $md-sys-color-on-background-dark;
    }
  }
}
</style>
