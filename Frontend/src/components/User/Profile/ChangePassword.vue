<script>
import $api from "@/http";

export default {
  data() {
    return {
      formData: {
        email: "",
        password: "",
        newPassword: "",
      },
    };
  },
  methods: {
    async changePassword() {
      await $api
          .post('/user/change-password', {
            email: this.formData.email,
            password: this.formData.password,
            newPassword: this.formData.newPassword,
          })
          .then((response) => {
            if (response.data.success) {
              console.log(response.data);
              // Очистите поля формы после успешной смены пароля
              this.formData.password = "";
              this.formData.newPassword = "";
              this.$emit("toggle-visibility", false, true);
            } else {
              // Вывести сообщение об ошибке
              console.log(response.data.error);
            }
          })
          .catch((e) => {
            console.log(e)
          })
    },
  },
  mounted() {
    // Загрузка данных из localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
      this.formData.email = userData.email || "";
    }
  },
};
</script>

<template>
  <fieldset class="my-profile_my_container_box_min">
    <div>
      <div class="ui-form-input_ui_form_section">
        <label class="ui-form-input_ui_form_input_label" for="auth_login">Логин для авторизации</label>
        <div class="ui-form-input_ui_form_input_container">
          <input id="auth_login" v-model="formData.email" class="ui-form-input_ui_form_input" disabled="" name="auth_login" type="text">
        </div>
        <div class="ui-form-input_ui_form_input_error_text"></div>
      </div>
    </div>
    <form autocomplete="off" @submit.prevent="changePassword">
      <div class="">
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="current_password">Текущий пароль</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="current_password" v-model="formData.password" class="ui-form-input_ui_form_input" minlength="6" name="current_password" type="password">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div class="">
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="new_password">Новый пароль</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="new_password" v-model="formData.newPassword" class="ui-form-input_ui_form_input" minlength="6" name="new_password" type="password">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div class="mt-5 w-100">
        <button type="submit">Изменить пароль</button>
      </div>
    </form>
  </fieldset>
</template>

<style scoped>
.my-profile_my_container_box_min {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  border: 0;
}

.ui-form-input_ui_form_section {
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 2.022vw;
}

.ui-form-input_ui_form_input_label {
  margin-bottom: 5px;
}

.ui-form-input_ui_form_input_container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  position: relative;
}

.ui-form-input_ui_form_input {
  width: 100%;
  margin-top: 5px;
  position: relative;
  height: 50px;
  outline: none;
  background-color: transparent;
  padding: 0;
  border-radius: 0 !important;
  border: none;
  border-bottom: 1px solid #000;
  transition: border-bottom-color .4s ease;
}

/*
.ui-form-input_ui_form_input_error_text {
  position: absolute;
  left: 0;
  bottom: -19px;
  color: #f64747;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transform: translateY(25px);
  transform: translateY(25px);
  transition: opacity .5s ease, -webkit-transform .4s ease;
  transition: transform .4s ease, opacity .5s ease;
  transition: transform .4s ease, opacity .5s ease, -webkit-transform .4s ease;
  will-change: trasnform, opacity;
}
*/
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
</style>