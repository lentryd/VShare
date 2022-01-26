<template>
  <div class="auth">
    <div class="tile">
      <span class="title">Без регистрации</span>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g><rect fill="none" height="24" width="24" /></g>
        <g>
          <g>
            <path
              d="M15.18,10.94c0.2-0.44,0.32-0.92,0.32-1.44C15.5,7.57,13.93,6,12,6c-0.52,0-1,0.12-1.44,0.32L15.18,10.94z"
            />
            <path
              d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M4,12c0-1.85,0.63-3.55,1.69-4.9l2.86,2.86 c0.21,1.56,1.43,2.79,2.99,2.99l2.2,2.2C13.17,15.05,12.59,15,12,15c-2.32,0-4.45,0.8-6.14,2.12C4.7,15.73,4,13.95,4,12z M12,20 c-1.74,0-3.34-0.56-4.65-1.5C8.66,17.56,10.26,17,12,17s3.34,0.56,4.65,1.5C15.34,19.44,13.74,20,12,20z M18.31,16.9L7.1,5.69 C8.45,4.63,10.15,4,12,4c4.42,0,8,3.58,8,8C20,13.85,19.37,15.54,18.31,16.9z"
            />
          </g>
        </g>
      </svg>

      <div class="advantages">
        Преимущества:
        <ul>
          <li>Быстрый доступ</li>
        </ul>
      </div>

      <div class="limitations">
        Ограничения:
        <ul>
          <li>5 комнат</li>
          <li>20 MB для медиа</li>
        </ul>
      </div>

      <span class="btn">Выбрать</span>
    </div>

    <div class="tile">
      <span class="title">С регистрацией</span>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"
        />
      </svg>

      <div class="advantages">
        Преимущества:
        <ul>
          <li>Мгновенная синхронизация</li>
        </ul>
      </div>

      <div class="limitations">
        Ограничения:
        <ul>
          <li>15 комнат</li>
          <li>100 MB для медиа</li>
        </ul>
      </div>

      <span class="btn">Выбрать</span>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-color-scheme: light) {
  .auth {
    --background: #fefefed9;

    --tile-shadow: #d6d7da;
    --tile-background: #e2e4e7;

    --btn-color: #82c2f3;
  }
}

@media (prefers-color-scheme: dark) {
  .auth {
    --background: #050508d9;

    --tile-shadow: #0e0e15;
    --tile-background: #0a0a0f;

    --btn-color: #2573bb;
  }
}

.auth {
  top: 0;
  left: 0;
  width: calc(100% - 4rem);
  height: calc(100% - 4rem);
  z-index: 2;
  padding: 2rem;
  display: flex;
  row-gap: 1rem;
  position: absolute;
  flex-wrap: wrap;
  column-gap: 4rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--background);
  align-items: center;
  flex-direction: row;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.tile {
  cursor: pointer;
  padding: 10px;
  display: flex;
  min-width: 15rem;
  background: var(--tile-background);
  box-shadow: 0 0 1px 1px var(--tile-shadow);
  user-select: none;
  border-radius: 8px;
  flex-direction: column;
}
.tile .title {
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
  margin-bottom: 0.4rem;
}
.tile svg {
  fill: var(--color);
  width: 5rem;
  margin: 0 auto;
}
.tile .advantages,
.tile .limitations {
  opacity: 0.9;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}
.tile ul {
  margin: 0.2rem 0;
}

.tile .btn {
  width: 100%;
  padding: 0.2rem 0;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.25rem;
  background: var(--btn-color);
  border-radius: 6px;
}
</style>