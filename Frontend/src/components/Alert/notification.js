// notification.js

export default {
    data() {
        return {
            shouldSlideOut: false
        };
    },
    methods: {},
    mounted() {
        // После монтирования компонента, запускаем таймер для закрытия уведомления через 5 секунд
        setTimeout(() => {
            this.shouldSlideOut = true;
        }, 5000);
    }
};