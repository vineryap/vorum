import useNotifications from '@/composables/useNotifications'
import { beforeEach, describe, expect, test } from 'vitest'

const {
  notifications,
  addNotification,
  removeNotification,
  clearNotifications
} = useNotifications()

beforeEach(() => {
  clearNotifications()
})

describe('Composables / useNotifications', () => {
  test('notifications should be empty array by default.', () => {
    expect(notifications).toHaveLength(0)
  })

  test('notification should be added.', () => {
    const notification = { message: 'notification one' }
    addNotification(notification)

    expect(notifications).toHaveLength(1)
  })

  test('notification should be removed.', () => {
    const notification = { message: 'notification one' }
    addNotification(notification)
    const index = notifications.length - 1
    removeNotification(index)

    expect(notifications).toHaveLength(0)
  })

  test('notification should be removed automatically by timeout.', () => {
    const notification = { message: 'notification one', timeout: 5000 }
    addNotification(notification)
    setTimeout(() => {
      expect(notifications).toHaveLength(0)
    }, 5000)
  })
})
