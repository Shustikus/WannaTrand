<script>
import $api from "@/http";
import Increment from "@/components/Alert/Increment.vue";
import Decrement from "@/components/Alert/Decrement.vue";

export default {
  components: {Decrement, Increment},
  data() {
    return {
      product: [],
      showError: false,
      showIncrement: false,
      showDecrement: false,
      userData: {
        email: "",
        phone: "",
        birthday: "",
        firstname: "",
        lastname: "",
        middlename: "",
      },
      deliveryInfo: {
        country: "",
        city: "",
        zip_code: "",
        address_line: "",
        house_number: "",
        flat_number: "",
      },
    };
  },
  methods: {
    async loadCart() {
      await $api
          .get(`/cart`)
          .then((response) => {
            this.product = response.data
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async removeItem(product_id, size) {
      await $api
          .delete(`/cart/${product_id}/${size}`)
          .then((response) => {
            console.log(response.data, "товар удален")
            this.loadCart()
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async decrementQuantity(product_id, size, quantity) {
      await $api
          .patch(`/cart/update`, {
            product_id,
            size,
            quantity: quantity - 1,
          })
          .then((response) => {
            if (quantity > 0) {
              console.log(response.data);
              this.loadCart()
              this.showDecrement = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async incrementQuantity(product_id, size, quantity) {
      await $api
          .patch(`/cart/update`, {
            product_id,
            size,
            quantity: quantity + 1,
          })
          .then((response) => {
            console.log(response.data);
            this.loadCart()
            this.showIncrement = true
          })
          .catch((e) => {
            console.log(e)
          })
    },
    validateAndCreateOrder() {
      if (
          !this.userData.phone ||
          !this.userData.firstname ||
          !this.userData.lastname ||
          !this.userData.middlename ||

          !this.deliveryInfo.country ||
          !this.deliveryInfo.city ||
          !this.deliveryInfo.zip_code ||
          !this.deliveryInfo.address_line ||
          !this.deliveryInfo.house_number ||
          !this.deliveryInfo.flat_number
      ) {
        this.showError = true;
      } else {
        this.createOrder();
      }
    },
    async createOrder() {
      await $api
          .put('user/user-info-update', this.userData)
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e)
          })
      await $api
          .post('/order', {
            amount: this.totalCost.replace(/\s/g, ''),
            deliveryInfo: this.deliveryInfo
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      await $api
          .delete('cart/clear')
          .then((response) => {
            console.log(response)
          })
      this.$store.commit('setVisibleSection', 'myOrders');
      this.$router.push({path: '/profile'});
    },
  },
  mounted() {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      this.userData = JSON.parse(savedUserData);
    }
    this.loadCart()
  },
  computed: {
    totalCost() {
      return this.product.reduce((total, productItem) => {
        const productPrice = parseFloat(productItem.Product.price);
        const productQuantity = parseInt(productItem.quantity, 10);
        return total + (productPrice * productQuantity);
      }, 0).toLocaleString("ru-RU");
    },
  },
};
</script>

<template>
  <Increment v-if="showIncrement" @close="showIncrement = false"/>
  <Decrement v-if="showDecrement" @close="showDecrement = false"/>
  <main>
    <div class="scroll-content">
      <div class="  ">
        <div class="page_fit_content">
          <div class="container-cs-c-max">
            <div class="routing_router">
              <div class="routing_router_box">
                <ul class="routing_router_content">
                  <li class="routing_router_items">
                    <a aria-label="site native link" class="cursor-pointer" @click="this.$router.push({path: '/'})">
                      <span class="routing_router_body" content="/">
                        <span content="Главная" itemprop="name">Главная</span>
                      </span>
                    </a>
                    <meta content="1" itemprop="position">
                  </li>
                  <li class="routing_router_items">
                    <a aria-label="site native link" class="cursor-pointer" @click="this.$router.push({path: '/cart'})">
                      <span class="routing_router_body" content="/cart">
                        <span content="Избранное" itemprop="name">Корзина</span>
                      </span>
                    </a>
                    <meta content="2" itemprop="position">
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="">
            <div v-if="product.length === 0" class="w-100 d-flex justify-content-center align-items-center flex-column"
                 style="min-height: 500px; text-align: center;">
              <span>Корзина пуста. Добавьте в корзину хотя бы один товар</span>
            </div>
            <div v-else class="cart_content">
              <div class="cart_bar_form_panel">
                <div class="cart_cart_order_bar_s">
                  <div class="cart_top_head_mb">ДАННЫЕ ЗАКАЗА</div>
                  <div class="cart_block_container">
                    <div class="cart_scroll_container">
                      <div class="cart_order_detail">
                        <div class="cart-step-panel_step_panel">
                          <span class="cart-step-panel_panel_title">Персональные данные</span>
                        </div>
                        <div class="col-12 p-0">
                          <div class="      ">
                            <div class="ui-form-input_ui_form_section">
                              <label class="ui-form-input_ui_form_input_label" for="email">Эл. адрес</label>
                              <div class="ui-form-input_ui_form_input_container">
                                <input id="email" v-model="userData.email" class="ui-form-input_ui_form_input"
                                       disabled="" name="email" type="email">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="cart-block-hide cart-block-show w-100">
                          <div class="cart_column_block">
                            <div class="cart_column_box">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label" for="firstname">Имя</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="firstname" v-model="userData.firstname"
                                           :class="{ 'error': showError && !userData.firstname }"
                                           class="ui-form-input_ui_form_input"
                                           name="firstname" type="text">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="cart_column_box cart_column_box_mr">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label"
                                         for="lastname">Фамилия</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="lastname" v-model="userData.lastname"
                                           :class="{ 'error': showError && !userData.lastname }"
                                           class="ui-form-input_ui_form_input"
                                           name="lastname" type="text"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="cart_column_block">
                            <div class="cart_column_box">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label" for="middlename">Отчество</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="middlename" v-model="userData.middlename"
                                           :class="{ 'error': showError && !userData.middlename }"
                                           class="ui-form-input_ui_form_input"
                                           name="middlename" type="text">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="cart_column_box cart_column_box_mr">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label" for="phone">Телефон</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="phone" v-model="userData.phone"
                                           :class="{ 'error': showError && !userData.phone }"
                                           class="ui-form-input_ui_form_input"
                                           name="phone" type="tel"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="cart-step-panel_step_panel">
                          <span class="cart-step-panel_panel_title">Адрес доставки</span>
                        </div>
                        <div class="col-12 p-0">
                          <div class="      ">
                            <div class="ui-form-input_ui_form_section">
                              <label class="ui-form-input_ui_form_input_label" for="country">Страна</label>
                              <div class="ui-form-input_ui_form_input_container">
                                <input id="country" v-model="deliveryInfo.country"
                                       :class="{ 'error': showError && !deliveryInfo.country }"
                                       class="ui-form-input_ui_form_input"
                                       name="country"
                                       placeholder="Россия"
                                       required type="text">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 p-0">
                          <div class="      ">
                            <div class="ui-form-input_ui_form_section">
                              <label class="ui-form-input_ui_form_input_label" for="city">Город</label>
                              <div class="ui-form-input_ui_form_input_container">
                                <input id="city" v-model="deliveryInfo.city"
                                       :class="{ 'error': showError && !deliveryInfo.city }"
                                       class="ui-form-input_ui_form_input"
                                       name="city" placeholder="Москва"
                                       required type="text">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 p-0">
                          <div class="      ">
                            <div class="ui-form-input_ui_form_section">
                              <label class="ui-form-input_ui_form_input_label" for="zip_code">Почтовый индекс</label>
                              <div class="ui-form-input_ui_form_input_container">
                                <input id="zip_code" v-model="deliveryInfo.zip_code"
                                       :class="{ 'error': showError && !deliveryInfo.zip_code }"
                                       class="ui-form-input_ui_form_input"
                                       name="zip_code" required type="number">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 p-0">
                          <div class="      ">
                            <div class="ui-form-input_ui_form_section">
                              <label class="ui-form-input_ui_form_input_label" for="address_line">Улица</label>
                              <div class="ui-form-input_ui_form_input_container">
                                <input id="address_line" v-model="deliveryInfo.address_line"
                                       :class="{ 'error': showError && !deliveryInfo.address_line }"
                                       class="ui-form-input_ui_form_input"
                                       name="address_line"
                                       required type="address">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="cart-block-hide cart-block-show w-100">
                          <div class="cart_column_block">
                            <div class="cart_column_box">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label" for="house_number">Номер дома</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="house_number" v-model="deliveryInfo.house_number"
                                           :class="{ 'error': showError && !deliveryInfo.house_number }"
                                           class="ui-form-input_ui_form_input"
                                           name="house_number" required type="text">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="cart_column_box cart_column_box_mr">
                              <div class="      ">
                                <div class="ui-form-input_ui_form_section">
                                  <label class="ui-form-input_ui_form_input_label" for="flat_number">Квартира /
                                    офис</label>
                                  <div class="ui-form-input_ui_form_input_container">
                                    <input id="flat_number" v-model="deliveryInfo.flat_number"
                                           :class="{ 'error': showError && !deliveryInfo.flat_number }"
                                           class="ui-form-input_ui_form_input"
                                           name="flat_number" required type="text">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="w-100 mt-5">
                          <button type="submit" @click="validateAndCreateOrder">Заказать</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cart_order_list_container">
                <div class="cart_top_head_mb">СПИСОК ПОКУПОК</div>
                <div class="cart_block_container">
                  <div class="cart_order_list_box">
                    <div class="cart-price-info_cart_price_sm">
                      <div class="cart-price-info_price_box_sm">
                        <div class="cart-price-info_price_total">Итого к оплате</div>
                        <div class="cart-price-info_price_value_total">{{ totalCost }} руб.</div>
                      </div>
                    </div>
                    <div>
                      <div class="cart_products_item" style="height: 100%; overflow-y: hidden;">
                        <div v-for="(productItem, index) in product" :key="index">
                          <div class="cart_product_item_cs">
                            <div class="cart_img_block">
                              <div class="ui-image_ui_image_container">
                                <a :href="`/product/${productItem.Product.id}`">
                                  <img v-if="productItem.Product.Images && productItem.Product.Images.length > 0"
                                       :src="`http://localhost:5000/${productItem.Product.Images[0].img}`" alt=""
                                       class="ui-image_ui_image_placeholder">
                                </a>
                              </div>
                            </div>
                            <div class="cart_info">
                              <div class="cart_info_header">
                                <div class="cart_name">
                                  <div class="cart_name_cs"><a
                                      :href="`/product/${productItem.Product.id}`">{{ productItem.Product.title }}</a>
                                  </div>
                                </div>
                                <div class="cart_large_icon_close">
                                  <div class="cart_remove" title="Удалить"
                                       @click="removeItem(productItem.Product.id, productItem.size)">&times;
                                  </div>
                                </div>
                              </div>
                              <!--<div><h5 class="cart_product_color">{{Цвет}}</h5></div> -->
                              <div class="cart_params">
                                <div v-if="productItem.Product.Brand" class="cart_template_sign_info">
                                  <span>Бренд: </span>
                                  <span>{{ productItem.Product.Brand.brand_title }}</span>
                                </div>
                                <div class="cart_product_bottom_info">
                                  <div>
                                    <span>Размер: </span>
                                    <span>{{ productItem.size }}</span>
                                  </div>
                                  <div class="cart_info_qty">
                                    <div class="cart_qty_value">Кол-во</div>
                                    <div class="cart_cart_count">
                                      <button :disabled="productItem.quantity === 1" aria-label="remove item"
                                              class="cart_btn_count"
                                              title="Уменьшить"
                                              type="button"
                                              @click="decrementQuantity(productItem.Product.id, productItem.size, productItem.quantity)">
                                        <img alt="remove" src="../assets/arrow-left.png"
                                             style="width: 8px; height: 8px;">
                                      </button>
                                      <div class="cart_value_count">{{ productItem.quantity }}</div>
                                      <button class="cart_btn_count" title="Увеличить"
                                              type="button"
                                              @click="incrementQuantity(productItem.Product.id, productItem.size, productItem.quantity)">
                                        <img alt="add" src="../assets/arrow-right.png" style="width: 8px; height: 8px;">
                                      </button>
                                    </div>
                                  </div>
                                  <div class="cart_info_price">
                                    <div class="cart_price">
                                      {{ Math.floor(productItem.Product.price).toLocaleString("ru-RU") }} руб.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scroll-content {
  margin-top: 71px;
}

.page_fit_content {
  min-height: 640px;
}

.container-cs-c-max {
  width: 100%;
  max-width: 2560px;
  height: 100%;
  margin: 0 auto;
}

.routing_router {
  width: 100%;
  height: 100%;
  position: relative;
}

.routing_router_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 15px 0;
}

.routing_router_content {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}

.routing_router_items {
  position: relative;
}

.routing_router_body {
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  transition: color .3s cubic-bezier(.42, .1, 1, 1);
  cursor: pointer;
}

.routing_router_items:after {
  content: "/";
  padding: 0 5px;
  font-size: 10px;
}

.routing_router_items:last-child:after {
  content: none; /* Удаляем символ "/" */
  padding-right: 0; /* Удаляем отступ справа */
}

.cart_content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
}

.cart_bar_form_panel {
  flex-grow: 1;
  padding-right: 7.639vw;
}

.cart_order_list_container {
  width: 38.11110044vw;
  padding-right: 2vw;
  padding-left: 1.37347098vw;
}

.cart_cart_order_bar_s {
  padding-left: 23px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 46.00781696vw;
  align-self: stretch;
}

.cart_top_head_mb {
  margin-bottom: 20px;
  text-transform: uppercase;
  display: block;
  padding: 4px;
  border-bottom: 1px solid #ececec;
}

.cart_order_list_box {
  padding-top: 50px;
}

.cart_products_item {
  padding: 1.667vw 0;
}

.cart_product_item_cs {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin-bottom: 1.667vw;
}

.cart_img_block {
  width: 20%;
  align-self: flex-start;
  position: relative;
  min-width: 105px;
  -webkit-margin-end: 1.37334597vw;
  margin-inline-end: 1.37334597vw;
}

.cart_info {
  width: 80%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.ui-image_ui_image_container {
  width: 100% !important;
  height: auto;
  min-width: 105px;
  display: block;
  cursor: pointer;
  position: relative;
}

.ui-image_ui_image_placeholder {
  width: 100%;
  height: auto;
  display: block;
}

.cart_info_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 5px;
}

.cart_name {
  font-size: 14px;
  font-weight: 400;
  color: #000;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.cart_name_cs {
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.cart_large_icon_close {
  display: flex;
}

.cart_remove {
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.cart_params {
  width: 100%;
  height: auto;
  margin-top: 2.5vw;
}

.cart_template_sign_info {
  width: 100%;
  height: auto;
  margin-bottom: 2px;
}

.cart_product_bottom_info {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.cart_info_qty {
  margin-left: 2.222vw;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cart_qty_value {
  margin-right: 10px;
}

.cart_cart_count {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.cart_btn_count {
  background-color: transparent;
  width: 20px;
  height: 20px;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: default; /* Устанавливаем курсор в виде стрелки */
  /* Добавляем стили при наведении, если кнопка активна (не выключена) */

  &:not(:disabled):hover {
    cursor: pointer; /* Устанавливаем курсор в виде стрелки */
  }
}

.cart_value_count {
  padding: 0 6px;
}

.cart_product_color {
  color: #a4a4a4;
  margin: 0;
  font-weight: 400;
  font-size: .8rem;
}

.cart_info_price {
  flex: 1 1;
  text-align: right;
  font-size: 1rem;
  line-height: 2rem;
  letter-spacing: .2em;
  font-weight: 500;
  text-transform: uppercase;
  width: 100%;
}

.cart_price {
  display: block;
  font-weight: 500;
}

.cart-price-info_cart_price_sm {
  margin-bottom: 1.667vw !important;
}

.cart-price-info_price_box_sm {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: center;
  margin-bottom: 0.833vw;
}

.cart-price-info_price_total {
  display: block;
  font-size: .8rem;
  line-height: 2.4rem;
  letter-spacing: .2em;
  font-weight: 500;
  text-transform: uppercase;
}

.cart-price-info_price_value_total {
  display: block;
  font-size: 1.5rem;
  line-height: 2.4rem;
  letter-spacing: .15em;
  font-weight: 500;
  text-transform: uppercase;
}

.cart_scroll_container {
  width: 100%;
  height: 100%;
  margin-top: 70px;
}

.cart_order_detail {
  width: 100%;
  height: auto;
  position: relative;
  margin-bottom: 3.4rem;
}

.cart-step-panel_step_panel {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: .04em;
}

.cart-step-panel_panel_title {
  margin-right: 14px;
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

.cart-block-hide {
  opacity: 1;
  visibility: visible;
  position: relative;
  z-index: 100;
  height: auto;
}

.cart-block-show {
  opacity: 1;
  visibility: visible;
  position: relative;
  z-index: 100;
  height: auto;
}

.cart_column_block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
}

.cart_column_box {
  width: 100%;
  max-width: 100%;
}

.cart_column_box_mr {
  margin-left: 1.389vw;
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

.error {
  border-bottom: 1px solid #f64747 !important;;
}

@media screen and (max-width: 1024px) {
  .cart_content {
    flex-direction: column-reverse;
    flex-wrap: wrap;
  }

  .cart_bar_form_panel {
    padding: 0;
    width: 100%;
  }

  .cart_order_list_container {
    width: 100% !important;
    padding: 0 !important;
    margin-bottom: 3rem;
  }

  .cart_cart_order_bar_s {
    width: 100% !important;
    padding: 0;
  }

  .cart_block_container {
    padding: 0 10px;
  }

  .cart_product_item_cs .cart_info {
    width: 100%;
    max-width: 768px;
    display: block;
  }

  .cart_info_price {
    text-align: left;
  }
}

@media screen and (max-width: 996px) {
  .cart_content .cart_top_head_mb {
    padding: 4px 10px;
  }

  .cart_product_item_cs .cart_img_block {
    width: 90px;
  }
}

@media screen and (max-width: 768px) {
  .cart_content .cart_order_list_container .cart_order_list_box {
    padding-top: 30px;
  }

  .cart_product_item_cs .cart_info .cart_product_bottom_info {
    display: block;
  }

  .cart_product_item_cs .cart_info .cart_product_bottom_info .cart_info_qty {
    margin-left: 0;
  }

  .cart_scroll_container {
    margin-top: 0 !important;
  }
}
</style>