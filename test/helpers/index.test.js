import { describe, expect, test } from 'vitest'
import {
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
  makeRemoveDoc,
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from '@/helpers'

describe('Helpers / formatNoun()', () => {
  test('formatNoun should return singular noun when the number is 1.', () => {
    const noun = formatNoun(1, 'thread', 'threads')
    expect(noun).toEqual('thread')
  })

  test('formatNoun should return plural noun when the number is bigger than 1.', () => {
    const noun = formatNoun(2, 'thread', 'threads')
    expect(noun).toEqual('threads')
  })

  test('formatNoun should return plural noun when the number is 0.', () => {
    const noun = formatNoun(0, 'thread', 'threads')
    expect(noun).toEqual('threads')
  })
})

describe('Helpers / findById()', () => {
  test('findById should return null if resource is null.', () => {
    const result = findById(null, 1)
    expect(result).toEqual(null)
  })

  test('findById should return an object from the resource.', () => {
    const resource = [{ id: 1 }]
    const result = findById(resource, 1)
    expect(result).toEqual({ id: 1 })
  })

  test('findById should return null if element with target id is not exists in the resource.', () => {
    const resource = [{ id: 1 }]
    const result = findById(resource, 2)
    expect(result).toEqual(null)
  })
})

describe('Helpers / filterById()', () => {
  const resources = [
    { userId: 1 },
    { userId: 7 },
    { userId: 7 },
    { userId: 10 }
  ]
  test('filterById should return empty array if no match.', () => {
    const result = filterById({ resources, resourceKey: 'userId', id: 8 })
    expect(result).toHaveLength(0)
  })

  test('filterById should return an array of object from the resource.', () => {
    const result = filterById({ resources, resourceKey: 'userId', id: 7 })
    expect(result).toEqual([{ userId: 7 }, { userId: 7 }])
  })
})
