<script>
import store from "@/store/store";
import $api from "@/http";

export default {
  methods: {
    closeModal() {
      // Закрыть модальное окно
      this.$emit('close'); // Генерируем событие для родительского компонента
    },
  },
};
</script>

<template>
  <div class="modal_container modal_container_active">
    <div class="modal_container_opacity modal_container_opacity_active" @click="closeModal"></div>
    <div class="modal_container_content">
      <i class="modal_container_close_icon" @click="closeModal"></i>
      <div class="modal_container_content_box">
        <div class="modal_container_content_title">
          Аккаунт Дизайнера не активирован. Вход невозможен. Ожидайте модерации.
        </div>
        <div class="modal_container_content_action_place">
          <div class="modal_container_content_action_place_confirm">
            <button class="ui-button_ui_button" type="button" @click="closeModal">
              <span>Выход</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
  transition: all .5s cubic-bezier(1, 0, 0, 1);
  will-change: transform;
  z-index: 20000;
}

.modal_container_active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.modal_container_opacity {
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  background-color: rgba(0,0,0,.6);
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 10;
  transition: opacity .4s ease .4s;
  will-change: opacity;
}

.modal_container_opacity_active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.modal_container_content {
  margin: 110px auto 0; /* для телефонов 50% 0; */
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  padding: 15px 30px;
  position: relative;
  z-index: 10;
  border: 1px solid rgb(0 0 0 / 5%)
}

.modal_container_close_icon {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  display: block;
  cursor: pointer;
  background-image: url(../../assets/close-overlay.png);
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: 50%;
  transition: -webkit-transform .4s ease;
  transition: transform .4s ease;
  transition: transform .4s ease, -webkit-transform .4s ease;
  will-change: transform;
  z-index: 10;
}

.modal_container_content_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal_container_content_title {
  padding: 20px 0;
  width: 100%;
  text-align: center;
}

.modal_container_content_action_place {
  display: flex;
  padding: 20px;
  align-items: center;
}

.modal_container_content_action_place_confirm {
  min-width: 60px;
}

.ui-button_ui_button {
  padding: 5px 10px;
  height: auto;
  width: 100%;
  font-weight: 500;
  border: 1px solid #2e3131;
  overflow: hidden;
  position: relative;
  opacity: 1;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Добавляем анимацию */
  background: white;
  color: #2e3131;
}

.ui-button_ui_button:hover {
  background-color: #2e3131; /* Изменяем цвет при наведении */
  color: #fff; /* Изменяем цвет текста при наведении */
  transform: scale(1.05); /* Увеличиваем размер кнопки при наведении */
}

.modal_container_content_action_place_cancel {
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  background: none;
  text-transform: uppercase;
  margin: 0 15px;
  cursor: pointer;
  transition: color .3s ease;
}
</style>
