import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ForumList from '@/components/ForumList.vue'
import data from '@/data.json'
import store from '@/store'

const category = data.categories[1]
const categoryName = category.name
const categoryId = category.id
const categoryDescription = category.description || 'some description.'
let forums = data.forums.filter((f) => f.categoryId === categoryId)
forums = forums.map((f) => {
  if (f.threads) {
    const lastThreadId = f.threads.slice(f.threads.length - 1)[0]
    const lastThread = data.threads.find((t) => t.id === lastThreadId)
    f.lastThreadId = lastThreadId
    f.lastThread = lastThread
    f.lastThreadUser = data.users.find((u) => u.id === lastThread.userId)
  }
  f.threadsCount = f.threads ? f.threads.length : 0
  return f
})

describe('Test for data-test with "category-" ', () => {
  it('Should display category link', () => {
    const props = { forums, categoryName, categoryId }
    assertElementExists({
      attrValue: 'category-link',
      props,
      expectation: true
    })
  })

  it('Should NOT display category link when no category id', () => {
    const props = { forums, categoryName, categoryId: null }
    assertElementExists({
      attrValue: 'category-link',
      props,
      expectation: false
    })
  })

  it('Should display category description', () => {
    const props = {
      forums,
      categoryName,
      categoryId,
      categoryDescription
    }
    assertElementExists({
      attrValue: 'category-description',
      props,
      expectation: true
    })
  })

  it('Should NOT display category description when no description.', () => {
    const props = {
      forums,
      categoryName,
      categoryId,
      categoryDescription: ''
    }
    assertElementExists({
      attrValue: 'category-description',
      props,
      expectation: false
    })
  })
})

describe('Test data-test with value "forum-*"', () => {
  it('Should display forum list with all child attributes.', () => {
    const props = {
      forums
    }

    assertElementExists({
      attrValue: 'forum-list',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-name',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-description',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-threads-count',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-title',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-username',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-published',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-fallback',
      props,
      expectation: true
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-avatar',
      props,
      expectation: true
    })
  })

  it('Should NOT display forum list when forums is empty.', () => {
    const props = {
      forums: []
    }
    assertElementExists({
      attrValue: 'forum-list',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-name',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-description',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-threads-count',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-title',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-username',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-published',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-fallback',
      props,
      expectation: false
    })
    assertElementExists({
      attrValue: 'forum-last-thread-user-avatar',
      props,
      expectation: false
    })
  })
})

function assertElementExists({ attrValue, props, expectation }) {
  const wrapper = mount(ForumList, {
    props,
    global: { provide: { store } }
  })
  expect(wrapper.find(`[data-test="${attrValue}"]`).exists()).toBe(expectation)
}
