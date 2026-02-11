import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/*.ts', '!src/bem.ts', '!src/global-config.ts'],
    platform: 'neutral',
    dts: {
      tsconfig: '../tsconfig.runtime.json',
    },
  },
])
