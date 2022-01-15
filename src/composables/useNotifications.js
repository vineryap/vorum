import { reactive } from 'vue'

const notifications = reactive([])

const removeNotification = (id) => {
  const index = notifications.findIndex((n) => n.id === id)
  notifications.splice(index, 1)
}

const addNotification = ({ message, type, timeout }) => {
  const id = Math.random() + Date.now()

  notifications.push({
    id,
    message,
    type
  })

  if (timeout) {
    const hasNotification = notifications.findIndex((n) => n.id === id) !== -1
    setTimeout(() => {
      if (hasNotification) {
        removeNotification(id)
      }
    }, timeout)
  }
}

export default function useNotifications () {
  return {
    notifications,
    addNotification,
    removeNotification
  }
}
