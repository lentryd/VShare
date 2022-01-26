<template>
  <div class="day">
    <span class="date" v-text="parseDate()" />

    <MGroup :key="i" v-for="(group, i) in groups" v-bind="group" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MGroup from "./msg-group.vue";

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export default defineComponent({
  props: {
    date: { type: Date, required: true },
    groups: { type: Array, required: true },
  },

  components: { MGroup },

  methods: {
    parseDate() {
      const day = this.date.getDate();

      const month = months[this.date.getMonth()];
      const year = this.date.getFullYear();

      let result = day + " " + month;
      if (year !== new Date().getFullYear()) result += " " + year;

      return result;
    },
  },
});
</script>


<style scoped>
@media (prefers-color-scheme: light) {
  .day {
    --color: #060607;
    --background: #fefefe80;
  }
}

@media (prefers-color-scheme: dark) {
  .day {
    --color: #ffffff;
    --background: #08080d80;
  }
}

.day {
  gap: 0.6rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.date {
  top: 0.4rem;
  color: var(--color);
  z-index: 1;
  padding: 2px 6px;
  position: sticky;
  font-size: 0.65rem;
  background: var(--background);
  font-weight: 500;
  user-select: none;
  border-radius: 8px;
  backdrop-filter: blur(1px);
  transition: filter 0.375s ease, opacity 0.25s ease 0.125s;
}
.date.hidden {
  opacity: 0;
  filter: blur(0.8px);
}
</style>