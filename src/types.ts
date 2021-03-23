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

interface GenerateOptions {
  routes: string[]
}

export interface PluginOptions {
  build: Partial<BuildOptions>
  generate: Partial<GenerateOptions>
}
