import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  external: ['@xmldom/xmldom'],
})
