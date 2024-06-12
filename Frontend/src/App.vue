<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue'
import {RouterView} from 'vue-router'
import store from "@/store/store";

export default {
  components: {
    AppHeader,
    AppFooter,
    RouterView
  },
  data() {
    return {};
  },
  methods: {},
  created() {
    if (localStorage.getItem('accessToken')) {
      store.dispatch('checkAuth')
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading; // Получаем значение isLoading из состояния хранилища
    },
  }
};
</script>

<template>
  <div class="app">
    <!-- Шапка -->
    <app-header></app-header>
    <!-- Проверяем isLoading и отображаем индикатор загрузки, если isLoading равно true -->
    <div v-if="isLoading" class="loading-indicator"></div>
    <!-- Меняющаяся часть -->
    <router-view v-else></router-view>
    <!-- Подвал -->
    <app-footer></app-footer>
  </div>
</template>

<style>
.app {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 640px;
  background: rgba(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

body {
  width: 100%;
  height: 100%;
  font-family: 'Futura PT', sans-serif;
  font-size: 15px;
  font-weight: 400;
  background-color: #fff;
  color: #2e3131;
  overflow-x: hidden !important;
  scrollbar-gutter: stable;
  transition: background-color .5s ease;
  text-transform: uppercase;
}

@font-face {
  font-family: 'Futura PT'; /* Название шрифта для использования в CSS */
  src: url('./assets/ofont.ru_Futura PT.ttf') format('truetype'); /* Путь к файлу шрифта */
  font-weight: 400; /* Вес шрифта (может потребоваться указать правильный вес) */
  font-style: normal; /* Стиль шрифта (например, italic или normal) */
}

form {
  display: block;
  margin-top: 0;
}

::selection {
  color: #fff !important;
  background-color: #444;
}

a {
  text-decoration: none;
  color: #2e3131;
}

::-webkit-scrollbar {
  width: 10px;
  background-color: #f9f9fd;
}

::-webkit-scrollbar-track {
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
  background-color: #606060;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
