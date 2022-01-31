import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
const path = require('path')
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [Vue(), Icons({ compiler: 'vue3' })],
  test: {
    environment: 'happy-dom'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
