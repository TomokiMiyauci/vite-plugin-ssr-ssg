import {
  toIndexHTML,
  startWithSlash,
  addStartSlash,
  endWithSlash,
  removeEndSlash,
  removeDuplicate
} from '../../src/utils'

describe('toIndexHTML', () => {
  const table = [
    ['index.html', 'index.html'],
    ['/index.html', '/index.html'],
    ['about.html', 'about/index.html'],
    ['dist/about.html', 'dist/about/index.html'],
    ['dist/users/1.html', 'dist/users/1/index.html'],
    ['index.css', 'index.css'],
    ['dist/index.js', 'dist/index.js'],
    ['/pages/about.html', '/pages/about/index.html']
  ]
  it.each(table)('toIndexHTML %d', (path, expected) => {
    expect(toIndexHTML(path)).toBe(expected)
  })
})

describe('startWithSlash', () => {
  const table = [
    ['index', false],
    ['about.html', false],
    ['a/a', false],
    ['/', true],
    ['//', true]
  ] as const
  it.each(table)('startWithSlash %d', (val, expected) => {
    expect(startWithSlash(val)).toBe(expected)
  })
})

describe('addStartSlash', () => {
  const table = [
    ['index', '/index'],
    ['about.html', '/about.html'],
    ['a/a', '/a/a'],
    ['/', '/'],
    ['//', '//']
  ] as const
  it.each(table)('addStartSlash %d', (val, expected) => {
    expect(addStartSlash(val)).toBe(expected)
  })
})

describe('endWithSlash', () => {
  const table = [
    ['index', false],
    ['about.html', false],
    ['a/a', false],
    ['a/a/', true],
    ['/', true],
    ['//', true]
  ] as const
  it.each(table)('endWithSlash %d', (val, expected) => {
    expect(endWithSlash(val)).toBe(expected)
  })
})

describe('removeEndSlash', () => {
  const table = [
    ['index', 'index'],
    ['about.html', 'about.html'],
    ['about/', 'about'],
    ['a/a', 'a/a'],
    ['a/a/', 'a/a'],
    ['/', '/'],
    ['//', '/']
  ] as const
  it.each(table)('removeEndSlash %d', (val, expected) => {
    expect(removeEndSlash(val)).toBe(expected)
  })
})

describe('removeDuplicate', () => {
  const table = [
    [[''], ['']],
    [['index'], ['index']],
    [['index', 'index'], ['index']]
  ] as const
  it.each(table)('removeDuplicate %d', (val, expected) => {
    expect(removeDuplicate(val)).toEqual(expected)
  })
})
