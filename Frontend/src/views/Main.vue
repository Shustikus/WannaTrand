<script>
import $api from "@/http";

export default {
  data() {
    return {
      currentImageIdx: 0,
      isPageFocused: true,
      timerId: null,
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  mounted() {
    this.changeImage();
    window.addEventListener('focus', this.handlePageFocus);
    window.addEventListener('blur', this.handlePageBlur);
  },
  methods: {
    changeImage() {
      this.timerId = setInterval(() => {
        if (this.isPageFocused) {
          this.currentImageIdx = (this.currentImageIdx + 1) % 1;
        }
      }, 10000);
    },
    handlePageFocus() {
      this.isPageFocused = true;
    },
    handlePageBlur() {
      this.isPageFocused = false;
    },
    nextImage() {
      if (this.isPageFocused) {
        this.currentImageIdx = (this.currentImageIdx + 1) % 1;
        this.resetTimer();
      }
    },
    prevImage() {
      if (this.isPageFocused) {
        this.currentImageIdx = (this.currentImageIdx - 1 + 1) % 1;
        this.resetTimer();
      }
    },
    resetTimer() {
      clearInterval(this.timerId);
      this.changeImage();
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    handleTouchEnd(event) {
      this.touchEndX = event.changedTouches[0].clientX;
      const swipeDistance = this.touchEndX - this.touchStartX;
      if (swipeDistance > 50) {
        this.prevImage();
      } else if (swipeDistance < -50) {
        this.nextImage();
      }
    },
  },
};
</script>

<template>
  <main class="site-wrapper">
    <div class="site-container">
      <div class="home-carousel">
        <div class="homepage-tile">
          <div class="homepage-tile_img" @touchend="handleTouchEnd" @touchstart="handleTouchStart">
            <a href="/category/clothes">
              <picture class="homepage-tile_picture">
                <img id="slide-1" alt="" class="homepage-tile_pictureimg" sizes="100vw" src="../assets/Main1.jpg" />
              </picture>
            </a>
            <button class="product_imageprev" hidden="" type="button" @click="prevImage">
              ❮
            </button>
            <button class="product_imagenext" hidden="" type="button" @click="nextImage">
              ❯
            </button>
          </div>
          <div class="homepage-tile__overlay">
            <h4 class="homepage-tile-title">
              <p>
                <span style="color: white">Мы рады сообщить об открытии Wanna Trend. Ассортимент товаров будет постоянно
                  пополняться. Подписывайтесь на наши соц. сети, чтобы ничего не пропустить. 14.12.2023</span>
              </p>
            </h4>
            <div class="homepage-tile_btns" hidden="">
              <a class="c-button homepage-tile_btn" href="/category/clothes">
                <span>Discover</span>
              </a>
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

.site-wrapper {
  position: relative;
  margin-top: 61px;
  padding-top: 0;
}

.home-carousel {
  overflow: hidden;
}

.homepage-tile {
  position: relative;
  overflow: hidden;
}

.homepage-tile_img {
  height: auto;
}

@media screen and (max-width: 1024px) {
  .homepage-tile_img {
    height: 535px;
  }

  .homepage-tile_picture {
    transform: translateX(-100%);
  }

  img {
    max-width: none;
    /* Убираем максимальную ширину для маленьких экранов */
  }

  .homepage-tile_pictureimg {
    width: auto;
    /* Убираем ширину 100% для маленьких экранов */
  }
}

.homepage-tile_picture {
  display: flex;
  flex-direction: row;
  scroll-snap-type: x mandatory;
  -o-object-fit: cover;
  overflow: visible;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  height: 100%;
  width: 100%;
  transition: transform 0.25s ease;
  /* Добавьте анимацию с плавным переходом */
  transform: translateX(0);
  /* Изначальное положение */
}

.homepage-tile_pictureimg {
  flex: 1 0 100%;
  scroll-snap-align: start;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  height: 100%;
  width: 100%;
}

img {
  max-width: 100%;
  height: auto;
  border: 0;
}

@media screen and (max-width: 435px) {

  .product_imageprev,
  .product_imagenext {
    display: none;
  }

  img {
    max-width: none;
    /* Убираем максимальную ширину для маленьких экранов */
  }

  .homepage-tile_pictureimg {
    width: auto;
    /* Убираем ширину 100% для маленьких экранов */
  }

  .homepage-tile_picture {
    transform: translateX(-100%);
  }
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

.homepage-tile__overlay {
  position: absolute;
  bottom: 1.25rem;
  top: 10px;
  /* right: 0; */
  left: 0;
  text-align: center;
}

.homepage-tile-title {
  padding: 0 0.5rem;
  /* padding: 0 2.5rem; */
  font-family: sans-serif;
  /* BB-CondBold, Helvetica Neue, Helvetica, Arial, sans-serif; */
  font-size: 13px;
  /* font-size: 1.375rem; */
  font-weight: 400;
  line-height: 110%;
  letter-spacing: .05em;
}

p {
  margin: 0;
  padding: 0;
}

h4 {
  margin: 0;
}

.homepage-tile_btns {
  display: flex;
  align-content: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-top: 0.75rem;
}

.homepage-tile_btn {
  min-width: 8.75rem;
  margin: 0 0.25rem;
}

.c-button {
  font-family: BB-Regular, Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: .75rem;
  font-weight: 400;
  line-height: 130%;
  letter-spacing: .03em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: normal;
  text-align: center;
  box-shadow: 0 0 0 0 #aaaaac;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 2.5rem;
  margin: 0 auto;
  padding: 0 1rem;
  vertical-align: middle;
  color: #000;
  border: 1px solid #000;
  border-radius: 0.25rem;
  background: #fff;
}</style>