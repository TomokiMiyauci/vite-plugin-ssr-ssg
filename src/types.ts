export type Render = (
  url: string,
  manifest: Record<string, string[] | undefined>
) => Promise<{
  bodyTags: string
  headTags: string
  htmlAttrs: string
  bodyAttrs?: string
}>
