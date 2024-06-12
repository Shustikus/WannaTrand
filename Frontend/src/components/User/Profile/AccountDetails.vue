<script>
import EditProfile from "@/components/User/Profile/EditProfile.vue";
import $api from "@/http";

export default {
  components: {
    EditProfile,
  },
  data() {
    return {
      userData: {
        email: "",
        role: "",
        phone: "",
        birthday: "",
        firstname: "",
        lastname: "",
        middlename: "",
        brand: {}, // Добавляем свойство для информации о бренде
      },
      showEditForm: false,
    };
  },
  methods: {
    async fetchUserProfile() {
      await $api
          .get('user/user-info',)
          .then((response) => {
            // Заполняем данные пользователя из ответа API
            this.userData.email = response.data.email;
            this.userData.role = response.data.role;
            this.userData.phone = response.data.phone;
            this.userData.birthday = response.data.birthday;
            this.userData.firstname = response.data.firstname;
            this.userData.lastname = response.data.lastname;
            this.userData.middlename = response.data.middlename;
            this.userData.brand = response.data.brand;
            localStorage.setItem("userData", JSON.stringify(this.userData));
            this.$store.dispatch('updateFirstname', response.data.firstname);
          })
          .catch((e) => {
            console.log(e)
          })
    },
  },
  mounted() {
    // Попытка загрузить данные из localStorage
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      this.userData = JSON.parse(savedUserData);
    }
    // Вызываем метод для получения актуальных данных пользователя
    this.fetchUserProfile();
  },
};
</script>

<template>
  <div class="my-profile_my_container_box">
    <div class="my-profile_profile_user_data_container">
      <div class="my-profile_profile_user_data">
        <div class="my-profile_profile_user_data_content">
          <div class="my-profile_profile_user_data_box">
            <div class="my-profile_profile_user_data_box_content">
              <div v-if="userData.email" class="my-profile_profile_user_data_box_key">Эл.адрес:</div>
              <div v-if="userData.phone" class="my-profile_profile_user_data_box_key">Номер моб.телефона:</div>
              <div v-if="userData.birthday" class="my-profile_profile_user_data_box_key">Дата рождения:</div>
            </div>
            <div class="my-profile_profile_user_data_box_content">
              <div v-if="userData.email" class="my-profile_profile_user_data_box_value">{{ userData.email }}</div>
              <div v-if="userData.phone" class="my-profile_profile_user_data_box_value">{{ userData.phone }}</div>
              <div v-if="userData.birthday" class="my-profile_profile_user_data_box_value">{{ userData.birthday }}</div>
            </div>
          </div>
        </div>
        <div class="my-profile_profile_user_data_content">
          <div class="my-profile_profile_user_data_box">
            <div class="my-profile_profile_user_data_box_content">
              <div v-if="userData.firstname" class="my-profile_profile_user_data_box_key">Имя:</div>
              <div v-if="userData.lastname" class="my-profile_profile_user_data_box_key">Фамилия:</div>
              <div v-if="userData.middlename" class="my-profile_profile_user_data_box_key">Отчество:</div>
            </div>
            <div class="my-profile_profile_user_data_box_content">
              <div v-if="userData.firstname" class="my-profile_profile_user_data_box_value">{{ userData.firstname }}
              </div>
              <div v-if="userData.lastname" class="my-profile_profile_user_data_box_value">{{ userData.lastname }}</div>
              <div v-if="userData.middlename" class="my-profile_profile_user_data_box_value">{{ userData.middlename }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--
        <div class="w-100 d-flex justify-content-center align-items-center">
          <button type="submit" @click="showEditForm = !showEditForm">Редактировать</button>
          <EditProfile v-if="showEditForm"/>
        </div>
    -->
  </div>
</template>

<style scoped>
.my-profile_my_container_box {
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
}

.my-profile_profile_user_data_container {
  margin-bottom: 80px;
}

.my-profile_profile_user_data {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.my-profile_profile_user_data_content {
  padding-right: 60px;
}

.my-profile_profile_user_data_box {
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.my-profile_profile_user_data_box_key {
  color: #b3b3b3;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-right: 10px;
  margin-bottom: 40px;
}

.my-profile_profile_user_data_box_value {
  color: #000;
  margin-bottom: 40px;
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
</style>