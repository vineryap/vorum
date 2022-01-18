const formatNoun = (number, singularForm, pluralForm) => {
  return number > 1 || number === 0 ? pluralForm : singularForm
}

const findById = (resources, id) => {
  if (!resources) return null
  const resource = resources.find((r) => r.id === id)
  return resource || null
}

const filterById = ({ resources, resourceKey, id }) => {
  return resources.filter((r) => r[resourceKey] === id)
}

const findResourceIndex = (resources, resourceId) => {
  return resources.findIndex((r) => r.id === resourceId)
}

const isResourceExists = (resources, resourceId) => {
  return findResourceIndex(resources, resourceId) !== -1
}

const insertResource = (resources, newResource) => {
  resources.push(newResource)
}

const updateResource = (resources, resourceIndex, newResource) => {
  resources[resourceIndex] = newResource
}

const upsert = (resources, newResource) => {
  newResource = docToResource(newResource)
  if (newResource.id && isResourceExists(resources, newResource.id)) {
    const postIndex = findResourceIndex(resources, newResource.id)
    updateResource(resources, postIndex, newResource)
  } else {
    insertResource(resources, newResource)
  }
}

const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') return doc
  return {
    ...doc.data(),
    id: doc.id
  }
}

const makeAppendChildtoParentMutation = ({ child }) => {
  return (state, { parentId, childId }) => {
    const resource = findById(state.items, parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}

const makeSetResourceProperty = (propertyName) => {
  return (state, { resourceId, value }) => {
    const resource = findById(state.items, resourceId)
    resource[propertyName] = value
  }
}

const makeFetchDocAction = ({ resource }) => {
  return ({ dispatch }, payload) => {
    return dispatch('fetchDoc', { resource, ...payload }, { root: true })
  }
}

const makeFetchDocsAction = ({ resource }) => {
  return ({ dispatch }, payload) => {
    return dispatch('fetchDocs', { resource, ...payload }, { root: true })
  }
}
const makeFetchDocsQueryAction = ({ resource }) => {
  return ({ dispatch }, payload) => {
    return dispatch(
      'fetchDocsByQuery',
      { resource, ...payload },
      { root: true }
    )
  }
}

const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length)
}

const getRandomElement = (array) => {
  const index = getRandomIndex(array)
  return array[index]
}

function sortByDate(array, direction) {
  return array.sort(function (a, b) {
    if (direction === 'desc') {
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    }
    return new Date(a.publishedAt) - new Date(b.publishedAt)
  })
}

function removeArrayElement(array, index) {
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}

function makeRemoveDoc() {
  return (state, { id }) => {
    const index = findResourceIndex(state.items, id)
    removeArrayElement(state.items, index)
  }
}

export {
  formatNoun,
  findById,
  filterById,
  findResourceIndex,
  isResourceExists,
  upsert,
  docToResource,
  makeAppendChildtoParentMutation,
  makeSetResourceProperty,
  makeFetchDocAction,
  makeFetchDocsAction,
  getRandomElement,
  makeFetchDocsQueryAction,
  sortByDate,
  makeRemoveDoc
}
export * from './store'
