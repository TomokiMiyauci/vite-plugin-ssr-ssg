export const isTest =
  process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
