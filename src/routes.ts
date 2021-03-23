/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType as PreactComponentType } from 'preact'
import { FRAMEWORKS } from './constants'
import { RouteComponent, RouteRecordRaw } from 'vue-router'
import { ComponentType as ReactComponentType } from 'react'

const bracketRegex = /\[.+\]\..+$/

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

const path2RouteObject = (
  path: string
): {
  name: string
  path: string
} => {
  const fileName = path.split('/').slice(-1)[0]
  const isDynamicPath = bracketRegex.test(fileName)
  const name = isDynamicPath
    ? fileName.split('.')[0].replace(/\[/, '').replace(/\]/, '')
    : fileName.split('.')[0]
  const _path = isDynamicPath
    ? `/:${name}`
    : name.toLowerCase() === 'index'
    ? '/'
    : `/${name?.toLowerCase()}`

  return {
    name,
    path: _path
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

// const getComponentKey = (framework: Framework): 'Component' | 'component' => {
//   switch (framework) {
//     case 'vue': {
//       return 'component'
//     }

//     case 'react':
//     case 'preact': {
//       return 'Component'
//     }
//   }
// }

export { getRoutes }
