import {
  getRoutes,
  path2RouteObject,
  bracketRegex
} from '../../../src/vue3/routes'

describe('path2RouteObject', () => {
  const table = [
    [
      './pages/Index.vue',
      {
        name: 'Index',
        path: '/'
      }
    ],
    [
      './pages/about.vue',
      {
        name: 'about',
        path: '/about'
      }
    ],
    [
      './pages/[id].vue',
      {
        name: 'id',
        path: '/:id'
      }
    ],
    [
      './pages/users/[user].vue',
      {
        name: 'user',
        path: '/:user'
      }
    ]
  ] as const
  it.each(table)('.path2RouteObject(%s)', (path, obj) => {
    expect(path2RouteObject(path)).toEqual(obj)
  })
})

describe('bracketRegex', () => {
  const table = [
    ['[id].vue', true],
    ['[id].', false],
    ['[id]', false],
    ['id.vue', false],
    ['id', false]
  ] as const
  it.each(table)('bracketRegex.test(%s): %s', (pattern, result) => {
    expect(bracketRegex.test(pattern)).toBe(result)
  })
})

describe('getRoutes', () => {
  it('should return path of / when it gives Index', () => {
    const pages = {
      'Index.ts': {
        default: 'index.ts'
      }
    }

    const result = getRoutes(pages)

    expect(result).toEqual([
      { component: 'index.ts', name: 'Index', path: '/' }
    ])
  })

  it('should return path of /about when it gives about', () => {
    const pages = {
      './pages/about.ts': {
        default: {}
      }
    }

    const result = getRoutes(pages)

    expect(result).toEqual([{ component: {}, name: 'about', path: '/about' }])
  })
})
