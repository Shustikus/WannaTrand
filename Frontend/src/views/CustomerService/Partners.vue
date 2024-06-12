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
                <a aria-label="site native link" class="cursor-pointer"
                   @click="this.$router.push({path: '/customer_service'})">
                      <span class="routing_router_body" content="/customer_service">
                        <span content="Избранное" itemprop="name">Обслуживание клиентов</span>
                      </span>
                </a>
                <meta content="2" itemprop="position">
              </li>
              <li class="routing_router_items">
                <a aria-label="site native link" class="cursor-pointer"
                   @click="this.$router.push({path: '/customer_service/partners'})">
                      <span class="routing_router_body" content="/customer_service/partners">
                        <span content="Избранное" itemprop="name">Партнерам</span>
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
              Партнерам
            </div>
          </div>
          <div class="customer_services_page_content">
            <div class="customer-service-content">
              <p>Если Вы хотите, чтобы Ваш бренд был представлен на сайте <a style="text-decoration: underline; cursor: pointer"
                                                                             @click="this.$router.push({path: '/'})">WannaTrend</a>,
                пожалуйста, заполните форму заявки
                на вкладке <a style="text-decoration: underline; cursor: pointer">Войти/Регистрация/Заявка на
                  регистрацию бренда</a>.</p>
              <p><br>Мы свяжемся с Вами, чтобы обсудить возможное сотрудничество.</p>
              <p><br>Преимущества сотрудничества для бренда: Мы помогаем наладить e-commerce. маркетинг и продвижение.
              </p>
              <p style="text-align: center"><br>Мы открыты к сотрудничеству и партнёрству!</p>
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