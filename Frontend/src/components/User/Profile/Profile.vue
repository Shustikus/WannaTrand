<script>
import AccountDetails from "../Profile/AccountDetails.vue";
import EditProfile from "../Profile/EditProfile.vue";
import ChangePassword from "../Profile/ChangePassword.vue";
import MyOrders from "../Profile/MyOrders.vue";
import Brand from "./Brand.vue";
import ExitModal from "../../Modal/ExitModal.vue"
import DeleteUserModal from "../../Modal/DeleteUserModal.vue";
import Admin from "../Profile/Admin.vue"
import store from "@/store/store";
import {mapState} from "vuex";

export default {
  computed: {
    store() {
      return store;
    },
    ...mapState(['exitModalOpen', 'deleteUserModalOpen', 'firstname', 'visibleSection']),
  },
  components: {
    AccountDetails,
    EditProfile,
    ChangePassword,
    MyOrders,
    ExitModal,
    DeleteUserModal,
    Brand,
    Admin
  },
  data() {
    return {
      userData: {}
    };
  },
  methods: {
    toggleVisibility(section) {
      this.$store.commit('setVisibleSection', section);
    },
    openExitModal() {
      this.$store.commit('openExitModal');
    },
    getComponentName() {
      if (this.visibleSection === 'account') {
        return 'AccountDetails';
      } else if (this.visibleSection === 'editProfile') {
        return 'EditProfile';
      } else if (this.visibleSection === 'changePassword') {
        return 'ChangePassword';
      } else if (this.visibleSection === 'myOrders') {
        return 'MyOrders';
      } else if (this.visibleSection === 'brand' && this.userData.role === 'AUTHOR') {
        return 'Brand';
      } else if (this.visibleSection === 'admin' && this.userData.role === 'ADMIN') {
        return 'Admin';
      } else {
        return 'AccountDetails';
      }
    },
  },
  mounted() {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      this.userData = JSON.parse(savedUserData);
    }
  },
}
</script>

<template>
  <div class="scroll-content">
    <div class="container-profile">
      <h1>Учетная запись</h1>
      <div class="container-box">
        <div class="my-profile-panel">
          <h2 v-if="store.state.firstname !== null">Приветствую, {{ store.state.firstname }}</h2>
          <h2 v-else>Добро пожаловать</h2>
          <button @click="openExitModal">Выйти</button>
        </div>
        <div class="my-top-navigation_my_top_nav">
          <div v-for="section in ['account', 'editProfile', 'changePassword', 'myOrders', 'brand', 'admin']"
               class="my-top-navigation_my_top_nav_box">
            <div class="my-top-navigation_my_top_nav_item" @click="toggleVisibility(section)">
              <span v-if="section === 'account'">Данные аккаунта</span>
              <span v-else-if="section === 'editProfile'">Редактировать</span>
              <span v-else-if="section === 'changePassword'">Смена пароля</span>
              <span v-else-if="section === 'myOrders'">Мои заказы</span>
              <span v-else-if="section === 'brand' && userData.role === 'AUTHOR'">Бренд</span>
              <span v-else-if="section === 'admin' && userData.role === 'ADMIN'">Админ панель</span>
              <div :class="{ active: this.visibleSection === section || (section === 'account' && !this.visibleSection) }"
                   class="line"></div>
            </div>
          </div>
        </div>
        <div class="my-profile_main_profile_line"></div>
        <div class="tab-animate-enter">
          <component
              :is="getComponentName()"
              @toggle-visibility="toggleVisibility"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-content {
  margin-top: 101px;
}

.container-profile {
  padding: 0 10px !important;
  min-height: 640px;
}

.container-profile h1 {
  margin-bottom: 40px;
  margin-top: 0;
  text-align: center;
  width: 100%;
  font-family: Futura PT, sans-serif;
  font-weight: 400;
  font-size: 1.5em;
}

.container-box {
  width: 100%;
  max-width: 992px;
  margin: 0 auto !important;
  padding: 0;
}

.my-profile-panel {
  width: 100%;
  height: auto;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.my-profile-panel h2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-family: Futura PT, sans-serif;
  font-weight: 400;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
}

.my-profile-panel button {
  width: auto;
  height: auto;
  color: #2e3131;
  font-size: 17px;
  outline: none;
  border: none;
  background-color: transparent;
  transition: color .3s cubic-bezier(.215, .61, .355, 1);
}

.my-top-navigation_my_top_nav {
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-top-navigation_my_top_nav_box {
  padding-right: 30px;
}

.my-top-navigation_my_top_nav_item {
  font-size: 15px;
  cursor: pointer;
  position: relative;
  transition: color .3s ease;
  font-family: Futura PT, sans-serif;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid black;
  will-change: opacity, transform;
  visibility: visible;
  opacity: 0; /* Изначально линия невидима */
  transform-origin: 50% 50% 0;
  transition: opacity 0.3s ease, transform 0.3s ease; /* Анимация изменения видимости и позиции */
  transform: translateY(-10px);
}

.line.active {
  opacity: 1; /* При активации линия становится видимой */
  transform-origin: 50% 50% 0;
  transform: translateY(0); /* При активации линия сдвигается вниз под активную форму */
}

.my-profile_main_profile_line {
  display: block;
  width: 100%;
  border: 0;
  height: 1px;
  background-color: #a0a4b1;
  margin-top: 20px;
  margin-bottom: 40px;
}

.my-profile-panel button {
  font-weight: 500;
  overflow: hidden;
  position: relative;
  opacity: 1;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Добавляем анимацию */
  background: white;
}

.my-profile-panel button:hover {
  background-color: #2e3131; /* Изменяем цвет при наведении */
  color: #fff; /* Изменяем цвет текста при наведении */
  transform: scale(1.05); /* Увеличиваем размер кнопки при наведении */
}

@media screen and (max-width: 500px) {
  .my-top-navigation_my_top_nav {
    justify-content: flex-start;
    overflow-x: auto;
    -ms-user-select: none;
    user-select: none;
  }

  .my-top-navigation_my_top_nav::-webkit-scrollbar {
    height: 3px;
    background: transparent !important;
  }

  .my-top-navigation_my_top_nav::-webkit-scrollbar-thumb {
    height: 3px;
    background: #ececec !important;
  }

  .my-top-navigation_my_top_nav::-webkit-scrollbar-track {
    height: 1px;
    background: transparent !important;
  }
}
</style>