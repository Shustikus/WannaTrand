<script>
import $api from "@/http";

export default {
  data() {
    return {
      favouriteProducts: []
    };
  },
  methods: {
    async loadFavouriteProducts() {
      await $api
          .get('/favourite')
          .then((response) => {
            this.favouriteProducts = response.data;
          })
          .catch((e) => {
            console.error("Ошибка при загрузке избранных продуктов:", e);
          })
    },
    async removeFromFavourites(product) {
      await $api
          .post('/favourite/remove', {product_id: product.Product.id})
          .then((response) => {
            console.log('Продукт удален из избранного', response.data);
            this.removeFromLocalStorage(product);
            this.loadFavouriteProducts();
          })
          .catch((e) => {
            console.log("Ошибка при удалении продукта из избранного:", e)
          })
    },
    removeFromLocalStorage(product) {
      // Удалите продукт из localStorage
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      const updatedFavorites = favoriteProducts.filter((favProduct) => favProduct.id !== product.Product.id);
      localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    },
  },
  mounted() {
    this.loadFavouriteProducts();
  },
};
</script>

<template>
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
                    <a aria-label="site native link" class="cursor-pointer" @click="this.$router.push({path: '/favourite'})">
                      <span class="routing_router_body" content="/favourite">
                        <span content="Избранное" itemprop="name">Избранное</span>
                      </span>
                    </a>
                    <meta content="2" itemprop="position">
                  </li>
                </ul>
              </div>
            </div>
            <div class="product-container">
              <link content="/favorite" href="//favorite" itemprop="url">
              <div v-if="favouriteProducts.length > 0" class="scroll-component">
                <div v-for="product in favouriteProducts" :key="product.id" class="catalog-card">
                  <div class="catalog-card-trigger">
                    <div class="catalog-card_catalog_card_main_img">
                      <div class="catalog-card_catalog_card_image">
                        <!-- Вставляем ссылку на страницу товара -->
                        <a :href="`/product/${product.Product.id}`" class="cursor-pointer">
                          <div :content="`/product/${product.Product.id}`" class="catalog-card_images_section_link"
                               itemprop="url">
                            <!-- Отобразите изображение продукта -->
                            <img :src="`http://localhost:5000/${product.Product.Images[0].img}`" alt="Product Image"/>
                          </div>
                        </a>
                      </div>
                      <button aria-label="favorite" class="catalog-card_catalog_card_favorite" type="submit"
                              @click="removeFromFavourites(product)">
                        <i class="catalog-card_catalog_card_favorite_dislike"></i>
                      </button>
                    </div>
                    <div class="catalog-card_catalog_card_info">
                      <!-- Вставляем название и цену товара -->
                      <a :href="`/product/${product.Product.id}`" class="cursor-pointer">
                        <div class="catalog-card_catalog_card_info_body">
                          <div :content="product.Product.title" class="catalog-card_catalog_card_info_body_title"
                               itemprop="name">
                            {{ product.Product.title }}
                          </div>
                          <div class="catalog-card_catalog_card_info_body_price">
                            {{ Math.floor(product.Product.price).toLocaleString("ru-RU") }} руб.
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="w-100 d-flex justify-content-center align-items-center flex-column"
                     style="min-height: 500px;"><br><br><a href="/"><img alt="..." src="../assets/favourite.png"
                                                                         style="width: 64px; height: 64px;"></a><br>
                  <div class="text-center">Добавляйте любимые товары в избранное, чтобы не потерять их</div>
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

.scroll-component {
  height: auto;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-flow: wrap;
  margin-top: 10px;
}

.catalog-card {
  padding-right: 0 !important;
  padding-left: 0 !important;
  flex: 0 0 auto;
  width: 33.33333333%;
}

.catalog-card-trigger {
  min-height: 664.406px;
  width: 100%;
  position: relative;
  display: block;
  padding: 3px;
  margin-bottom: 30px;
}

.catalog-card_catalog_card_main_img {
  width: 100%;
  /* Установите фиксированную высоту для контейнера изображения */
  height: 840px; /* Замените на желаемую высоту */
  position: relative;
  z-index: 20;
  overflow: hidden;
}

.catalog-card_catalog_card_info {
  position: relative;
  z-index: 10;
  padding: 0 10px;
  text-align: center;
}

.catalog-card_catalog_card_image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.catalog-card_catalog_card_image img {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%; /* Изображение займет всю ширину контейнера */
  height: auto; /* Изображение будет автоматически масштабироваться с сохранением пропорций */
  object-fit: cover; /* Изображение будет подогнано под размеры контейнера с сохранением пропорций */
}

.catalog-card_images_section_link {
  display: flex;
  position: absolute;
  justify-content: space-between;
  flex-direction: row;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.catalog-card_catalog_card_favorite {
  position: absolute;
  top: 10px;
  left: 5px;
  z-index: 30;
  cursor: pointer;
  border: none;
  border-radius: 0;
  background-color: transparent;
  opacity: .5;
  transition: opacity .3s ease;
}

.catalog-card_catalog_card_favorite_dislike {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 26px;
  background-image: url(../assets/like-action.png);
  width: 26px;
  height: 26px;
  display: block;
  transition: background-image .5s ease;
}

.catalog-card_catalog_card_info_body_title {
  margin-top: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 400;
}

.catalog-card_catalog_card_info_body_price {
  margin-top: 3px;
  font-weight: 600;

}
@media screen and (max-width: 1400px) {
  .catalog-card {
    width: 50%;
  }
}

@media screen and (max-width: 769px) {
  .catalog-card {
    width: 100%;
  }
}

</style>