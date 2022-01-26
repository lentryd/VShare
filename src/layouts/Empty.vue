<template>
  <div id="empty">
    <router-view />
  </div>
</template>

<style scoped>
#empty {
  --color: #000000;
  --background: #baa5ff;
}

#empty {
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
</style>