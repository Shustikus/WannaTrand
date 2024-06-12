<script>
import $api from "@/http";
import ProductEdit from "@/components/Alert/ProductEdit.vue";

export default {
  components: {ProductEdit},
  data() {
    return {
      product: {
        category_id: null,
        Brand: {id: '', brand_title: ''},
        Images: [],
        imageFile: null,
      },
      currentIndex: 0,
      formattedPrice: '',
      showProductEdit: false,
      productType: 'clothing',
      availableCategories: [],
      productQuantities: {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
      }
    };
  },
  methods: {
    async loadBrand() {
      $api
          .get(`/brand/one`)
          .then((response) => {
            this.product.Brand.brand_title = response.data.brand_title
            this.product.Brand.id = response.data.id
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async createProduct() {
      try {
        // Check if at least one category is not selected or there are no photos
        if (!this.product.title ||
            !this.product.description ||
            !this.product.price ||
            !this.product.category_id ||
            this.product.Images.length === 0) {
          alert('Пожалуйста заполните все поля и добавьте хотябы одно фото перед созданием товара.');
          return;
        }
        // Получаем данные о количестве продукта по размерам
        const quantities = Object.entries(this.productQuantities).map(([size, quantity]) => ({size, quantity}));
        // Создаем продукт
        const productData = {
          title: this.product.title,
          description: this.product.description,
          price: this.product.price,
          brand_id: this.product.Brand.id,
          category_id: this.product.category_id,
          quantities: quantities
        };

        const productResponse = await $api.post(`/product`, productData);
        console.log('Product created:', productResponse);

        // Проверяем наличие продукта перед созданием изображения
        if (productResponse.data && productResponse.data.id) {
          // Присваиваем product_id
          const productId = productResponse.data.id;

          // Загружаем все изображения
          const imageResponses = await Promise.all(
              this.product.Images.map(async (image) => {
                const file = image.file;

                const formData = new FormData();
                formData.append('img', file);
                formData.append('product_id', productId);

                // Отправляем данные на сервер
                return await $api.post(`/image`, formData);
              })
          );

          // Присваиваем image_ids
          const imageIds = imageResponses.map((response) => response.data.id);
          console.log('New Image IDs:', imageIds);

          // Обновляем продукт с новыми image_ids
          const updateProductData = {
            productId: productId,
            newImageId: imageIds.length > 0 ? [imageIds[0]] : [],
          };

          const updateProductResponse = await $api.post(`/product/update`, updateProductData);
          console.log('Product updated with new Image IDs:', updateProductResponse);
          this.$router.push(`/product/${productId}/edit`); // Замените '/profile' на ваш путь к компоненту Profile
        } else {
          console.error('Failed to create product.');
        }
      } catch (error) {
        console.error('Error creating product:', error);
      }
    },
    openImageInput() {
      this.$refs.imageInput.click();
    },
    handleImageChange(event) {
      const files = event.target.files;

      if (!files || files.length === 0) {
        console.error('No files selected.');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 800 * 1024) {
          console.error('File size exceeds the limit of 500 KB');
          this.openFileSizeError();
          return;
        }

        this.product.Images.push({
          file: file,
          imageUrl: URL.createObjectURL(file)
        });
      }
    },
    async deleteImage() { // пока что не работает
      const imageIdToDelete = this.product.Images[this.currentIndex].id;
      await $api.delete(`/image`, {data: {id: imageIdToDelete}});
      window.location.reload();
    },
    async updateImage() { // пока что не работает
      try {
        const file = await this.selectImageFile();
        const imageIdToUpdate = this.product.Images[this.currentIndex].id;

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
    updateCategories() {
      // Определение доступных категорий в зависимости от типа продукта
      this.availableCategories = this.productType === 'clothing'
          ? [
            {label: 'Платья', value: 4},
            {label: 'Верхняя одежда', value: 5},
            {label: 'Деним', value: 6},
            {label: 'Блузы и топы', value: 7},
            {label: 'Брюки', value: 8},
            {label: 'Юбки', value: 9},
            {label: 'Жакеты', value: 10},
            {label: 'Свитеры и толстовки', value: 11},
            {label: 'Комплекты', value: 12},
            {label: 'Комбинезоны', value: 13},
            {label: 'Шорты', value: 14},
            {label: 'Купальники', value: 15},
          ]
          : [
            {label: 'Сумки', value: 16},
            {label: 'Украшения', value: 17},
            {label: 'Ремни', value: 18},
            {label: 'Головные уборы', value: 19},
            {label: 'Перчатки и Шарфы', value: 20},
            {label: 'Очки', value: 21},
            {label: 'Носки', value: 22},
          ];
      // Сброс выбранной категории
      this.product.category_id = null;
    },
    openFileSizeError() {
      this.$store.commit('openFileSizeError');
    },
    navigateToProfile() {
      // Вызовите мутацию, чтобы установить видимую секцию в компоненте Profile на 'brand'
      this.$store.commit('setVisibleSection', 'brand');
      // Переходите на страницу Profile
      this.$router.push('/profile'); // Замените '/profile' на ваш путь к компоненту Profile
    },
    selectImage(index) {
      this.currentIndex = index;
    },
    nextImage() {
      if (this.product.Images.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.product.Images.length;
      }
    },
    prevImage() {
      if (this.product.Images.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + this.product.Images.length) % this.product.Images.length;
      }
    },
    getSelectedImageUrl() {
      return this.product.Images && this.product.Images.length > 0 ? this.product.Images[this.currentIndex].imageUrl : '';
    },
    selectedImageIndex() {
      // При изменении selectedImageIndex обновите src для главного изображения
      if (this.product.Images && this.product.Images.length > 0) {
        const selectedImage = this.product.Images[this.currentIndex];
        if (selectedImage && selectedImage.imageUrl) {
          this.$refs.mainImage.src = selectedImage.imageUrl;
        }
      }
    },
  },
  watch: {
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
    this.loadBrand()
  },
  created() {
    this.updateCategories();
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
                  <div v-if="product.Images.length === 0"
                       style="display: flex; height: 560px; justify-content: space-evenly; align-items: center;flex-direction: column; border: 1px solid black">
                    <span>загрузите изображение</span>
                    <input ref="imageInput" multiple style="cursor: pointer" type="file" @change="handleImageChange">
                    <span>Максимальный размер файла: 800Kb</span>
                  </div>
                  <img v-else :src="getSelectedImageUrl()" alt="Selected Image">
                  <button v-if="product.Images && product.Images.length > 0" class="product_imageprev" type="button"
                          @click="prevImage">❮
                  </button>
                  <button v-if="product.Images && product.Images.length > 0" class="product_imagenext" type="button"
                          @click="nextImage">❯
                  </button>
                  <!-- <button v-if="product.Images && product.Images.length > 0" aria-label="edit"
                           class="catalog-card_catalog_card_edit_image"
                           title="Редактировать текущее фото" @click.prevent="updateImage">
                     <i class="catalog-card_catalog_card_edit_image_icon"></i>
                   </button>
                   <button v-if="product.Images && product.Images.length > 0" aria-label="delete"
                           class="catalog-card_catalog_card_delete_image"
                           title="Удалить текущее фото" @click.prevent="deleteImage">
                     <i class="catalog-card_catalog_card_delete_image_icon"></i>
                   </button> -->
                </div>
              </div>
              <div class="t-slds_thumbsbullet-wrapper">
                <div v-for="(image, index) in product.Images" :key="index" class="t-slds__thumbsbullet">
                  <img :class="{ active: index === currentIndex }" :src="image.imageUrl" alt=""
                       @click="selectImage(index)">
                </div>
                <div class="t-slds__thumbsbullet">
                  <input ref="imageInput" multiple style="display: none" type="file" @change="handleImageChange">
                  <button style="padding: 0" title="Добавить фото" @click.prevent="openImageInput">
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
                <span>Тип продукта:</span>
                <select v-model="productType" @change="updateCategories">
                  <option value="clothing">Одежда</option>
                  <option value="accessories">Аксессуары</option>
                </select>

                <span>Категория:</span>
                <select v-model="product.category_id">
                  <option v-for="category in availableCategories" :key="category.value" :value="category.value">
                    {{ category.label }}
                  </option>
                </select>
              </div>
              <div class="product_edit">
                <span>Бренд:</span>
                <input v-model="product.Brand.brand_title" disabled readonly type="text">
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
                  <div v-for="size in ['XS', 'S', 'M', 'L', 'XL']" :key="size">
                    <label :for="'size-' + size">{{ size }}</label>
                    <input v-model="productQuantities[size.toUpperCase()]" :min="0"
                           :name="'quantity-' + size.toUpperCase()" class="quantity"
                           type="number">
                  </div>
                </div>
              </div>
              <div class="button_container">
                <button type="submit" @click="navigateToProfile">К товарам</button>
                <button type="submit" @click="createProduct">Создать товар</button>
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