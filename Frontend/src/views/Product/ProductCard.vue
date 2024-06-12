<script>
import $api from "@/http";

export default {
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async fetchCategoryId() {
      const category_name_en = this.$route.params.name_en; // Получаем category_name_en из маршрута
      let parent_id; // Инициализируем parent_id
      // Проверяем, является ли текущая категория "clothes" или "accessory"
      if (category_name_en === 'clothes') {
        parent_id = 1; // Устанавливаем parent_id для одежды
      } else if (category_name_en === 'accessory') {
        parent_id = 2; // Устанавливаем parent_id для аксессуаров
      } else {
        await $api.get(`/category/convert/${category_name_en}`)
            .then((response) => {
              const category_id = response.data.id; // Получаем category_id на основе category_name_en
              return this.fetchProducts(category_id); // Иначе загружаем продукты для указанной категории
            })
            .catch((error) => {
              console.error("Ошибка при получении категории:", error);
            });
      }
      // Вызываем метод для загрузки продуктов на основе parent_id, если parent_id определен
      if (parent_id !== undefined) {
        await this.fetchProductsByParentId(parent_id);
      }
    },
    async fetchProducts(category_id) {
      await $api
          .get(`/product/`, {params: {category_id}})
          .then((response) => {
            this.products = response.data;
          })
          .catch((e) => {
            console.log("Ошибка при получении продуктов:", e);
          })
    },
    async fetchProductsByParentId(parent_id) {
      await $api
          .get(`/product/parent/${parent_id}`)
          .then((response) => {
            this.products = response.data;
          })
          .catch((e) => {
            console.log("Ошибка при получении продуктов:", e);
          })
    },
    addToFavourites(product) {
      const isAuth = localStorage.getItem('isAuth');

      if (isAuth === 'true') {
        const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
        const isProductInFavorites = favoriteProducts.some((favProduct) => favProduct.id === product.id);

        let promise;
        if (isProductInFavorites) {
          promise = $api.post('/favourite/remove', {product_id: product.id});
        } else {
          promise = $api.post('/favourite/add', {product_id: product.id});
        }

        promise.then((response) => {
          console.log(isProductInFavorites ? 'Продукт удален из избранного' : 'Продукт добавлен в избранное', response.data);
          // Обновляем состояние кнопки
          product.isFavorite = !isProductInFavorites;
          // Обновляем локальное хранилище
          const updatedFavorites = isProductInFavorites
              ? favoriteProducts.filter((favProduct) => favProduct.id !== product.id)
              : [...favoriteProducts, product];
          localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
          this.$forceUpdate()
        }).catch((error) => {
          console.error('Ошибка при обновлении избранного', error);
        });
      } else {
        this.$store.commit('openAuthError');
      }
    },
    isProductInFavorites(productId) {
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      return favoriteProducts.some((favProduct) => favProduct.id === productId);
    },
  },
  mounted() {
    this.fetchCategoryId();
    // При загрузке страницы, устанавливаем состояние isFavorite для каждого продукта
    this.products.forEach((product) => {
      product.isFavorite = this.isProductInFavorites(product.id);
    });
  },
};
</script>

<template>
  <div class="scroll-component_product">
    <div v-if="products.length > 0" class="scroll-component">
      <div v-for="product in products" :key="product.id" class="catalog-card">
        <div class="catalog-card-trigger">
          <div class="catalog-card_catalog_card_main_img">
            <div class="catalog-card_catalog_card_image">
              <!-- Вставляем ссылку на страницу товара -->
              <a :href="`/product/${product.id}`" class="cursor-pointer">
                <div :content="`/product/${product.id}`" class="catalog-card_images_section_link" itemprop="url">
                  <img :src="`http://localhost:5000/${product.Images[0].img}`" alt="Product Image" loading="lazy">
                </div>
              </a>
            </div>
            <button aria-label="favorite" class="catalog-card_catalog_card_favorite" type="submit"
                    @click="addToFavourites(product)">
              <i v-if="!isProductInFavorites(product.id)" class="catalog-card_catalog_card_favorite_dislike"></i>
              <i v-if="isProductInFavorites(product.id)" class="catalog-card_catalog_card_favorite_liked"></i>
            </button>
          </div>
          <div class="catalog-card_catalog_card_info">
            <!-- Вставляем название и цену товара -->
            <a :href="`/product/${product.id}`" class="cursor-pointer">
              <div class="catalog-card_catalog_card_info_body">
                <div :content="product.title" class="catalog-card_catalog_card_info_body_title" itemprop="name">
                  {{ product.title }}
                </div>
                <div class="catalog-card_catalog_card_info_body_price">
                  {{ Math.floor(product.price).toLocaleString("ru-RU") }} руб.
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-100 d-flex justify-content-center align-items-center flex-column"
           style="min-height: 500px;"><br><br><a href="/"><img alt="..." src="../../assets/favourite.png"
                                                               style="width: 64px; height: 64px;"></a><br>
        <div class="text-center">Товаров пока что нет</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background-image: url(../../assets/favourite.png);
  width: 26px;
  height: 26px;
  display: block;
  transition: background-image .5s ease;
}

.catalog-card_catalog_card_favorite_liked {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 26px;
  background-image: url(../../assets/like-action.png); /* Изменяем изображение на новое */
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
</style>