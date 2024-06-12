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
            </ul>
          </div>
        </div>
        <div class="container-box">
          <h1>Обслуживание клиентов</h1>
          <ul class="customer_services_customer_service_list">
            <li>
              <a @click="this.$router.push({path: '/customer_service/about'})">
                <span class="customer_services_customer_service_list_items">О нас</span>
              </a>
            </li>
            <li>
              <a @click="this.$router.push({path: '/customer_service/delivery_and_payment'})">
                <span class="customer_services_customer_service_list_items">Доставка и оплата</span>
              </a>
            </li>
            <li>
              <a @click="this.$router.push({path: '/customer_service/how_to_return'})">
                <span class="customer_services_customer_service_list_items">Обмен и возврат</span>
              </a>
            </li>
            <li>
              <a @click="this.$router.push({path: '/customer_service/user_agreement'})">
                <span class="customer_services_customer_service_list_items">Пользовательское соглашение</span>
              </a>
            </li>
            <li>
              <a @click="this.$router.push({path: '/customer_service/partners'})">
                <span class="customer_services_customer_service_list_items">Партнерам</span>
              </a>
            </li>
            <li>
              <a @click="this.$router.push({path: '/customer_service/contacts'})">
                <span class="customer_services_customer_service_list_items">Контакты</span>
              </a>
            </li>
          </ul>
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

.container-box {
  width: 100%;
  max-width: 992px;
  margin: 0 auto !important;
  padding: 0;
  text-align: center !important;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

.customer_services_customer_service_list {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.customer_services_customer_service_list_items {
  display: block;
  text-align: center;
  margin-bottom: 18px;
  text-transform: uppercase;
  font-weight: 400;
  transition: color .3s ease;
  cursor: pointer;
}
</style>