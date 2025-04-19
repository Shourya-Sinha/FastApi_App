import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// export default defineConfig({
//   plugins: [react()],
//   base: '/static/', // So your assets like index-XXX.js load from /static
//   build: {
//     outDir: '../Client/dist', // make sure dist is placed inside server's path
//   },
// })
export default defineConfig({
  plugins: [react()],
  base: '/static/', // Static path base
  build: {
    outDir: "dist", // default
  },
})