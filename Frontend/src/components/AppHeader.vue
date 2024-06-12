<script>
import RegistrationForm from './User/RegistrationForm.vue';
import LoginForm from "./User/LoginForm.vue";
import ForgotPasswordForm from "./User/ForgotPasswordForm.vue";
import AuthorAuthError from "./Modal/AuthorAuthError.vue";
import store from "../store/store";
import $api from "@/http";
import AuthError from "@/components/Modal/AuthError.vue";
import ExitModal from "@/components/Modal/ExitModal.vue";
import DeleteUserModal from "@/components/Modal/DeleteUserModal.vue";
import FileSizeError from "@/components/Modal/FileSizeError.vue";

export default {
  components: {
    FileSizeError,
    DeleteUserModal,
    ExitModal,
    AuthError,
    AuthorAuthError,
    RegistrationForm,
    LoginForm,
    ForgotPasswordForm
  },
  data() {
    return {
      product: [],
      activeForm: null,
      isScrolledDown: false,
      isBurgerMenuVisible: false,
      isAuthorAuthError: false,
      isFileSizeError: false
    };
  },
  methods: {
    toggleBurgerMenu() {
      this.isBurgerMenuVisible = !this.isBurgerMenuVisible;
    },
    showForm(formName) {
      this.activeForm = formName;
    },
    closeForm() {
      this.activeForm = null; // Закрываем форму логина
      document.querySelector(".login-form").classList.remove("active");
    },
    closeAuthorAuthError() {
      this.isAuthorAuthError = false;
    },
    openAuthorAuthError() {
      this.isAuthorAuthError = true;
    },
    closeFileSizeError() {
      this.$store.commit('closeFileSizeError');
    },
    openFileSizeError() {
      this.$store.commit('openFileSizeError');
    },
    closeAuthError() {
      this.$store.commit('closeAuthError');
    },
    openLoginForm() {
      this.activeForm = 'login';
    },
    openExitModal() {
      this.$store.commit('openExitModal');
    },
    closeExitModal() {
      this.$store.commit('closeExitModal');
    },
    openDeleteUserModal() {
      this.$store.commit('openDeleteUserModal');
    },
    closeDeleteUserModal() {
      this.$store.commit('closeDeleteUserModal');
    },
    handleProfileClick() {
      if (this.isAuth) {
        this.$router.push({path: '/profile'});
      } else {
        this.showForm('login');
      }
      this.isBurgerMenuVisible = false;
    },
    handleScroll() {
      const scrollPosition = window.scrollY;
      const isMobile = window.innerWidth <= 768;

      if (!isMobile) {
        this.isScrolledDown = scrollPosition > 600;
      }
    },
    async hasItemsInCart() {
      await $api
          .get(`/cart`)
          .then((response) => {
            this.product = response.data
            console.log(response.data)
          })
          .catch((e) => {
            console.log(e)
          })
    }
  },
  mounted() {
    // Add a scroll event listener
    window.addEventListener('scroll', this.handleScroll);
  },
  computed: {
    isAuth() {
      return store.state.isAuth
    },
    isAuthError() {
      return this.$store.state.isAuthError;
    },
  }
}
</script>

<template>
  <header>
    <div class="header">
      <div class="logo">
        <a @click="this.$router.push({path: '/'})">wanna trend</a>
      </div>
      <button class="burger-button" @click="toggleBurgerMenu">
        <div v-if="!isBurgerMenuVisible" class="burger-icon">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </button>
      <div :class="{ active: isBurgerMenuVisible }" class="burger-menu">
        <div class="navbar-sm_navbar_small__sidebar_header">
          <div class="navbar-sm_navbar_small__sidebar_top">
            <div class="col-6">
              <div class="d-flex flex-row align-items-center">
                <div class="navbar-sm_sidebar_top__item">
                  <button aria-label="back" class="navbar-sm_sidebar_top__item_btn" hidden="">
                    <img alt="..." class="" src="../assets/arrow-left.png" style="width: 8px; height: 8px;">
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex flex-row align-items-center justify-content-end">
                <div class="navbar-sm_sidebar_top__item navbar-sm_sidebar_top__item_active">
                  <a aria-label="native link site" class="cursor-pointer navbar-sm_sidebar_top__item_btn"
                     @click="() => { this.isBurgerMenuVisible = false; this.$router.push({path: '/favourite'}); }">
                    <img alt="..." class="" src="../assets/favourite.png" style="width: 22px; height: 22px;">
                  </a>
                </div>
                <div class="navbar-sm_sidebar_top__item navbar-sm_sidebar_top__item_active">
                  <a aria-label="native link site" class="cursor-pointer navbar-sm_sidebar_top__item_btn"
                     @click="() => { this.isBurgerMenuVisible = false; this.$router.push({path: '/cart'}); }">
                    <button aria-label="cart" class="navbar-sm_sidebar_top__item_btn">
                      <img alt="..." src="../assets/cart.png" style="width: 22px; height: 22px;">
                    </button>
                  </a>
                </div>
                <div class="navbar-sm_sidebar_top__item navbar-sm_sidebar_top__item_active">
                  <a aria-label="native link site" class="cursor-pointer navbar-sm_sidebar_top__item_btn">
                    <button aria-label="cart" class="navbar-sm_sidebar_top__item_btn" @click="handleProfileClick">
                      <img alt="..." src="../assets/user.png" style="width: 22px; height: 22px;">
                    </button>
                  </a>
                </div>
                <div class="navbar-sm_sidebar_top__item navbar-sm_sidebar_top__item_active">
                  <button aria-label="close navbar" class="navbar-sm_sidebar_top__item_btn" @click="toggleBurgerMenu">
                    <img alt="" src="../assets/close-overlay.png" style="width: 16px; height: 16px;">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ui-form-search_ui_search_box__line"></div>
        <ul class="burger-menu-list">
          <li><a href="/category/clothes">Одежда</a>
          </li>
          <li><a href="/category/accessory">Аксессуары</a>
          </li>
          <li><a @click="() => { this.isBurgerMenuVisible = false; this.$router.push({path: '/brands'}); }">Бренды</a>
          </li>
          <li><a
              @click="() => { this.isBurgerMenuVisible = false; this.$router.push({path: '/customer_service/about'}); }">О
            проекте</a></li>
        </ul>
      </div>
      <div class="nav">
        <div class="menu">
          <ul class="nav-list">
            <li class="nav-item">
              <a class="nav_link" href="/category/clothes">Одежда</a>
              <div :class="{ active: $route.path === '/category/clothes' }" class="line "></div>
              <div class="sub-nav">
                <ul class="nav-list-elements">
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop">
                    <div class="nav-sub_nav">
                      <ul class="nav-list-3">
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/dresses">Платья</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/outerwear">Верхняя одежда</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/denim">Деним</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/blouses_tops">Блузы и топы</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/jeans">Брюки</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/skirts">Юбки</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop">
                    <div class="nav-sub_nav">
                      <ul class="nav-list-3">
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/jackets">Жакеты</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/sweaters_sweatshirts">Свитеры и толстовки</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/sets">Комплекты</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/overalls">Комбинезоны</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/shorts">Шорты</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/swimsuits">Купальники</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav_link" href="/category/accessory">Аксессуары</a>
              <div :class="{ active: $route.path === '/category/accessory' }" class="line"></div>
              <div class="sub-nav">
                <ul class="nav-list-elements">
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop">
                    <div class="nav-sub_nav">
                      <ul class="nav-list-3">
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/bags">Сумки</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/decoration">Украшения</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/belts">Ремни</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/hats">Головные уборы</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop">
                    <div class="nav-sub_nav">
                      <ul class="nav-list-3">
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/gloves_scarves">Перчатки и шарфы</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/glasses">Очки</a>
                        </li>
                        <li class="c-nav__item-3">
                          <a class="nav_link-3" href="/category/socks">Носки</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                  <li aria-hidden="true" class="c-nav__item c-nav__desktop"></li>
                </ul>
              </div>
            </li>
            <li class="nav-item" hidden="">
              <a class="nav_link" @click="this.$router.push({path: '/category/shoes'})">Обувь</a>
              <div :class="{ active: $route.path === '/category/shoes' }" class="line"></div>
            </li>
            <li class="nav-item">
              <a class="nav_link" @click="this.$router.push({path: '/brands'})">Бренды</a>
              <div :class="{ active: $route.path === '/brands' }" class="line"></div>

            </li>
            <li class="nav-item">
              <a class="nav_link" @click="this.$router.push({path: '/customer_service/about'})">О проекте</a>
              <div :class="{ active: $route.path === '/customer_service/about' }" class="line"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="util-container">
        <div class="util">
          <div class="profile" @click="handleProfileClick">
            <img alt="Профиль" src="../assets/user.png">
            <div class="item-text">{{ isAuth ? 'Профиль' : 'Войти' }}</div>
          </div>
          <div class="favourite"><a @click="this.$router.push({name: 'favourite'})">
            <img alt="Избранное" src="../assets/favourite.png">
            <div class="item-text">Избранное</div>
          </a></div>
          <div class="cart"><a @click="this.$router.push({name: 'cart'})">
            <img alt="Корзина" src="../assets/cart.png">
            <div class="item-text">Корзина</div>
            <span v-if="product.length > 0" class="navbar-large_xs_navigation_box_item_indicator"></span>
          </a></div>
        </div>
      </div>

      <ExitModal v-if="$store.state.exitModalOpen" @close="closeExitModal"/>
      <DeleteUserModal v-if="$store.state.deleteUserModalOpen" @close="closeDeleteUserModal"/>

      <FileSizeError v-if="$store.state.FileSizeErrorOpen" @close="closeFileSizeError"/>

      <AuthError v-if="isAuthError" @close="closeAuthError" @open-login-form="openLoginForm"/>
      <AuthorAuthError v-if="isAuthorAuthError" @close="closeAuthorAuthError"/>

      <div :class="{ active: activeForm }" class="login_form_container">
        <div :class="{ active: activeForm }" class="login_form_opacity login_form_opacity_active"
             @click="() => { activeForm = false }"></div>
        <div :class="{ active: activeForm }" class="login-form">
          <LoginForm v-if="activeForm === 'login'" @open="openAuthorAuthError" @close-form="closeForm"/>
          <RegistrationForm v-if="activeForm === 'registration'" @close-form="closeForm"/>
          <ForgotPasswordForm v-if="activeForm === 'forgotPassword'" @close-form="closeForm"/>
          <div class="sidebar-login_switch_box_authorization">
            <div class="sidebar-login_switch_box">
              <span @click="showForm('login')">Авторизация</span>
              <div :class="{ active: activeForm === 'login'}" class="line"></div>
            </div>
            <div class="sidebar-login_switch_box">
              <span @click="showForm('registration')">Регистрация</span>
              <div :class="{ active: activeForm === 'registration'}" class="line"></div>
            </div>
            <div class="sidebar-login_switch_box">
              <span @click="showForm('forgotPassword')">Забыли пароль?</span>
              <div :class="{ active: activeForm === 'forgotPassword'}" class="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{ 'activate': isScrolledDown }" class="scroll-top_scroll_box"><a href="#">
      <img alt="scroll top" class="" src="../assets/up.png" style="width: 16px; height: 16px;">
      <span>TOP</span>
    </a></div>
  </header>
</template>

<style scoped>

.header {
  width: 100%;
  height: 61px;
  border-bottom: 1px solid #000000;
  background-color: #fff;
  position: fixed;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  z-index: 99999;
}

.logo {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* Новое свойство */
  cursor: pointer;
}

.logo a {
  color: black;
  font-size: 24px;
  text-decoration: none;
}

.nav .menu {
  display: flex;
}

.nav-item {
  margin-left: 20px;
  color: black;
  text-transform: uppercase;
}

.nav-list {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav_link {
  cursor: pointer;
  font-size: 15px;
}

.c-nav__item-3 {
  display: block;
  padding: 5px 4px;
  margin: 4px 0;
  position: relative;
  width: 100%;
  max-width: 267px;
  overflow: hidden;
}

.nav_link-3 {
  cursor: pointer;
}

.nav-list-3 {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
}

.sub-nav {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 109;
  min-width: 100%;
  padding: 0;
  text-align: left;
  border: 0;
  border-radius: 0;
  display: block;
  max-height: 1px;
  min-height: 0;
  opacity: 0;
  overflow: hidden;
  visibility: hidden;
  overflow-y: auto;
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  transition: max-height 0s .21s, min-height 0s .21s, opacity .2s linear .2s, visibility 0s .21s;
}

.nav-item:hover .sub-nav,
.sub-nav:hover {
  max-height: 1000px;
  opacity: 1;
  visibility: visible;
  transition-delay: 0s, 0s, 0.2s, 0s;
  overflow-y: auto; /* Разрешаем прокручивание */
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
}


.nav-list-elements {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  background-color: #fff;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.c-nav__item {
  display: block;
  width: 100%;
  border-right: 1px solid #000;
  padding: 0.75rem 0.75rem 1rem;
  min-height: 10vh;
  height: 241px;
  overflow-y: auto;
  border-bottom: 1px solid #000;
}

.util {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.profile,
.favourite,
.cart {
  padding: 0 6px;
  min-width: 78px;
  cursor: pointer;
  position: relative;
}

.navbar-large_xs_navigation_box_item_indicator {
  position: absolute;
  top: 6px;
  left: calc(50% + 15px);
  width: 4px;
  height: 4px;
  background-color: #000;
  border-radius: 50%;
}

.item-text {
  font-size: 12px;
  text-transform: uppercase;
  color: #000;
  display: block;
  text-align: center;
}

img {
  display: block;
  margin: 0 auto;
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 32px;
}

.login_form_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all .2s cubic-bezier(1, 0, 0, 1);
  will-change: transform;
  opacity: 0;
  visibility: hidden;
  pointer-events: auto;
  transform: translateY(0);
  z-index: 20000;
}

.login_form_container.active {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

.login-form {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px; /* Выберите подходящую ширину для вашей формы */
  height: 100%;
  background-color: #fff;
  border: 1px solid #000;
  border-top: none; /* Убираем верхний бордер */
  border-bottom: none;
  padding: 10px;
  z-index: 10;
  transition: -webkit-transform .4s ease;
  transform: translateX(100%);
  will-change: transform, opacity;
}

.login_form_opacity {
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  background-color: rgba(0, 0, 0, .6);
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 10;
  transition: opacity .2s ease .2s;
  will-change: opacity;
  cursor: pointer;

}

.login_form_opacity.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.login-form.active {
  transform: translateX(0);
  transition: -webkit-transform .4s ease-out;
}

h2 {
  font-family: Futura PT, sans-serif;
  font-weight: 400;
  font-size: 1.5em;
}

.sidebar-login_switch_box_authorization {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 40px;
  margin-top: 50px;
  z-index: 3; /* Установите более высокий z-index */

}

.sidebar-login_switch_box {
  position: relative;
  margin: 0 10px;
}

.sidebar-login_switch_box span {
  font-family: Futura PT, sans-serif;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid black;
  will-change: opacity, transform;
  visibility: visible;
  opacity: 0; /* Изначально линия невидима */
  transform-origin: 50% 50%;
  transition: opacity 0.3s ease, transform 0.3s ease; /* Анимация изменения видимости и позиции */
  transform: translateY(-10px);
}

.line.active {
  opacity: 1; /* При активации линия становится видимой */
  transform-origin: 50% 50%;
  transform: translateY(0); /* При активации линия сдвигается вниз под активную форму */
}

@media (max-width: 1200px) {
  .nav .menu {
    display: none;
  }

  .login-form {
    width: 100%;
  }

  .profile {
    display: none;
  }

  .cart .item-text {
    display: none;
  }

  .favourite {
    display: none;
  }

  .burger-icon {
    display: block;
  }

  .util {
    margin-right: 0;
  }
}

@media (min-width: 1200px) {
  .burger-icon {
    display: none;
  }

  .burger-button {
    width: 100%;
  }
}

.burger-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 99999;
  transition: -webkit-transform .4s ease;
  transform: translateX(-100%);
  will-change: transform, opacity;
}

.burger-menu.active {
  transform: translateX(0);
  transition: -webkit-transform .4s ease-out;
}

.burger-icon {
  padding: 0 17px;
  cursor: pointer;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: #000;
  margin: 6px 0;
}

.burger-menu-list {
  list-style: none;
  padding: 20px 0 0 20px;
  text-align: left;

}

.burger-menu-list li {
  margin: 10px 0;
}

.burger-menu-list a {
  text-decoration: none;
  font-size: 20px;
  color: #000;
}

.burger-button {
  padding: 0;
  background-color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #000;
}

.scroll-top_scroll_box {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 40px;
  padding: 4px;
  cursor: pointer;
  font-size: 10px;
  border: none;
  right: 24px;
  bottom: 15px;
  touch-action: none;
  opacity: 0;
  pointer-events: none;
  transform: translateY(100%);
  transition: all .4s ease;
  will-change: transform;
  z-index: 1000;
}

.scroll-top_scroll_box.activate {
  transform: translateY(0);
  pointer-events: auto;
  opacity: 1;
}

.scroll-top_scroll_box span {
  border-bottom: 1px solid #000;
}

.navbar-sm_navbar_small__sidebar_header {
  width: 100%;
  height: 48px;
}

.navbar-sm_navbar_small__sidebar_top {
  width: 100%;
  height: 100%;
  position: sticky;
  top: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
}

.navbar-sm_sidebar_top__item {
  width: 40px;
  height: 40px;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: -webkit-transform .4s ease;
  will-change: transform;
}

.navbar-sm_sidebar_top__item_btn {
  width: 48px;
  position: relative;
  padding: 0;
  margin: 0;
  height: 48px;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.navbar-sm_sidebar_top__item {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.ui-form-search_ui_search_box__line {
  width: 100%;
  height: 1px;
  background-color: #ececec;
  z-index: 2;
  transition: width .3s ease;
  will-change: width;
}
</style>
