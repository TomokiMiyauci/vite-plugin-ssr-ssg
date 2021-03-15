export const isTest =
  process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
export const ROOT_PATH = require('app-root-path').path
