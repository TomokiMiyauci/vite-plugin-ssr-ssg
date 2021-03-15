import { ROOT_PATH } from './constants'
import { resolve } from 'path'
const toRootAbsolute = (...path: string[]): string =>
  resolve(ROOT_PATH, ...path)

export { toRootAbsolute }
