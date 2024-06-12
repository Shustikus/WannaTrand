<script>
import $api from "@/http";
import ProductEdit from "@/components/Alert/ProductEdit.vue";

export default {
  computed: {
    brandTitle() {
      return this.product.Brand ? this.product.Brand.brand_title : null;
    }
  },
  components: {ProductEdit},
  data() {
    return {
      product: {
        Brand: {brand_title: ''},
        Images: [],
        Product_quantities: [],
      },
      selectedImageIndex: 0,
      formattedPrice: '',
      showProductEdit: false,
    };
  },
  methods: {
    async loadProduct() {
      this.product = (await $api.get(`/product/${this.$route.params.id}`)).data
    },
    async updateProduct() {
      const {title, description, price, category_id} = this.product;

      const productData = {
        title,
        description,
        price,
        category_id,
        quantities: this.product.Product_quantities // Передаем данные о количестве товара
      };

      await $api
          .put(`/product/${this.$route.params.id}`, productData)
          .then((response) => {
            this.product.title = response.data.title;
            this.product.description = response.data.description;
            this.product.price = response.data.price;
            this.product.category_id = response.data.category_id;
            // Обновляем данные о количестве товара после успешного обновления продукта
            this.product.Product_quantities = response.data.Product_quantities;
            this.loadProduct()
            this.showProductEdit = true;
          })
          .catch((e) => {
            console.log(e);
          });
    },
    async createImage() {
      try {
        const file = await this.selectImageFile();
        const {id} = this.product; // Получаем id продукта

        if (file.size > 800 * 1024) {
          console.error('File size exceeds the limit of 500 KB');
          this.openFileSizeError()
          return;
        }
        const formData = new FormData();
        formData.append('img', file);
        formData.append('product_id', id);

        // Отправляем данные на сервер
        const response = await $api.post(`/image`, formData);
        console.log(response);

        // Обновляем страницу
        window.location.reload();
      } catch (error) {
        console.error('Error creating image:', error);
      }
    },
    async deleteImage() {
      // Проверяем, есть ли хотя бы одно изображение
      if (this.product.Images.length <= 1) {
        alert("Нельзя удалить последнее изображение.");
        return;
      }
      const imageIdToDelete = this.product.Images[this.selectedImageIndex].id;
      await $api.delete(`/image`, {data: {id: imageIdToDelete}});
      window.location.reload();
    },
    async updateImage() {
      try {
        const file = await this.selectImageFile();
        const imageIdToUpdate = this.product.Images[this.selectedImageIndex].id;

        if (file.size > 800 * 1024) {
          console.error('File size exceeds the limit of 500 KB');
          return;
        }

        const formData = new FormData();
        formData.append('img', file);
        formData.append('id', imageIdToUpdate);

        const response = await $api.put(`/image`, formData);
        console.log(response);

        // Обновляем страницу
        window.location.reload();
      } catch (error) {
        console.error('Error updating image:', error);
      }
    },
    selectImageFile() {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';

        // Прослушиваем событие выбора файла
        input.addEventListener('change', () => {
          const file = input.files[0]; // Получаем выбранный файл
          resolve(file);

          // Очищаем input, чтобы можно было выбрать тот же файл снова
          input.value = '';
        });

        // Запускаем событие клика на созданном input
        input.click();
      });
    },
    openFileSizeError() {
      this.$store.commit('openFileSizeError');
    },
    navigateToProfile() {
      const userRole = this.$store.state.user.role;

      // Проверяем роль пользователя и устанавливаем видимую секцию соответственно
      if (userRole === 'ADMIN') {
        this.$store.commit('setVisibleSection', 'admin');
      } else {
        this.$store.commit('setVisibleSection', 'brand');
      }
      // Переходите на страницу Profile
      this.$router.push('/profile'); // Замените '/profile' на ваш путь к компоненту Profile
    },
    selectImage(index) {
      this.selectedImageIndex = index;
    },
    nextImage() {
      if (this.product.Images.length > 0) {
        this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.Images.length;
      }
    },
    prevImage() {
      if (this.product.Images.length > 0) {
        this.selectedImageIndex = (this.selectedImageIndex - 1 + this.product.Images.length) % this.product.Images.length;
      }
    },
  },
  watch: {
    selectedImageIndex() {
      // При изменении selectedImageIndex обновите src для главного изображения
      if (this.product.Images && this.product.Images.length > 0) {
        const selectedImage = this.product.Images[this.selectedImageIndex];
        this.$refs.mainImage.src = `http://localhost:5000/${selectedImage.img}`;
      }
    },
    'product.price'(newVal) {
      this.formattedPrice = newVal ? newVal.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }) : '';
    },
    formattedPrice(newVal) {
      this.product.price = parseFloat(newVal.replace(/\s+/g, '').replace(/,/g, '.')) || 0;
    },
  },
  mounted() {
    this.loadProduct()
  },
};
</script>

<template>
  <ProductEdit v-if="showProductEdit" @close="showProductEdit = false"/>
  <main>
    <div class="  " style="margin-top: 61px">
      <div class="page_fit_content">
        <div class="t-container">
          <meta content="" itemprop="image">
          <div class="t-store_prod-popup_slider">
            <div class="t-slds">
              <div class="t-slds-main">
                <div class="t-slds_container">
                  <img v-if="product.Images && product.Images.length > 0" ref="mainImage"
                       :src="`http://localhost:5000/${product.Images[0].img}`" alt="" loading="lazy">
                  <button class="product_imageprev" type="button" @click="prevImage">
                    ❮
                  </button>
                  <button class="product_imagenext" type="button" @click="nextImage">
                    ❯
                  </button>
                  <button aria-label="edit" class="catalog-card_catalog_card_edit_image"
                          title="Редактировать текущее фото" @click.prevent="updateImage">
                    <i class="catalog-card_catalog_card_edit_image_icon"></i>
                  </button>
                  <button aria-label="delete" class="catalog-card_catalog_card_delete_image"
                          title="Удалить текущее фото" @click.prevent="deleteImage">
                    <i class="catalog-card_catalog_card_delete_image_icon"></i>
                  </button>
                </div>
              </div>
              <div class="t-slds_thumbsbullet-wrapper">
                <div v-for="(image, index) in product.Images" class="t-slds__thumbsbullet">
                  <img :key="index" :class="{ active: index === selectedImageIndex }"
                       :src="`http://localhost:5000/${image.img}`"
                       alt="" loading="lazy"
                       @click="selectImage(index)">
                </div>
                <div class="t-slds__thumbsbullet">
                  <button style="padding: 0" title="Добавить фото" @click.prevent="createImage">
                    <img alt="" class="active" src="../../assets/icon-plus-math.png">
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="t-store_prod-popup_info">
            <div class="t-store_prod-popup_title-wrapper">
              <h1 class=" js-product-name" itemprop="name">Основная информация</h1>
            </div>
            <div class="product_info_edit">
              <div class="product_edit">
                <span>Наименование:</span>
                <input v-model="product.title" type="text">
              </div>
              <div class="product_edit">
                <span>Категория:</span>
                <select v-model="product.category_id">
                  <option v-if="product.category_id === 3" value="3">Обувь</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="4">Платья</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="5">Верхняя одежда</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="6">Деним</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="7">Блузы и топы</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="8">Брюки</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="9">Юбки</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="10">Жакеты</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="11">Свитеры и толстовки
                  </option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="12">Комплекты</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="13">Комбинезоны</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="14">Шорты</option>
                  <option v-if="product.category_id < 15 && product.category_id !==3" value="15">Купальники</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="16">Сумки</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="17">Украшения</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="18">Ремни</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="19">Головные уборы</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="20">Перчатки и Шарфы
                  </option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="21">Очки</option>
                  <option v-if="product.category_id > 15 && product.category_id !==3" value="22">Носки</option>
                </select>
              </div>
              <div class="product_edit">
                <span>Цвет:</span>
                <select>
                  <option value="null">Без цвета</option>
                  <option value="Бежевый">Бежевый</option>
                  <option value="Белый">Белый</option>
                  <option value="Жёлтый">Жёлтый</option>
                  <option value="Зелёный">Зелёный</option>
                  <option value="Коричневый">Коричневый</option>
                  <option value="Красный">Красный</option>
                  <option value="Розовый">Розовый</option>
                  <option value="Серый">Серый</option>
                  <option value="Черный">Черный</option>
                </select>
              </div>
              <div class="product_edit">
                <span>Бренд:</span>
                <input :value="brandTitle" disabled readonly type="text">
              </div>
              <div class="product_edit">
                <span>Описание:</span>
                <input v-model="product.description" type="text">
              </div>
              <div class="product_edit">
                <span>Цена:</span>
                <input v-model="formattedPrice" type="text">
              </div>
              <div class="js-product-edition-option">
                <div class="js-product-edition-option-name">Количество:</div>
                <div class="size-section">
                  <div v-for="(quantityData, index) in product.Product_quantities" :key="index">
                    <label :for="'size-' + quantityData.size">{{ quantityData.size }}</label>
                    <input
                        v-model="quantityData.quantity"
                        :name="'quantity-' + quantityData.size.toUpperCase()"
                        class="quantity"
                        min="0"
                        type="number"
                    >
                  </div>
                </div>
              </div>
              <div class="button_container">
                <button type="submit" @click="navigateToProfile">К товарам</button>
                <button type="submit" @click="updateProduct">Отредактировать</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: block;
}

.page_fit_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 640px;
}

.t-container {
  margin-top: 80px;
  width: 100%;
  max-width: 1200px;
  padding: 0;
  text-align: center;
}

.t-store_prod-popup_slider {
  max-width: 560px;
  display: inline;
  float: left;
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
}

.t-store_prod-popup_info {
  text-align: left;
  max-width: 560px;
  display: inline;
  float: left;
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
}

.t-slds {
  position: relative;
  overflow: hidden;
}

.t-slds-main {
  touch-action: pan-y;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.t-slds_container {
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
}

.t-slds_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.t-slds_thumbsbullet-wrapper {
  font-size: 0;
  text-align: start;
}

.t-slds__thumbsbullet {
  padding: 0;
  width: 60px;
  position: relative;
  -webkit-transition: opacity ease-in-out .3s;
  -moz-transition: opacity ease-in-out .3s;
  -o-transition: opacity ease-in-out .3s;
  transition: opacity ease-in-out .3s;
  margin-right: 5px;
  margin-top: 4px;
  display: inline-block;
  cursor: pointer;
}

.t-slds__thumbsbullet img {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  object-fit: cover;
  transition: border-color 0.3s;
}

.t-slds__thumbsbullet img.active {
  border-color: #D1D1D1;
}

.t-store_prod-popup_title-wrapper {
  margin-bottom: 18px;
}

.js-product-name {
  font-size: 22px;
  line-height: 1.35;
  font-weight: 400;
}

input[type="radio"] {
  display: none;
}

label:hover {
  color: #7F7F7F;
  border-color: #7F7F7F;
  transition: border-color 0.3s;
}

input[type="radio"]:checked + label {
  border-color: #7F7F7F;
  /* background-color: rgba(52, 52, 52, 0.37); */
}

.product_imageprev,
.product_imagenext {
  opacity: 1;
  z-index: 2;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.product_imageprev {
  left: 0.5rem;
}

.product_imagenext {
  right: 0.5rem;
}

.product_info_edit {
  display: flex;
  flex-direction: column;
}

.product_edit {
  display: flex;
  flex-direction: column;
}

.button_container {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
}

.catalog-card_catalog_card_edit_image {
  position: absolute;
  top: 10px;
  left: 463px;
  z-index: 30;
  cursor: pointer;
  border: none;
  border-radius: 0;
  background-color: transparent;
  opacity: .5;
  transition: opacity .3s ease;
}

.catalog-card_catalog_card_delete_image {
  position: absolute;
  top: 10px;
  left: 510px;
  z-index: 30;
  cursor: pointer;
  border: none;
  border-radius: 0;
  background-color: transparent;
  opacity: .5;
  transition: opacity .3s ease;
}

.catalog-card_catalog_card_edit_image_icon {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 26px;
  background-image: url(../../assets/icon-edit.png);
  width: 26px;
  height: 26px;
  display: block;
  transition: background-image .5s ease;
  background-color: greenyellow;

}

.catalog-card_catalog_card_delete_image_icon {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 26px;
  background-image: url(../../assets/icon-delete.png);
  width: 26px;
  height: 26px;
  display: block;
  transition: background-image .5s ease;
  background-color: crimson;
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
  margin: 10px;
}

button[type="submit"]:hover {
  background-color: #2e3131; /* Изменяем цвет при наведении */
  color: #fff; /* Изменяем цвет текста при наведении */
  transform: scale(1.05); /* Увеличиваем размер кнопки при наведении */
}

@media screen and (max-width: 1200px ) {
  .t-store_prod-popup_slider {
    margin-left: 0;
    margin-right: 0;
  }

  .t-store_prod-popup_info {
    margin-left: 0;
    margin-right: 0;
  }

  .t-store_prod-popup_info {
    margin-top: 20px;
    text-align: center;
  }

  .t-container {
    margin-top: 0;
  }
}

.js-product-edition-option {
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.js-product-edition-option-name {
  font-size: 12px;
  line-height: 1.55;
  padding-bottom: 3px;
}

.size-section {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  min-width: auto;
}

.size-section label {
  margin-bottom: 7px;
  margin-right: 7px;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 30px;
  min-height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.quantity {
  margin-right: 7px;
  margin-bottom: 7px;
}
</style>