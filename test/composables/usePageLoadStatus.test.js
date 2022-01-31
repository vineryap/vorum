import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { beforeEach, describe, expect, test } from 'vitest'
import { isReadonly, defineEmits } from 'vue'

const { isPageReady, pageLoaded } = usePageLoadStatus()

describe('Composables / usePageLoadStatus', () => {
  test('isPageReady should be false by default.', () => {
    expect(isPageReady.value).toEqual(false)
  })

  test('isPageReady should be readonly.', () => {
    expect(isReadonly(isPageReady)).toEqual(true)
  })

  test('isPageReady should be true when pagedLoaded is called.', () => {
    pageLoaded(() => {})
    expect(isPageReady.value).toEqual(true)
  })
})
