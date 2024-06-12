<script>
import store from "@/store/store";
import $api from "@/http";
import LoginError from "@/components/Alert/LoginError.vue";

export default {
  components: {LoginError},
  emits: ['open', 'close-form'], // Объявляем событие close-form
  data() {
    return {
      email: "",
      password: "",
      loginError: false,
      showPassword: false,
      isAuth: false,
    };
  },
  methods: {
    closeForm() {
      this.$emit('close-form'); // Эмитируем событие, чтобы родительский компонент мог его обработать
    },
    openAuthorAuthError() {
      this.$emit("open", true);
    },
    togglePasswordVisibility(inputId) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.type = this.showPassword ? 'password' : 'text';
      }
      this.showPassword = !this.showPassword;
    },
    login() {
      this.loginError = false; // Сброс ошибки при каждой попытке входа
      $api
          .post("user/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.email = "";
            this.password = "";
            console.log(response);
            // После успешного входа, сохраняем refreshToken на клиенте
            localStorage.setItem("accessToken", response.data.accessToken); // Устанавливаем срок действия
            // Проверяем роль и флаг isActivated
            if (response.data.user.role === 'AUTHOR' && response.data.user.isActivated === false) {
              this.openAuthorAuthError()
              return;
            }
            store.dispatch('updateAuthStatus', true);
            this.$router.push({name: 'profile'});
            this.closeForm(); // Закрыть форму после успешной авторизации
          })
          .catch((e) => {
            this.loginError = true; // Установка ошибки в случае неудачной попытки входа
            console.log(e)
          });
    },
  }
};
</script>

<template>
  <LoginError v-if="loginError" @close="loginError = false"/>
  <div class="close-button" @click="closeForm">&times;</div>
  <div class="form-container">
    <div class="text-center"><h2>Авторизация</h2></div>
    <form @submit.prevent="login">
      <div class="form-group">
        <div class="form-group-email">
          <div class="from-input-label"><label for="email">Эл.адрес</label></div>
          <input id="email" v-model="email" :class="{ 'error': loginError }" required type="email">
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="password">Пароль</label></div>
          <input id="password" v-model="password" :class="{ 'error': loginError }" required type="password">
          <a :class="{ 'view': showPassword }" class="password-control"
             @click="togglePasswordVisibility('password')"></a>
        </div>
      </div>
      <div class="w-100 mt-5">
        <button type="submit">ВОЙТИ</button>
      </div>
    </form>
  </div>
</template>

<style scoped>

form {
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 420px;
  margin: 120px auto;
  padding: 0 20px;
}

.text-center {
  width: 100%;
  max-width: 100%;
}

h2 {
  font-family: Futura PT, sans-serif;
  font-weight: 400;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px; /* Размер шрифта лейблов */
}

input#email {
  width: 100%;
  padding: 8px;
  border: none; /* Убираем рамку */
  border-bottom: 1px solid #3d3d3d; /* Добавляем нижнюю полоску */
  border-radius: 0; /* Убираем скругление углов */
  margin-bottom: 10px;
  font-size: 14px;
  outline: none; /* Убираем обводку при клике */
}

input#password {
  width: 100%;
  padding: 8px;
  border: none; /* Убираем рамку */
  border-bottom: 1px solid #3d3d3d; /* Добавляем нижнюю полоску */
  border-radius: 0; /* Убираем скругление углов */
  margin-bottom: 10px;
  font-size: 14px;
  outline: none; /* Убираем обводку при клике */
}

button[type="submit"] {
  width: 100%;
  padding: 7px 10px;
  font-weight: 500;
  border: 1px solid #2e3131;
  overflow: hidden;
  position: relative;
  opacity: 1;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Добавляем анимацию */
  background: white;
  color: #2e3131;
}

button[type="submit"]:hover {
  background-color: #2e3131; /* Изменяем цвет при наведении */
  color: #fff; /* Изменяем цвет текста при наведении */
  transform: scale(1.05); /* Увеличиваем размер кнопки при наведении */
}

.form-group-email {
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 2.022vw;
}

.form-group-pass {
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 2.022vw;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #000;
}

.password-control {
  position: absolute;
  top: 27px;
  right: 6px;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url(https://snipp.ru/demo/495/view.svg) 0 0 no-repeat;
}

.password-control.view {
  cursor: pointer;
  background: url(https://snipp.ru/demo/495/no-view.svg) 0 0 no-repeat;
}

.error {
  border-bottom: 1px solid #f64747 !important;;
}
</style>
