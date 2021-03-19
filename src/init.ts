import { writeFileSync } from 'fs'
import { loadConfigFromFile } from 'vite'
import { generateFiles } from './vue3'

const frameworks = ['react', 'preact', 'vue', 'svelte', 'vanilla'] as const
const frameworksWithExt = frameworks
  .filter((name) => name !== 'vanilla')
  .map((name) => [name, `${name}JS`, `${name}TS`] as const)
  .flat()

const defaultFrameworkMap = frameworksWithExt.reduce((acc, cur) => {
  return { ...acc, [cur]: false }
}, {} as FrameworkMap)

type FrameworkMap = Readonly<
  {
    [P in typeof frameworksWithExt[number]]: boolean
  }
>

const rewritePackageJson = async (path: string): Promise<void> => {
  const {
    default: {
      scripts: _scripts,
      dependencies: _dependencies,
      devDependencies: _devDependencies,
      ...config
    }
  } = await import(path)
  const scripts = {
    ..._scripts,
    dev: 'vite-ssrg dev',
    build: 'vite-ssrg build',
    generate: 'vite-ssrg generate',
    serve: 'vite-ssrg preview'
  }

  const dependencies = {
    ..._dependencies,
    'vue-router': '^4.0.5'
  }

  const devDependencies = {
    ..._devDependencies,
    '@vue/server-renderer': '^3.0.7'
  }

  const packageJson = {
    ...config,
    scripts,
    dependencies,
    devDependencies
  } as Record<string, string>

  const { config: userConfig } =
    (await loadConfigFromFile({
      command: 'serve',
      mode: ''
    })) ?? {}

  const pluginNames = userConfig?.plugins
    ?.map((plugin) => {
      if (Array.isArray(plugin)) {
        return plugin.map(({ name }) => name)
      } else {
        return plugin.name
      }
    })
    .flat()

  const framework = pluginNames ? detectFramework(pluginNames) : 'UNKNOWN'
  const frameworkMap = getFrameworkMap(framework, defaultFrameworkMap)
  const generate = generatorFactory(frameworkMap)

  generate()

  writeFileSync(path, JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const detectFramework = (pluginNames: string[]) => {
  if (pluginNames.includes('vite:vue')) return 'VUE'
  else if (pluginNames.includes('vite:react')) return 'REACT'
  else if (pluginNames.includes('vite:preact')) return 'PREACT'
  else return 'UNKNOWN'
}

const getFrameworkMap = (
  framework: 'VUE' | 'REACT' | 'PREACT' | 'UNKNOWN',
  frameworks: FrameworkMap
) => {
  switch (framework) {
    case 'VUE': {
      return { ...frameworks, vue: true, vueTS: true }
    }

    case 'REACT': {
      return { ...frameworks, react: true, reactTS: true }
    }

    case 'PREACT': {
      return { ...frameworks, preact: true, preactTS: true }
    }

    case 'UNKNOWN': {
      return { ...frameworks, vanilla: true }
    }
  }
}

const generatorFactory = ({ react, vue, preact, svelte }: FrameworkMap) => {
  if (react) {
    return () => {}
  } else if (preact) {
    return () => {}
  } else if (vue) {
    return generateFiles
  } else if (svelte) {
    return () => {}
  } else return () => {}
}

export { rewritePackageJson }
