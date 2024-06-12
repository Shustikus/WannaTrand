<script>
import $api from "@/http";
import Add from "@/components/Alert/Add.vue";
import SelectSize from "@/components/Alert/SelectSize.vue";

export default {
  components: {
    SelectSize,
    Add
  },
  data() {
    return {
      product: {},
      selectedImageIndex: 0,
      cartItemCount: 0,
      showIncrementModal: false,
      showSelectSize: false
    };
  },
  methods: {
    async loadProduct() {
      await $api
          .get(`/product/${this.$route.params.id}`)
          .then((response) => {
            this.product = response.data
          })
          .catch((e) => {
            console.log(e)
          })
    },
    async addToCart() {
      const isAuth = localStorage.getItem('isAuth');

      if (isAuth === 'true') {
        const size = document.querySelector('input[name="size"]:checked');
        if (!size) {
          this.showSelectSize = true
          return
        }
        const quantity = 1; // Устанавливаем количество в 1
        await $api
            .post("/cart", {
              product_id: this.product.id,
              size: size.value,
              quantity,
            })
            .then((response) => {
              console.log(response.data);
              this.showIncrementModal = true; // Показываем модальное окно
            })
            .catch((e) => {
              console.log(e)
            })
      } else {
        this.$store.commit('openAuthError');
      }
    },
    selectImage(index) {
      this.selectedImageIndex = index;
    },
    nextImage() {
      if (this.product.Images.length === 0) {
        return; // Нет изображений
      }
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.Images.length;
    },
    prevImage() {
      if (this.product.Images.length === 0) {
        return; // Нет изображений
      }
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.product.Images.length) % this.product.Images.length;
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
  },
  mounted() {
    this.loadProduct()
  },
};
</script>

<template>
  <main>
    <SelectSize v-if="showSelectSize" @close="showSelectSize = false"/>
    <Add v-if="showIncrementModal" @close="showIncrementModal = false"/>
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
                </div>
              </div>
              <div class="t-slds_thumbsbullet-wrapper">
                <div v-for="(image, index) in product.Images" class="t-slds__thumbsbullet">
                  <img :key="index" :class="{ active: index === selectedImageIndex }"
                       :src="`http://localhost:5000/${image.img}`"
                       alt="" @click="selectImage(index)">
                </div>
              </div>
            </div>
          </div>
          <div class="t-store_prod-popup_info">
            <div class="t-store_prod-popup_title-wrapper">
              <h1 class=" js-product-name" itemprop="name">{{ product.title }}</h1>
            </div>
            <div class="js-store-price-wrapper">
              <div class="js-store-prod-price" style="font-weight:400;">
                <div class="js-product-price">
                  {{ Math.floor(product.price).toLocaleString("ru-RU") }} руб.
                </div>
              </div>
            </div>
            <div class="js-product-edition-option">
              <div class="js-product-edition-option-name">Размер:</div>
              <form id="size-form" action="" class="t-product__option-variants " method="POST"
                    @submit.prevent="addToCart">
                <div class="size-section">
                  <div v-for="(quantityData, index) in product.Product_quantities" :key="index">
                    <input
                        :id="'size-' + quantityData.size.toUpperCase()"
                        :name="'size'"
                        type="radio"
                        :value="quantityData.size"
                        :disabled="quantityData.quantity === 0"
                    >
                    <label :for="'size-' + quantityData.size.toUpperCase()">{{ quantityData.size }}</label>
                  </div>
                </div>
                <div class="t-store__prod-popup__btn-wrapper">
                  <input class="add-to-cart" type="submit" value="Добавить в корзину">
                </div>
              </form>
            </div>
            <div class="js-store-prod-text ">
              <div class="js-store-prod-all-text">
                {{ product.description }}
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

.js-product-price {
  font-size: 18px;
  line-height: 1.35;
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
  cursor: pointer;
  min-width: 30px;
  min-height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
}

input[type="radio"] {
  display: none;
}

label:hover {
  color: #7F7F7F;
  border-color: #7F7F7F;
  transition: border-color 0.3s;
}
input[type="radio"]:disabled ~ label:hover {
  border-color: #ddd;
}

input[type="radio"]:disabled + label {
  opacity: 0.6; /* Уменьшение прозрачности */
  cursor: not-allowed; /* Изменение указателя мыши */
}

input[type="radio"]:checked + label {
  border-color: #7F7F7F;
  /* background-color: rgba(52, 52, 52, 0.37); */
}

.t-store__prod-popup__btn-wrapper {
  margin-top: 20px;
  margin-bottom: 30px;
}

.add-to-cart {
  color: #ffffff;
  background-color: #000000;
  border-radius: 3px;
  height: 45px;
  padding: 0 30px 0 30px;
  border: 0;
  font-size: 16px;
  text-align: center;
  line-height: 45px;
  font-weight: 700;
}

.js-store-prod-text {
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.55;
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

@media screen and (max-width: 1200px ) {
  .t-store_prod-popup_slider {
    margin-left: 0;
    margin-right: 0;
  }

  .t-store_prod-popup_info {
    margin-left: 0;
    margin-right: 0;
  }

  .js-product-edition-option {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .t-store_prod-popup_info {
    margin-top: 20px;
    text-align: center;
  }

  .t-container {
    margin-top: 0;
  }
}
</style>