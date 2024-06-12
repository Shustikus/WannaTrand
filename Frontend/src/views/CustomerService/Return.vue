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
                   @click="this.$router.push({path: '/customer_service/how_to_return'})">
                      <span class="routing_router_body" content="/customer_service/how_to_return">
                        <span content="Избранное" itemprop="name">Обмен и возврат</span>
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
              Обмен и возврат
            </div>
          </div>
          <div class="customer_services_page_content">
            <div class="customer-service-content">
              <p>Обмен/возврат товара ненадлежащего качества осуществляется за счет сайта WannaTrend. Обмен/возврат
                товара надлежащего качества, но не подошедшего по размеру, фасону, цвету и т.д., осуществляется за счет
                покупателя.</p>
              <p><br>Информируем вас о том, что, согласно ст. 18 и 26.1 Закона «О защите прав потребителей» возврат
                товаров осуществляется по следующим правилам:</p>
              <p><br>О намерении возвратить товар Покупатель сообщает удобным способом: по телефону <a
                  href="tel:+79206635622" style="text-decoration: underline" target="_blank">+7 920 663 56 22</a>
                WhatsApp Messenger или на электронную почту <a href="mailto:wannatrend@mail.ru"
                                                               style="text-decoration: underline" target="_blank">wannatrend@mail.ru</a>
                В сообщении просим указать номер заказа и
                причину возврата. После получения сообщения с Вами свяжется менеджер, который уточнит все детали и
                оформит с Вами заявление на возврат. Возврат товара надлежащего качества возможен лишь в случае, если
                сохранен его товарный вид и потребительские свойства (упаковка, пломбы, ярлыки).</p>
              <p><br>Обращаем внимание, что сроки возврата товара, следующие:</p>
              <p><br>- на товары надлежащего качества – 7 календарных дней, с момента его доставки покупателю.</p>
              <p><br>- на товары ненадлежащего качества - если производителем отдельно не установлен гарантийный срок,
                то данный срок составляет 30 календарных дней.</p>
              <p><br>Денежные средства будут возвращены покупателю в течение 10 рабочих дней.</p>
              <p style="text-align: center"><br>По всем возникающим вопросам просим обращаться в <a
                  style="text-decoration: underline; cursor: pointer"
                  @click="this.$router.push({path: '/customer_service/contacts'})">Клиентскую
                службу</a>.</p>
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