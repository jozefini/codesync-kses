import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    rsc: 'src/rsc.ts',
  },
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
})
