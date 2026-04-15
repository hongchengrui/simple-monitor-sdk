import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/web.ts', 'src/vue.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',
  external: ['@simple-monitor/integrations'],
})
