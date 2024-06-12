<script>
import $api from "@/http";
import dayjs from "dayjs";


export default {
  data() {
    return {
      products: {},
      orders: {},
      brands: {},
      selectedTab: 'products',
    };
  },
  methods: {
    async fetchData() {
      try {
        // Получить продукты
        const productsResponse = await $api.get(`/product/all`);
        this.products = productsResponse.data;

        // Получить заказы
        const ordersResponse = await $api.get(`/order/all`);
        this.orders = ordersResponse.data;

        // Получить бренды
        const brandsResponse = await $api.get(`/brand/all`);
        this.brands = brandsResponse.data;

      } catch (e) {
        console.error('Ошибка при загрузке данных:', e);
      }
    },
    async AcceptBrand(BrandItem) {
      const userId = BrandItem.user_id
      $api.patch(`/user/accept`, {userId})
          .then((response) => {
            this.fetchData()
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async updateOrderStatus(orderItem) {
      const orderId = orderItem.order.id;
      const newStatus = orderItem.order.status;
      $api
          .patch('/order/update', {orderId, status: newStatus})
          .then((response) => {
            console.log(response)
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async updateTrackingNumber(orderItem) {
      const orderId = orderItem.order.id;
      let newTrackingNumber = orderItem.order.tracking_number;
      // If newTrackingNumber is empty, set it to null
      newTrackingNumber = newTrackingNumber.trim() === '' ? null : newTrackingNumber;
      $api
          .patch('/order/update/tracking_number', {orderId, tracking_number: newTrackingNumber})
          .then((response) => {
            console.log(response)
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async toggleProductVisibility(ProductItem) {
      await $api
          .put('/product', {productId: ProductItem.id})
          .then((response) => {
            console.log(response.data)
            this.fetchData()
          })
    },
    async deleteProduct(ProductItem) {
      try {
        // Удаляем все изображения продукта
        await $api.delete('/image/deleteAll', {data: {product_id: ProductItem.id}});

        // Удаляем сам продукт
        const response = await $api.delete(`/product`, {data: {id: ProductItem.id}});
        console.log(response);
        await this.fetchData()
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm'); // Измените формат, как вам необходимо
    },
    toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
    },
    getStatusIconClass(status) {
      const statusMap = {
        'создан': 'status-icon-gray',
        'отправлен': 'status-icon-orange',
        'доставлен': 'status-icon-green',
        'отменен': 'status-icon-red',
      };
      return statusMap[status] || '';
    },
  },
  mounted() {
    this.fetchData()
  }
};
</script>

<template>
  <div class="my-profile_my_container_box_max">
    <div class="my-top-navigation_my_top_nav">
      <div class="my-top-navigation_my_top_nav_box">
        <div class="my-top-navigation_my_top_nav_item" @click="selectedTab = 'products'">
          <span>Товары</span>
          <div :class="{ active: selectedTab === 'products' }" class="line"></div>
        </div>
      </div>
      <div class="my-top-navigation_my_top_nav_box">
        <div class="my-top-navigation_my_top_nav_item" @click="selectedTab = 'orders'">
          <span>Заказы</span>
          <div :class="{ active: selectedTab === 'orders' }" class="line"></div>
        </div>
      </div>
      <div class="my-top-navigation_my_top_nav_box">
        <div class="my-top-navigation_my_top_nav_item" @click="selectedTab = 'brands'">
          <span>Бренды</span>
          <div :class="{ active: selectedTab === 'brands' }" class="line"></div>
        </div>
      </div>
    </div>
    <table v-if="selectedTab === 'brands'">
      <thead>
      <tr>
        <th>№</th>
        <th>Почта</th>
        <th>Название бренда</th>
        <th>Описание</th>
        <th style="max-width: 100px">ФИО и контакты представителя бренда</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(BrandItem, index) in brands" :key="index" style="height: 50px">
        <td>{{ BrandItem.id }}</td>
        <td>{{ BrandItem.User.email }}</td>
        <td>{{ BrandItem.brand_title }}</td>
        <td>
          <div style="max-width: 300px; word-wrap: break-word;overflow: hidden;">
            <span>{{ BrandItem.brand_description }}</span>
          </div>
        </td>
        <td>
          <div style="max-width: 300px; word-wrap: break-word;overflow: hidden;">
            <span>{{ BrandItem.brand_representativeInfo }}</span>
          </div>
        </td>
        <td v-if="!BrandItem.User.isActivated" style="cursor: pointer" @click="this.AcceptBrand(BrandItem)">
          <button>Добавить</button>
        </td>
        <td v-else style="cursor: pointer" @click="this.AcceptBrand(BrandItem)">
          <button>Скрыть</button>
        </td>
      </tr>
      </tbody>
    </table>
    <table v-if="selectedTab === 'products'">
      <thead>
      <tr>
        <th>Фото</th>
        <th>Бренд</th>
        <th>Категория</th>
        <th>Название</th>
        <th>Цена</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(ProductItem, index) in products" :key="index">
        <td style="width: 0">
          <div class="cart_product_item_cs">
            <div class="edit_product"><a :href="`/product/${ProductItem.id}/edit`">редактировать</a></div>
            <div class="cart_img_block">
              <div class="ui-image_ui_image_container">
                <img :src="`http://localhost:5000/${ProductItem.Images[0].img}`" alt=""
                     class="ui-image_ui_image_placeholder">
              </div>
            </div>
          </div>
        </td>
        <td>{{ ProductItem.Brand ? ProductItem.Brand.brand_title : null }}</td>
        <td>{{ ProductItem.Category.name }}</td>
        <td>{{ ProductItem.title }}</td>
        <td>{{ Math.floor(ProductItem.price).toLocaleString("ru-RU") }}</td>
        <td>
          <div class="" style="display: flex; flex-direction: column; cursor: pointer">
            <button v-if="ProductItem.isHidden === false" @click="toggleProductVisibility(ProductItem)">Скрыть</button>
            <button v-else @click="toggleProductVisibility(ProductItem)">Отобразить</button>
            <button @click="deleteProduct(ProductItem)">Удалить</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="selectedTab === 'orders'" class="order_container">
      <div class="asdas">
        <div class="info-label">№ заказа</div>
        <div class="info-label">Дата</div>
        <div class="info-label"></div>
        <div class="info-label">Статус</div>
        <div class="info-label"></div>
        <div class="info-label">Сумма</div>
        <div class="info-label"></div>
      </div>
      <ul class="order-list">
        <li v-for="(orderItem, index) in orders" :key="index" class="order-item">
          <div class="order-info">
            <span>{{ orderItem.order.id }}</span>
            <span>{{ formatDate(orderItem.order.createdAt) }}</span>
            <div class="status-with-icon">
              <span :class="getStatusIconClass(orderItem.order.status)"></span>
              <span>заказ {{ orderItem.order.status }}</span>
              <div class="status-dropdown">
                <select v-model="orderItem.order.status" @change="updateOrderStatus(orderItem)">
                  <option value="создан">создан</option>
                  <option value="отправлен">отправлен</option>
                  <option value="доставлен">доставлен</option>
                  <option value="отменен">отменен</option>
                </select>
              </div>
            </div>
            <span>{{ Math.floor(orderItem.order.amount).toLocaleString("ru-RU") }} руб.</span>
            <button @click="toggleOrderDetails(orderItem)"><img
                :src="orderItem.showDetails ? '/assets/up.png' : '/assets/down.png'"
                alt=""
                style="width: 20px; height: 20px"></button>
          </div>
          <div v-show="orderItem.showDetails" class="order-details">
            <ul class="product-list">
              <li v-for="(orderProduct, index) in orderItem.products" :key="index">
                <div class="cart_products_item" style="height: 100%; overflow-y: hidden;">
                  <div class="cart_product_item_cs">
                    <div class="cart_img_block">
                      <div class="ui-image_ui_image_container">
                        <a :href="`/product/${orderProduct.Product.id}`">
                          <img v-if="orderProduct.Product.Images && orderProduct.Product.Images.length > 0"
                               :src="`http://localhost:5000/${orderProduct.Product.Images[0].img}`" alt=""
                               class="ui-image_ui_image_placeholder">
                        </a>
                      </div>
                    </div>
                    <div class="cart_info">
                      <div class="cart_info_header">
                        <div class="cart_name">
                          <div class="cart_name_cs">
                            <a :href="`/product/${orderProduct.Product.id}`">{{ orderProduct.Product.title }}</a></div>
                        </div>
                      </div>
                      <div class="cart_params">
                        <div v-if="orderProduct.Product.Brand" class="cart_template_sign_info">
                          <span>Бренд: </span>
                          <span>{{ orderProduct.Product.Brand.brand_title }}</span>
                        </div>
                        <div class="cart_product_bottom_info">
                          <div>
                            <span>Размер: </span>
                            <span>{{ orderProduct.size }}</span>
                          </div>
                          <div class="cart_info_qty">
                            <div class="cart_qty_value">Кол-во</div>
                            <div class="cart_cart_count">
                              <div class="cart_value_count">{{ orderProduct.quantity }}</div>
                            </div>
                          </div>
                          <div class="cart_info_price">
                            <div class="cart_price">{{ Math.floor(orderProduct.Product.price).toLocaleString("ru-RU") }}
                              руб.
                            </div>
                          </div>
                          <div v-for="(orderItem, index) in orders" :key="index" class="customer_info">
                            <div class="customer_info_detail">Для связи с клиентом:</div>
                            <div class="customer_info_detail">{{ orderItem.order.User.phone }}
                              {{ orderItem.order.User.lastname }}
                              {{ orderItem.order.User.firstname }} {{ orderItem.order.User.middlename }}
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
                  <input v-model="orderItem.order.tracking_number" @change="updateTrackingNumber(orderItem)"/>
                </div>
                <div class="delivery_item">
                  <span>Способ оплаты:</span>
                  <span class="delivery_item_span">При получении товара</span>
                </div>
              </div>
              <div class="delivery_item">
                <span>Страна:</span>
                <span>{{ orderItem.order.Order_delivery.country }}</span>
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
  </div>
</template>

<style scoped>

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
}

.ui-image_ui_image_container {
  width: 100% !important;
  height: auto;
  min-width: 105px;
  display: block;
  position: relative;
}

.ui-image_ui_image_placeholder {
  width: 100%;
  height: auto;
  display: block;
}

table {
  margin-top: 20px;
  text-align: center;
  border-spacing: 10px;
  width: 100%;
}

th,
td {
  border-bottom: 1px solid black;

}

.edit_product {
  cursor: pointer;
  writing-mode: vertical-rl;
  rotate: 180deg;
  user-select: none;
}

.order_container {
  margin-top: 20px;
}

.customer_info {
  flex: 1 1;
  text-align: start;
  font-size: 1rem;
  text-transform: uppercase;
  width: 100%;
}
</style>