import { resolveConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ssrgPlugin from 'vite-plugin-ssr-ssg'
describe('resolveConfig', () => {
  it('should be undefined when it do not give options', async () => {
    const config = await resolveConfig(
      {
        plugins: [vue()]
      },
      'build'
    )

    expect('ssrgOptions' in config).toBeFalsy()
  })

  it('should be true when plugin use', async () => {
    const config = await resolveConfig(
      {
        plugins: [vue(), ssrgPlugin()]
      },
      'build'
    )

    expect('ssrgOptions' in config).toBeTruthy()
  })

  it('should be true when plugin use', async () => {
    const build = {
      outDirClient: 'dist',
      outDirServer: 'server'
    }
    const generate = {
      routes: ['ff']
    }
    const config = await resolveConfig(
      {
        plugins: [
          vue(),
          {
            name: 'hoge',
            config: (userConfig) => {
              userConfig.ssrgOptions = {
                generate,
                build
              }
            }
          }
        ]
      },
      'build'
    )

    const { build: b, generate: g } = config?.ssrgOptions || {}
    expect(b).toEqual(build)
    expect(g).toEqual(generate)
  })
})
