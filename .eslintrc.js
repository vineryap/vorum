module.exports = {
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  plugins: ['vue'],
  parser: 'vue-eslint-parser',
  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/require-default-prop':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/script-setup-uses-vars':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-setup-props-destructure':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/multi-word-component-names':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  }
}
