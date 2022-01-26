 <template>
  <div class="container">
    <div>
      <h1>Как войти в комнату?</h1>
      <ul>
        <li>
          Нажмите на другом устройте
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </li>
        <li>Покажите QR код</li>
      </ul>
    </div>

    <div class="btn-container">
      <Btn color="var(--color)" @click="goBack" background="var(--cancel-btn)">
        Отмена
      </Btn>
    </div>

    <Qrcode
      :value="url"
      class="qr-code"
      render-as="svg"
      foreground="var(--qr-color)"
      background="var(--qr-background)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Btn from "@/components/UI/btn.vue";
import Qrcode from "qrcode.vue";

export default defineComponent({
  components: { Btn, Qrcode },

  data: () => ({}),

  computed: {
    id() {
      return this.$firebase.auth.state.uid;
    },
    url() {
      return new URL(`/app/addUser/${this.id}`, location.origin).href;
    },
  },

  methods: {
    goBack() {
      window.history?.state.back?.startsWith("/app/rooms")
        ? this.$router.back()
        : this.$router.replace({ name: "Rooms" });
    },
  },
});
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .container {
    --cancel-btn: #1771e6;

    --qr-color: #000000;
    --qr-background: #c7d5ec;
  }
}

@media (prefers-color-scheme: dark) {
  .container {
    --cancel-btn: #3f9bff;

    --qr-color: #f1feff;
    --qr-background: #14142e;
  }
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

ul {
  margin: 0;
  font-size: 1rem;
  margin-bottom: 1rem;
  list-style-type: decimal;
}
ul svg {
  fill: var(--color);
  width: 1rem;
}

.btn-container {
  gap: 1.5rem;
  display: flex;
  margin-bottom: 1rem;
  flex-direction: row;
}

.qr-code {
  width: 10rem;
  height: 10rem;
  padding: 0.5rem;
  overflow: hidden;
  background: var(--qr-background);
  border-radius: 8px;
}
</style>