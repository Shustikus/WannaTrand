<script>
import "./notification.css";
import NotificationMixin from "./notification.js"

export default {
  mixins: [NotificationMixin],
};
</script>

<template>
  <div class="Toastify">
    <div :class="{ 'slide-out': shouldSlideOut }"
         class="Toastify_toast-container Toastify_toast-container--bottom-right">
      <div class="Toastify_toast">
        <div class="Toastify_toast-body" role="alert">
          <div>Пароли не совпадают. Пожалуйста, введите пароль и подтверждение пароля снова.</div>
        </div>
      </div>
    </div>
  </div>
</template>
