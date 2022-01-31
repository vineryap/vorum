import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ForumList from '@/components/ForumList.vue'
import data from '@/data.json'
import { useStore } from 'vuex'

const category = data.categories[1]
const categoryName = category.name
const categoryId = category.id
const categoryDescription = category.description
const forums = data.forums.filter((f) => f.categoryId === categoryId)

const store = useStore()

describe('Components | ForumList', () => {
  it('should render category link', () => {
    const wrapper = mount(ForumList, {
      props: { forums, categoryName, categoryId },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="category-link"]').exists()).toBe(true)
  })

  it('should NOT render category link', () => {
    const wrapper = mount(ForumList, {
      props: { forums, categoryName, categoryId: null },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="category-link"]').exists()).toBe(false)
  })

  it('should render category description', () => {
    const wrapper = mount(ForumList, {
      props: {
        forums,
        categoryName,
        categoryId,
        categoryDescription: 'something'
      },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="category-description"]').exists()).toBe(
      true
    )
  })

  it('should NOT render category description', () => {
    const wrapper = mount(ForumList, {
      props: {
        forums,
        categoryName,
        categoryId,
        categoryDescription: ''
      },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="category-description"]').exists()).toBe(
      false
    )
  })

  it('should render forum list', () => {
    const wrapper = mount(ForumList, {
      props: {
        forums
      },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="forum-list"]').exists()).toBe(true)
  })

  it('should NOT render forum list', () => {
    const wrapper = mount(ForumList, {
      props: {
        forums: []
      },
      global: { provide: { store } }
    })
    expect(wrapper.find('[data-test="forum-list"]').exists()).toBe(false)
  })
})
