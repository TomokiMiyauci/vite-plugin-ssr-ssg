/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType as PreactComponentType } from 'preact'
import { FRAMEWORKS } from './constants'
import { RouteComponent, RouteRecordRaw } from 'vue-router'
import { ComponentType as ReactComponentType } from 'react'
import { path2Absolute } from './utils'
import { join } from 'path'
import { bracketRegex } from './regex'

type Framework = Exclude<typeof FRAMEWORKS[number], 'svelte' | 'vanilla'>
type Component<T extends Framework> = T extends 'vue'
  ? RouteComponent
  : T extends 'react'
  ? ReactComponentType
  : T extends 'preact'
  ? PreactComponentType
  : never

type NamePath = {
  name: string
  path: string
}

type Route<T extends Framework> = T extends 'vue'
  ? RouteRecordRaw
  : { Component: Component<T> } & NamePath

type RouteOptions = {
  module: string
  baseDirs: string | string[]
}

const index2EmptyString = (val: string): string => (val === 'index' ? '' : val)

const path2RouteObject = (
  path: string
): {
  name: string
  path: string
} => {
  const absoluteFilePath = path2Absolute(path, 'pages')
  const splittedFilePath = absoluteFilePath.split('/')
  const fileNameWithExt = splittedFilePath.slice(-1)[0]
  const fileName = index2EmptyString(fileNameWithExt.split('.')[0])
  const filePath = splittedFilePath.slice(0, -1)
  const isDynamicPath = bracketRegex.test(fileNameWithExt)
  const formattedFileName = isDynamicPath
    ? fileName.replace(/\[/, '').replace(/\]/, '')
    : fileName
  const _path = isDynamicPath ? `:${formattedFileName}` : formattedFileName

  return {
    name:
      [...filePath, formattedFileName].filter((val) => !!val).join('-') ||
      'index',
    path: join('/', ...filePath, _path)
  }
}

const defaultRouteOptions: RouteOptions = {
  module: 'default',
  baseDirs: ['pages']
}

const getRoutes = <T extends Framework>(
  pages: Record<
    string,
    {
      [key: string]: any
    }
  >,
  routeOptions?: Partial<RouteOptions>
): Route<T>[] => {
  const { module } = { ...defaultRouteOptions, ...routeOptions }

  return Object.entries(pages).map(([path, fn]) => {
    const { name, path: _path } = path2RouteObject(path)

    return {
      name,
      path: _path,
      Component: fn[module],
      component: fn[module]
    } as any
  })
}

export { getRoutes, path2RouteObject, bracketRegex }
