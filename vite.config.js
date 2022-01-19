import { defineConfig } from 'vite'
const path = require('path')
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import eslintPlugin from 'vite-plugin-eslint'
import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [analyze()]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    Icons({ compiler: 'vue3' }),
    eslintPlugin({ fix: true })
  ]
})
