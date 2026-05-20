import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: {
    entry: {
      index: 'src/index.ts',
    },
  },
  clean: true,
  sourcemap: true,
  target: 'es2020',
  splitting: false,
  esbuildOptions(options) {
    options.banner = {
      js: '// @simple-monitor/utils',
    };
  },
  treeshake: true,
});
