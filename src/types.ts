export type Render = (
  url: string,
  manifest: Record<string, string[] | undefined>
) => Promise<{
  bodyTags: string
  headTags?: string
  htmlAttrs?: string
  bodyAttrs?: string
}>

interface BuildOptions {
  outDirClient: string
  outDirServer: string
}

export type RoutesOption = string[] | (() => Promise<string[]>)

interface GenerateOptions {
  routes: RoutesOption
}

export interface PluginOptions {
  build: Partial<BuildOptions>
  generate: Partial<GenerateOptions>
}
