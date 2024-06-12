<script>
import $api from "@/http";

export default {
  emits: ['close-form'], // Объявляем событие close-form
  data() {
    return {
      email: '',
    };
  },
  methods: {
    closeForm() {
      this.$emit('close-form'); // Эмитируем событие, чтобы родительский компонент мог его обработать
    },
    resetPassword() {
      $api
          .post('user/reset-password', {email: this.email})
          .then(response => {
            console.log(response);
            // Здесь вы можете добавить логику для обработки успешной отправки запроса на восстановление пароля


            this.closeForm(); // Закрыть форму после успешной авторизации
          })
    },
  }
}
</script>

<template>
  <div class="close-button" @click="closeForm">&times;</div>
  <div class="form-container">
    <div class="text-center"><h2>Восстановление пароля</h2></div>
    <form @submit.prevent="resetPassword">
      <div class="form-group">
        <div class="form-group-email">
          <div class="form-input-label"><label for="email">Эл.адрес</label></div>
          <input id="email" v-model="email" required type="email">
        </div>
      </div>
      <div class="w-100 mt-5">
        <button type="submit">ВОССТАНОВИТЬ ПАРОЛЬ</button>
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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #000;
}
</style>