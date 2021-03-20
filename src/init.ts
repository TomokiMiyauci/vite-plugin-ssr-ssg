import { writeFileSync } from 'fs'
import { loadConfigFromFile } from 'vite'
import { generateFiles } from './vue3'
import { generateFiles as genPraectTemplate } from './preact'
import { generateFiles as genReactTemplate } from './react'

const frameworks = ['react', 'preact', 'vue', 'svelte', 'vanilla'] as const
const frameworksWithExt = frameworks
  .filter((name) => name !== 'vanilla')
  .map((name) => [name, `${name}JS`, `${name}TS`] as const)
  .flat()

const defaultFrameworkMap = frameworksWithExt.reduce((acc, cur) => {
  return { ...acc, [cur]: false }
}, {} as FrameworkMap)

const isTS = (devDependencies: Record<string, string>): boolean =>
  'typescript' in devDependencies

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

  const scripts = {
    ..._scripts,
    dev: 'vite-ssrg dev',
    build: 'vite-ssrg build',
    generate: 'vite-ssrg generate',
    serve: 'vite-ssrg preview'
  }

  const dependencies: Record<string, string> = {
    ..._dependencies,
    ...getDependency(frameworkMap)
  }
  console.log(isTS(_devDependencies), dependencies, frameworkMap)

  const devDependencies: Record<string, string> = {
    ..._devDependencies,
    ...getDevDependency(frameworkMap)
  }

  const packageJson = {
    ...config,
    scripts,
    dependencies,
    devDependencies
  } as Record<string, string>

  generate(isTS(_devDependencies))

  writeFileSync(path, JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const detectFramework = (pluginNames: string[]) => {
  if (pluginNames.includes('vite:vue')) return 'VUE'
  else if (pluginNames.includes('react-refresh')) return 'REACT'
  else if (pluginNames.includes('preact:config')) return 'PREACT'
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
    return genReactTemplate
  } else if (preact) {
    return genPraectTemplate
  } else if (vue) {
    return generateFiles
  } else if (svelte) {
    return () => {}
  } else return () => {}
}

const getDependency = ({
  react,
  vue,
  preact,
  svelte
}: FrameworkMap): Record<string, string> => {
  if (react) {
    return {
      'react-dom': '^17.0.0'
    }
  } else if (preact) {
    return {
      'preact-router': '^3.2.1'
    }
  } else if (vue) {
    return {
      'vue-router': '^4.0.5'
    }
  } else if (svelte) {
    return {}
  } else return {}
}

const getDevDependency = ({
  react,
  vue,
  preact,
  svelte
}: FrameworkMap): Record<string, string> => {
  if (react) {
    return {}
  } else if (preact) {
    return {
      'preact-render-to-string': '^5.1.16'
    }
  } else if (vue) {
    return {
      '@vue/server-renderer': '^3.0.7'
    }
  } else if (svelte) {
    return {}
  } else return {}
}

export { rewritePackageJson }
