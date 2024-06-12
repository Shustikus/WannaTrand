<script>
import store from "@/store/store";
import $api from "@/http";
import RegistrationError from "@/components/Alert/RegistrationError.vue";
import IncorrectPasswordError from "@/components/Alert/IncorrectPasswordError.vue";

export default {
  components: {IncorrectPasswordError, RegistrationError},
  emits: ['close-form'], // Объявляем событие close-form
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      brand: {brand_title: '', brand_description: '', brand_representativeInfo: ''},
      applyCheckbox: false,
      showApplicationForm: false,
      showPassword: false,
      showConfirmPassword: false,
      registrationError: false,
      showIncorrectPasswordError: false,
      isAuth: false
    };
  },
  methods: {
    closeForm() {
      this.$emit('close-form'); // Эмитируем событие, чтобы родительский компонент мог его обработать
    },
    toggleApplicationForm() {
      this.showApplicationForm = !this.showApplicationForm;
    },
    togglePasswordVisibility(flag) {
      this[flag] = !this[flag];
    },
    async registration() {
      if (this.password !== this.confirmPassword) {
        this.showIncorrectPasswordError = true;
        return;
      }

      const registrationData = {email: this.email, password: this.password};

      if (this.applyCheckbox) {
        registrationData.role = 'AUTHOR';
      }
      this.showIncorrectPasswordError = false;
      this.registrationError = false;
      await $api
          .post('user/registration', registrationData)
          .then(response => {
            this.email = '';
            this.password = '';
            this.confirmPassword = '';
            console.log(response);
            if (!this.applyCheckbox) {
              localStorage.setItem("accessToken", response.data.accessToken);
              store.dispatch('updateAuthStatus', true);
              this.$router.push({name: 'profile'});
              this.closeForm(); // Закрыть форму после успешной авторизации
            }
          })
          .catch((e) => {
            this.registrationError = true;
            console.log(e)
          });

      if (this.applyCheckbox) {
        await $api
            .post('/brand', this.brand)
            .then((response) => {
              console.log(response.data)
              this.closeForm(); // Закрыть форму после успешной авторизации
            })
            .catch((e) => {
              console.log(e)
            })
      }
    },
  },
  mounted() {
  }
}
</script>

<template>
  <IncorrectPasswordError v-if="showIncorrectPasswordError" @close="showIncorrectPasswordError = false"/>
  <RegistrationError v-if="registrationError" @close="registrationError = false"/>
  <div class="close-button" @click="closeForm">&times;</div>
  <div class="form-container">
    <div class="text-center"><h2>{{ applyCheckbox ? 'Подать заявку на регистрацию бренда' : 'Регистрация' }}</h2></div>
    <form @submit.prevent="registration">
      <div class="form-group">
        <div class="form-group-email">
          <div class="from-input-label"><label for="email">Эл.адрес</label></div>
          <input id="email" v-model="email" :class="{ 'error': registrationError }" required type="email">
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="password">Пароль</label></div>
          <input id="password" v-model="password" :class="{ 'error': showIncorrectPasswordError }"
                 :type="showPassword ? 'text' : 'password'"
                 required>
          <a :class="{ 'view': showPassword }" class="password-control"
             @click="togglePasswordVisibility('showPassword')"></a>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="confirmPassword">Подтвердите пароль</label></div>
          <input id="confirmPassword" v-model="confirmPassword" :class="{ 'error': showIncorrectPasswordError }"
                 :type="showConfirmPassword ? 'text' : 'password'" required>
          <a :class="{ 'view': showConfirmPassword  }" class="password-control"
             @click="togglePasswordVisibility('showConfirmPassword')"></a>
        </div>
      </div>
      <div v-if="showApplicationForm" class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="brand_title">Название бренда</label></div>
          <input id="brand_title" v-model="brand.brand_title" required type="text">
        </div>
      </div>
      <div v-if="showApplicationForm" class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="brand_description">Описание бренда</label></div>
          <textarea id="brand_description" v-model="brand.brand_description" required></textarea>
        </div>
      </div>
      <div v-if="showApplicationForm" class="form-group">
        <div class="form-group-pass">
          <div class="form-input-label"><label for="representativeInfo">ФИО и контакты представителя бренда</label>
          </div>
          <input id="representativeInfo" v-model="brand.brand_representativeInfo" required type="text">
        </div>
      </div>
      <div class="form-group-checkbox">
        <label for="applyCheckbox">Заявка на регистрацию бренда</label>
        <input id="applyCheckbox" v-model="applyCheckbox" type="checkbox" @change="toggleApplicationForm">
      </div>
      <div class="w-100 mt-5">
        <button type="submit">{{ applyCheckbox ? 'Подать заявку' : 'Зарегистрироваться' }}</button>
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

@media screen and (max-height: 740px) {
  .form-container {
    margin: 0 auto;
  }
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

input {
  width: 100%;
  padding: 8px;
  border: none; /* Убираем рамку */
  border-bottom: 1px solid #3d3d3d; /* Добавляем нижнюю полоску */
  border-radius: 0; /* Убираем скругление углов */
  margin-bottom: 10px;
  font-size: 14px;
  outline: none; /* Убираем обводку при клике */
}

textarea {
  width: 100%;
  height: 33.1px;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #3d3d3d;
  border-radius: 0;
  margin-bottom: 10px;
  font-size: 14px;
  outline: none;
  resize: vertical; /* Allow vertical resizing */
  max-height: 140px;
}

.form-group-checkbox {
  display: flex;
}

input#applyCheckbox {
  width: auto;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #3d3d3d;
  border-radius: 0;
  margin-bottom: 10px;
  margin-left: 30px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
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
