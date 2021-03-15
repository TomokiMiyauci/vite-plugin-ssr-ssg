import { resolve } from 'path'
const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)
export { toRootAbsolute }
