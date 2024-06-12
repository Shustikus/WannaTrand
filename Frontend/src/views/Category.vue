<script>
import $api from "@/http";
import ProductCard from "@/views/Product/ProductCard.vue";

export default {
  components: {
    ProductCard
  },
  data() {
    return {
      parentCategory: {
        parent: [],
        child: [],
        subcategories: []
      },
    };
  },
  methods: {
    loadCategoryById() {
      const nameEn = this.$route.params.name_en; // Получите параметр name_en
      // Преобразуйте name_en в id (например, используя асинхронный запрос на сервер)
      $api
          .get(`category/convert/${nameEn}`) // Используйте преобразованный id
          .then((response) => {
            const categoryId = response.data.id;
            // Теперь используйте categoryId для запроса на сервер
            $api
                .get(`category/${categoryId}`)
                .then((response) => {
                  if (Array.isArray(response.data)) {
                    // Фильтруем категории по отсутствию родительской
                    const parentCategoryData = response.data.find(item => item.parent_id === null);
                    if (parentCategoryData) {
                      this.parentCategory = parentCategoryData;
                      // Обновляем дочерние категории
                      this.parentCategory.child = response.data.filter(item => item.parent_id === parentCategoryData.id);
                    } else {
                      console.error('Родительская категория не найдена');
                    }
                  } else {
                    // Если в ответе только одна категория, то считаем ее родительской
                    this.parentCategory = response.data;
                  }
                })
                .catch((e) => {
                  console.error('Ошибка при загрузке категории:', e);
                });
          })
          .catch((e) => {
            console.error('Ошибка при преобразовании name_en в id:', e);
          });
    },
  },
  created() {
    this.loadCategoryById(); // Используем параметр name_en
  },
  computed: {
    showLine() {
      return this.parentCategory.subcategories.length > 0 && this.parentCategory.subcategories.map(item => {
        return item.name_en === this.$route.params.name_en;
      });
    },
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
                          <span content="Главная" itemprop="name">Главная</span></span></a>
                    <meta content="1" itemprop="position">
                  </li>
                  <li class="routing_router_items">
                    <a :href="parentCategory.parent.name_en" aria-label="site native link" class="cursor-pointer">
                        <span :content="parentCategory.parent.name_en" class="routing_router_body">
                          <span content="Главная" itemprop="name">{{ parentCategory.parent.name }}</span></span></a>
                    <meta content="2" itemprop="position">
                  </li>
                  <li v-if="parentCategory.child && parentCategory.child.name !== null"
                      class="routing_router_items">
                    <a :href="'/category/' + parentCategory.child.name_en" aria-label="site native link"
                       class="cursor-pointer">
                        <span
                            :content="'/category/' + parentCategory.child.name_en"
                            class="routing_router_body">
                          <span content="Главная" itemprop="name">{{ parentCategory.child.name }}</span></span></a>
                    <meta content="3" itemprop="position">
                  </li>
                </ul>
              </div>
            </div>
            <h1 v-if="parentCategory.child && parentCategory.child.name"
                class="catalog-breadcrumbs_catalog_breadcrumbs_title">
              {{ parentCategory.child.name }}
            </h1>
            <h1 v-else
                class="catalog-breadcrumbs_catalog_breadcrumbs_title">
              {{ parentCategory.parent.name }}
            </h1>
            <div class="catalog-breadcrumbs_catalog_breadcrumbs">
              <ul class="catalog-breadcrumbs_catalog_breadcrumbs_list">
                <li v-if="parentCategory.parent.name_en !== 'shoes'"
                    class="catalog-breadcrumbs_catalog_breadcrumbs_item">
                  <a :aria-label="parentCategory.parent.name_en" :href="parentCategory.parent.name_en"
                     class="catalog-breadcrumbs_catalog_breadcrumbs_text">Все
                    <div v-if="parentCategory.child == null" class="line"></div>
                  </a>
                </li>
                <li v-for="(item, index) in parentCategory.subcategories" :key="item.id"
                    class="catalog-breadcrumbs_catalog_breadcrumbs_item">
                  <a :aria-label="'category' + ' ' + item.name_en" :href="'/category/' + item.name_en"
                     class="catalog-breadcrumbs_catalog_breadcrumbs_text">
                    {{ item.name }}
                    <div v-if="showLine[index]" class="line"></div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="product-container">
            <div class="page-animate-enter">
              <ProductCard/>
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

.line {
  width: 100%;
  height: 1px;
  background-color: black;
  position: absolute;
  visibility: visible;
  transform-origin: 50% 50%;
}

.catalog-breadcrumbs_catalog_breadcrumbs_title {
  text-align: center;
  font-size: 2em;
  margin: 0.67em 0;
  font-family: Futura PT, sans-serif;
  font-weight: 400;
}

.catalog-breadcrumbs_catalog_breadcrumbs {
  width: 100%;
  position: relative;
  z-index: 1;
}

.catalog-breadcrumbs_catalog_breadcrumbs_list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.catalog-breadcrumbs_catalog_breadcrumbs_item {
  padding: 2px 16px;
}

.catalog-breadcrumbs_catalog_breadcrumbs_text {
  font-size: 15px;
  position: relative;
  cursor: pointer;
  color: #666;
  transition: color .3s ease;
}

.page-animate-enter {
  opacity: 1;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  pointer-events: auto;
  cursor: default;
  transition: opacity .6s ease, -webkit-transform .6s ease;
  transition: transform .6s ease, opacity .6s ease;
  transition: transform .6s ease, opacity .6s ease, -webkit-transform .6s ease;
  will-change: transform, opacity;
}

@media screen and (min-width: 968px ) {
  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar {
    height: 3px;
    background: transparent !important;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar-thumb {
    height: 3px;
    background: #ececec !important;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar-track {
    height: 1px;
    background: transparent !important;
  }
}

@media screen and (max-width: 968px) {
  .catalog-breadcrumbs_catalog_breadcrumbs {
    overflow-x: scroll;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-bottom: 3px;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar {
    height: 3px;
    background: transparent !important;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar-track {
    height: 1px;
    background: transparent !important;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs::-webkit-scrollbar-thumb {
    height: 3px;
    background: transparent !important;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs .catalog-breadcrumbs_catalog_breadcrumbs_list {
    justify-content: flex-start;
  }
}

@media screen and (max-width: 1200px) {
  .catalog-breadcrumbs_catalog_breadcrumbs {
    overflow-x: auto;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs .catalog-breadcrumbs_catalog_breadcrumbs_list {
    justify-content: flex-start;
  }
}

@media screen and (max-width: 1400px) {
  .catalog-breadcrumbs_catalog_breadcrumbs {
    overflow-x: auto;
  }

  .catalog-breadcrumbs_catalog_breadcrumbs .catalog-breadcrumbs_catalog_breadcrumbs_list {
    justify-content: flex-start;
  }
}

</style>