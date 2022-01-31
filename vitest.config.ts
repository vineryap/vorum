import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
const path = require('path')
import Icons from 'unplugin-icons/vite'

const customElements = [
  'ForumList',
  'base-avatar-image',
  'router-link',
  'base-time'
]
const isCustomElement = (tag) => customElements.includes(tag)

export default defineConfig({
  plugins: [
    Vue({ template: { compilerOptions: { isCustomElement } } }),
    Icons({ compiler: 'vue3' })
  ],
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
