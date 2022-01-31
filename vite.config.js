import { defineConfig } from 'vite'
const path = require('path')
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import eslintPlugin from 'vite-plugin-eslint'
import analyze from 'rollup-plugin-analyzer'

const removeDataTestAttr = (node) => {
  if (process.env.NODE_ENV === 'production') {
    if (node.type === 1 /*NodeTypes.ELEMENT*/) {
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i]
        if (
          p &&
          p.type === 6 /*NodeTypes.ATTRIBUTE*/ &&
          p.name === 'data-test'
        ) {
          node.props.splice(i, 1)
          i--
        }
      }
    }
  }
}

export default defineConfig({
  build: {
    target: ['es2015'],
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
    vue({
      template: {
        compilerOptions: {
          nodeTransforms: [removeDataTestAttr]
        }
      }
    }),
    WindiCSS(),
    Icons({ compiler: 'vue3' }),
    eslintPlugin({ fix: true })
  ]
})
