<script>
import $api from "@/http";
import dayjs from 'dayjs';

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
    },
    async loadOrders() {
      $api
          .get('/order')
          .then((response) => {
            this.orders = response.data
          })
          .catch((e) => {
            console.log(e)
          })
    },
    formatDate(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm'); // Измените формат, как вам необходимо
    },
    getStatusIconClass(status) {
      if (status === 'создан') {
        return 'status-icon-gray'; // Красный кружок
      } else if (status === 'отправлен') {
        return 'status-icon-orange'; // оранжевый кружок
      } else if (status === 'доставлен') {
        return 'status-icon-green'; // Зеленый кружок
      } else if (status === 'отменен') {
        return 'status-icon-red'; // Зеленый кружок
      } else {
        return ''; // Пустой класс для других статусов
      }
    },
  },
  mounted() {
    this.loadOrders()
  }
}

</script>

<template>
  <div class="my-profile_my_container_box_min">
    <div v-if="orders.length >0" class="asdas">
      <div class="info-label">№ заказа</div>
      <div class="info-label">Дата</div>
      <div class="info-label"></div>
      <div class="info-label">Статус</div>
      <div class="info-label"></div>
      <div class="info-label">Сумма</div>
      <div class="info-label"></div>
    </div>
    <div v-else>
      <div class="w-100 d-flex justify-content-center align-items-center flex-column">
        <br><br><a href="/"><img alt="..." src="../../../assets/favourite.png"
                                 style="width: 64px; height: 64px;"></a><br>
        <div class="text-center">Соберите свой первый заказ, перейдя в каталог.</div>
      </div>
    </div>
    <ul class="order-list">
      <li v-for="(orderItem, index) in orders" :key="index" class="order-item">
        <div class="order-info">
          <span>{{ orderItem.order.id }}</span>
          <span>{{ formatDate(orderItem.order.createdAt) }}</span>
          <div class="status-with-icon">
            <span :class="getStatusIconClass(orderItem.order.status)"></span>
            <span>заказ {{ orderItem.order.status }}</span>
          </div>
          <span>{{ Math.floor(orderItem.order.amount).toLocaleString("ru-RU") }} руб.</span>
          <button @click="toggleOrderDetails(orderItem)"><img
              :src="orderItem.showDetails ? '/src/assets/up.png' : '/src/assets/down.png'"
              style="width: 20px; height: 20px"
          > <!-- dasda -->
          </button>
        </div>
        <div v-show="orderItem.showDetails" class="order-details">
          <ul class="product-list">
            <li v-for="product in orderItem.products" :key="product.id">
              <div class="cart_products_item" style="height: 100%; overflow-y: hidden;">
                <div class="cart_product_item_cs">
                  <div class="cart_img_block">
                    <div class="ui-image_ui_image_container">
                      <a :href="`/product/${product.Product.id}`">
                        <img v-if="product.Product.Images && product.Product.Images.length > 0"
                             :src="`http://localhost:5000/${product.Product.Images[0].img}`" alt=""
                             class="ui-image_ui_image_placeholder">
                      </a>
                    </div>
                  </div>
                  <div class="cart_info">
                    <div class="cart_info_header">
                      <div class="cart_name">
                        <div class="cart_name_cs">
                          <a :href="`/product/${product.Product.id}`">{{ product.Product.title }}</a></div>
                      </div>
                    </div>
                    <div class="cart_params">
                      <div v-if="product.Product.Brand" class="cart_template_sign_info">
                        <span>Бренд: </span>
                        <span>{{ product.Product.Brand.brand_title }}</span>
                      </div>
                      <div class="cart_product_bottom_info">
                        <div>
                          <span>Размер: </span>
                          <span>{{ product.size }}</span>
                        </div>
                        <div class="cart_info_qty">
                          <div class="cart_qty_value">Кол-во</div>
                          <div class="cart_cart_count">
                            <div class="cart_value_count">{{ product.quantity }}</div>
                          </div>
                        </div>
                        <div class="cart_info_price">
                          <div class="cart_price">{{ Math.floor(product.Product.price).toLocaleString("ru-RU") }} руб.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="orderItem.showDetails" class="delivery_info">
            <div class="delivery_title">
              <span>Доставка</span>
            </div>
            <div class="delivery_cdek">
              <div class="delivery_icon">
                <img alt="" class="delivery_icon_placeholder" src="../../../assets/cdek.jpg">
              </div>
              <div class="delivery_item">
                <span>Трек номер:</span>
                <span v-if="orderItem.order.tracking_number">
                     <a :href="`https://www.cdek.ru/ru/tracking/?order_id=${orderItem.order.tracking_number}`"
                        class="delivery_link" target="_blank">{{ orderItem.order.tracking_number }}</a></span>
                <span v-else>-</span>
              </div>
              <div class="delivery_item">
                <span>Способ оплаты:</span>
                <span class="delivery_item_span">При получении товара</span>
              </div>
            </div>
            <div class="delivery_item">
              <span>Страна:</span>
              <span class="delivery_item_span">{{ orderItem.order.Order_delivery.country }}</span>
            </div>
            <div class="delivery_item">
              <span>Город:</span>
              <span class="delivery_item_span">{{ orderItem.order.Order_delivery.city }}</span>
            </div>
            <div class="delivery_item">
              <span>Индекс:</span>
              <span class="delivery_item_span">{{ orderItem.order.Order_delivery.zip_code }}</span>
            </div>
            <div class="delivery_item">
              <span>Адрес:</span>
              <span class="delivery_item_span">{{ orderItem.order.Order_delivery.address_line }}
                      {{ orderItem.order.Order_delivery.house_number }},
                      кв.{{ orderItem.order.Order_delivery.flat_number }}</span>
            </div>
            <div class="delivery_item">
              <span>Тип доставки:</span>
              <span class="delivery_item_span">{{ orderItem.order.Order_delivery.delivery_type }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.my-profile_my_container_box_min {
  width: 100%;
  margin: 0 auto;
  padding: 10px 10px;
}

.asdas {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Добавить выравнивание по вертикали */
  padding: 5px 0;
  width: 91%;
}

.order-list {
  list-style: none;
  padding: 0;
}

.order-item {
  border-top: 1px solid rgb(0 0 0 / 5%);
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.product-list {
  list-style: none;
  padding: 0;
}

.product-list.show {
  display: block;
}

.product-list li {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  padding: 30px;
}

button {
  padding: 7px 10px;
  font-weight: 500;
  border: 0;
  position: relative;
  opacity: 1;
  background: white;
  color: #2e3131;
}

.cart_product_item_cs {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
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
  /*width: 80%; */
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
  flex-direction: column;
  display: flex;
  align-items: start;
}

.cart_info_qty {
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

.cart_value_count {
  padding: 0 6px;
}

.cart_info_price {
  flex: 1 1;
  text-align: start;
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

.order-details {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  border-top: 1px solid rgb(0 0 0 / 5%);
  border-bottom: 1px solid rgb(0 0 0 / 5%);
}

.delivery_info {
  border: 1px solid black;
  padding: 20px;
  max-width: 300px;
  height: auto;
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.delivery_title {
  border-bottom: 1px solid rgb(0 0 0 / 5%);
  width: 100%;
  display: flex;
  margin-bottom: 5px;
  padding-bottom: 3px;
}

.delivery_icon {
  width: 100%;
  display: flex;
  align-items: center;
}

.delivery_icon_placeholder {
  width: 30%;
}

.delivery_cdek {
  border-bottom: 1px solid rgb(0 0 0 / 5%);
  width: 100%;
}

.delivery_item_span {
  text-align: right;
}

.delivery_item {
  display: flex;
  justify-content: space-between;
}

.delivery_link {
  color: rgb(13, 110, 253);
  text-decoration: underline;
}

@media screen and (max-width: 776px) {
  .order-details {
    display: block;
  }

  .delivery_info {
    margin-right: auto;
  }
}

.status-icon-gray::before {
  content: "⚪"; /* Красный кружок */
  margin: 0 4px 0 0;
}

.status-icon-red::before {
  content: "\1F534"; /* Красный кружок */
  margin: 0 4px 0 0;
}


.status-icon-green::before {
  content: "\1F7E2"; /* Зеленый кружок */
  margin: 0 4px 0 0;
}

.status-icon-orange::before {
  content: "\1F7E0"; /* Оранжевый кружок */
  margin: 0 4px 0 0;
}
</style>