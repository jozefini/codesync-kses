import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
  },
  splitting: true,
  sourcemap: true,
  minify: true,
  clean: false,
  dts: true,
  outDir: './',
})
