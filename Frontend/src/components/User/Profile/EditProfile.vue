<script>
import $api from "@/http";

export default {
  data() {
    return {
      formData: {
        email: "",
        phone: "",
        lastname: "",
        firstname: "",
        middlename: "",
        birthday: "",
      },
    };
  },
  mounted() {
    // Загрузка данных из localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
      this.formData.email = userData.email || "";
      this.formData.phone = userData.phone || "";
      this.formData.lastname = userData.lastname || "";
      this.formData.firstname = userData.firstname || "";
      this.formData.middlename = userData.middlename || "";
      this.formData.birthday = userData.birthday || "";
    }
  },
  methods: {
    async handleSubmit() {
      $api
          .put('user/user-info-update', this.formData)
          .then((response) => {
            console.log(response.data);
            this.$emit("toggle-visibility", false, true);
          })
          .catch((e) => {
            console.log(e)
          })
    },
    openDeleteUserModal() {
      this.$store.commit('openDeleteUserModal');
    },
  },
};
</script>

<template>
  <div class="my-profile_my_container_box_min">
    <form @submit.prevent="handleSubmit">
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="email">Эл. адрес</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="email" v-model="formData.email" class="ui-form-input_ui_form_input" disabled="" name="email"
                   type="email">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
          <div class="ui-form-input_ui_form_input_bottom_content ui-form-input_ui_form_input_bottom_content_active">
            <div class="my-profile_validate_require">
              <button aria-label="email verify" class="my-profile_btn_verify" type="button">
                <span class="my-profile_validate_subtitle text-black">Подтвердить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="phone">Номер моб. телефона</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="phone" v-model="formData.phone" class="ui-form-input_ui_form_input" name="phone" type="tel">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="lastname">Фамилия</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="lastname" v-model="formData.lastname" class="ui-form-input_ui_form_input" name="lastname"
                   type="text">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="firstname">Имя</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="firstname" v-model="formData.firstname" class="ui-form-input_ui_form_input" name="firstname"
                   type="text">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="middlename">Отчество</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="middlename" v-model="formData.middlename" class="ui-form-input_ui_form_input" name="middlename"
                   type="text">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div>
        <div class="ui-form-input_ui_form_section">
          <label class="ui-form-input_ui_form_input_label" for="birthday">Дата рождения</label>
          <div class="ui-form-input_ui_form_input_container">
            <input id="birthday" v-model="formData.birthday" class="ui-form-input_ui_form_input" name="birthday"
                   type="date">
          </div>
          <div class="ui-form-input_ui_form_input_error_text"></div>
        </div>
      </div>
      <div class="mt-5 w-100">
        <button type="submit">Сохранить</button>
      </div>
    </form>
    <div class="text-center w-100" style="margin-top: 40px;">
      <div class="text-dark" style="cursor: pointer;" @click="openDeleteUserModal">Удалить аккаунт</div>
    </div>
  </div>
</template>

<style scoped>
.my-profile_my_container_box_min {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
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

.ui-form-input_ui_form_input_bottom_content {
  position: absolute;
  right: 0;
  bottom: -20px;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
}

.ui-form-input_ui_form_input_bottom_content_active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.my-profile_validate_require {
  display: block;
  text-align: right;
}

.my-profile_btn_verify {
  border: 0;
  outline: none;
  background: transparent;
  cursor: pointer;
  transition: color .1s;
  padding: 0;
}

.my-profile_validate_subtitle {
  display: inline-block;
  padding: 3px 0;

}
</style>