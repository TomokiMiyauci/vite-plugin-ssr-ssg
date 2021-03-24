import { getRoutes, path2RouteObject, bracketRegex } from '../../src/routes'

describe('path2RouteObject', () => {
  const table = [
    [
      './pages/Index.vue',
      {
        name: 'Index',
        path: '/Index'
      }
    ],
    [
      './pages/index.vue',
      {
        name: 'index',
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
      './pages/[Id].vue',
      {
        name: 'Id',
        path: '/:Id'
      }
    ],
    [
      './pages/users/user.vue',
      {
        name: 'users-user',
        path: '/users/user'
      }
    ],
    [
      './pages/users/[user].vue',
      {
        name: 'users-user',
        path: '/users/:user'
      }
    ],
    [
      './pages/users/Index.vue',
      {
        name: 'users-Index',
        path: '/users/Index'
      }
    ],
    [
      './pages/users/index.vue',
      {
        name: 'users',
        path: '/users'
      }
    ],
    [
      './pages/users/user/index.vue',
      {
        name: 'users-user',
        path: '/users/user'
      }
    ],
    [
      './pages/users/user/[id].vue',
      {
        name: 'users-user-id',
        path: '/users/user/:id'
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
      {
        Component: 'index.ts',
        component: 'index.ts',
        name: 'Index',
        path: '/Index'
      }
    ])
  })

  it('should return path of /about when it gives about', () => {
    const pages = {
      './pages/about.ts': {
        default: {}
      }
    }

    const result = getRoutes(pages)

    expect(result).toEqual([
      { Component: {}, component: {}, name: 'about', path: '/about' }
    ])
  })
})
