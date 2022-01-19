<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="notification"
        :class="
          notification.type ? `notification-type-${notification.type}` : ''
        "
      >
        <span>{{ notification.message }}</span>
        <button class="w-5" @click="removeNotification(notification.id)">
          x
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import useNotifications from '@/composables/useNotifications'

export default {
  setup() {
    const { notifications, removeNotification } = useNotifications()
    return { notifications, removeNotification }
  }
}
</script>

<style scoped>
.notifications {
  @apply fixed bottom-5 right-4;
}
.notification {
  @apply bg-white flex justify-between w-80 shadow-md px-3 py-5 mb-2 border-l-7px border-l-blue-500 rounded;
}
.notification.notification-type-error {
  @apply border-l-7px border-l-red-500;
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.8s ease;
}
</style>
