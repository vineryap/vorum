import { findById, makeFetchDocAction, makeFetchDocsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    category: (state) => {
      return (id) => {
        const category = findById(state.items, id)
        if (!category) return null

        return {
          ...category
        }
      }
    }
  },
  mutations: {},
  actions: {
    fetchCategories: ({ dispatch }) => {
      console.log('🔥 fetchCategories:', 'categories')
      return dispatch(
        'fetchCollectionDocs',
        { resource: 'categories' },
        { root: true }
      )
    },
    fetchCategoryById: makeFetchDocAction({ resource: 'categories' }),
    fetchCategoriesByIds: makeFetchDocsAction({ resource: 'categories' })
  }
}
