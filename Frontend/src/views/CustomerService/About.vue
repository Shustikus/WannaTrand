<script>
import $api from "@/http";

export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {
  },
};
</script>

<template>
  <main>
    <div class="scroll-content">
      <div class="page_fit_content">
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
                <a aria-label="site native link" class="cursor-pointer" @click="this.$router.push({path: '/customer_service'})">
                      <span class="routing_router_body" content="/customer_service">
                        <span content="Избранное" itemprop="name">Обслуживание клиентов</span>
                      </span>
                </a>
                <meta content="2" itemprop="position">
              </li>
              <li class="routing_router_items">
                <a aria-label="site native link" class="cursor-pointer" @click="this.$router.push({path: '/customer_service/about'})">
                      <span class="routing_router_body" content="/customer_service/about">
                        <span content="Избранное" itemprop="name">О нас</span>
                      </span>
                </a>
                <meta content="3" itemprop="position">
              </li>
            </ul>
          </div>
        </div>
        <div class="container-box">
          <div class="customer_services_customer_service_page">
            <div class="customer_services_customer_service_page_title">
              О нас
            </div>
          </div>
          <div class="customer_services_page_content">
            <div class="customer-service-content">
              <p>ПРИВЕТСТВУЕМ ВАС В НАШЕМ УНИКАЛЬНОМ МОДНОМ ПРОСТРАНСТВЕ!</p>
              <p><br>ЗДЕСЬ ВЫ МОЖЕТЕ ПРИОБРЕСТИ ОДЕЖДУ РОССИЙСКИХ БРЕНДОВ И ДИЗАЙНЕРОВ. У НАС ПРЕДСТАВЛЕНЫ НАЧИНАЮЩИЕ
                БРЕНДЫ ОДЕЖДЫ, КОТОРЫЕ ГОТОВЫ УДИВЛЯТЬ МИР И ВАС, НАШИ УВАЖАЕМЫЕ ГОСТИ.</p>
              <p><br>В НАШЕМ МОДНОМ ПРОСТРАНСТВЕ ВЫ НАЙДЕТЕ УНИКАЛЬНЫЕ ЕДИНИЧНЫЕ ДИЗАЙНЕРСКИЕ ЭКЗЕМПЛЯРЫ ОДЕЖДЫ,
                ТРЕНДОВЫЕ И БАЗОВЫЕ ВЕЩИ, ИНТЕРЕСНЫЕ УСЛОЖНИТЕЛИ И АКСЕССУАРЫ. ВСЕ СОЗДАНО С ЛЮБОВЬЮ ДЛЯ ВАС!</p>
              <p><br>НАШ ПРОЕКТ ТАКЖЕ СОЗДАН, ДЛЯ ТОГО ЧТОБЫ ПОМОЧЬ НАЧИНАЮЩИМ БРЕНДАМ И ДИЗАЙНЕРАМ РАЗВИТЬ СВОЮ
                ДЕЯТЕЛЬНОСТЬ.</p>
              <p style="text-align: center"><br>ПРИЯТНЫХ ПОКУПОК!</p>
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

.container-box {
  width: 100%;
  max-width: 992px;
  margin: 0 auto !important;
  padding: 0;
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

.customer_services_page_content {
  font-size: 15px;
  padding: 0 40px;
  line-height: 22px;
}

.customer-service-content {
  margin-top: 30px;
  width: 100%;
  height: auto;
}

.customer_services_customer_service_page {
  width: 100%;
  height: auto;
  position: relative;
}

.customer_services_customer_service_page_title {
  display: block;
  width: 100%;
  height: auto;
  text-align: center;
  font-size: 34px;
  font-family: Bodoni Cyrillic, Futura PT, serif;
  font-weight: 300;
  text-transform: uppercase;
}
</style>