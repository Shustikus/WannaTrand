import {createRouter, createWebHistory} from 'vue-router'

// Компоненты страниц
import Main from './views/Main.vue';
import Profile from './components/User/Profile/Profile.vue';
import Category from './views/Category.vue';
import Brands from './views/Brands.vue'
import About from './views/CustomerService/About.vue'
import Product from "./views/Product/Product.vue";
import Favourite from "./views/Favourite.vue";
import Cart from "./views/Cart.vue";
import ProductEdit from "@/views/Product/ProductEdit.vue";
import store from "@/store/store";
import $api from "@/http";
import ProductAdd from "@/views/Product/ProductAdd.vue";
import CustomerService from "@/views/CustomerService/CustomerService.vue";
import DeliveryAndPayment from "@/views/CustomerService/DeliveryAndPayment.vue";
import Return from "@/views/CustomerService/Return.vue";
import UserAgreement from "@/views/CustomerService/UserAgreement.vue";
import Partners from "@/views/CustomerService/Partners.vue";
import Contacts from "@/views/CustomerService/Contacts.vue";

const checkRole = async (to, from, next) => {
    try {
        // Ждем загрузку данных о пользователе
        await store.dispatch('loadUserFromLocalStorage');

        const user = store.state.user;

        // Проверяем условия доступа
        if (user && (user.role === 'ADMIN' || user.role === 'AUTHOR') && store.state.isAuth === true) {
            // Если пользователь не админ, проверяем наличие id бренда
            if (user.role !== 'ADMIN' && to.params.id) {
                // Получаем id бренда продукта из вашего API
                const brandId = await $api.get(`/product/${to.params.id}/brand`)
                    .then(response => response.data)
                    .catch(error => {
                        console.error('Error fetching product brand ID:', error);
                        return null;
                    });

                // Проверяем, принадлежит ли бренд продукта текущему пользователю
                if (user.brand && user.brand.id === Number(brandId)) {
                    next(); // Пропускаем пользователя
                } else {
                    console.log('User does not have access to the specified brand or product');
                    next('/');
                }
            } else {
                next(); // Пропускаем пользователя, если нет параметра id в маршруте или если пользователь админ
            }
        } else {
            console.log('User does not have access to the specified product');
            next('/');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        next('/');
    }
};

const isAdminOrAuthor = async (to, from, next) => {
    try {
        // Ждем загрузку данных о пользователе
        await store.dispatch('loadUserFromLocalStorage');

        const user = store.state.user;

        // Проверяем условия доступа
        if (user && (user.role === 'ADMIN' || user.role === 'AUTHOR') && store.state.isAuth === true) {
            // Пропускаем пользователя
            next();
        } else {
            console.log('User does not have access to the specified product');
            next('/');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        next('/');
    }
}

export default createRouter({
    // История переходов сохраняется
    history: createWebHistory(),
    // Роуты и компоненты
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
        },
        {
            path: `/category/:name_en`,
            name: 'category',
            component: Category,
            props: true,
        },
        {
            path: `/product/:id`,
            name: 'product',
            component: Product,
        },
        {
            path: `/product/:id/edit`,
            name: 'productEdit',
            component: ProductEdit,
            beforeEnter: checkRole,
        },
        {
            path: `/product/add`,
            name: 'productAdd',
            component: ProductAdd,
            beforeEnter: isAdminOrAuthor,
        },
        {
            path: '/brands',
            name: 'brands',
            component: Brands
        },
        {
            path: '/favourite',
            name: 'favourite',
            component: Favourite
        },
        {
            path: '/cart',
            name: 'cart',
            component: Cart
        },
        {
            path: '/customer_service',
            name: 'customer_service',
            component: CustomerService
        },
        {
            path: '/customer_service/delivery_and_payment',
            name: 'delivery_and_payment',
            component: DeliveryAndPayment
        },
        {
            path: '/customer_service/how_to_return',
            name: 'how_to_return',
            component: Return
        },
        {
            path: '/customer_service/user_agreement',
            name: 'user_agreement',
            component: UserAgreement
        },
        {
            path: '/customer_service/partners',
            name: 'partners',
            component: Partners
        },
        {
            path: '/customer_service/contacts',
            name: 'contacts',
            component: Contacts
        },
        {
            path: '/customer_service/about',
            name: 'about',
            component: About
        },
    ]
});