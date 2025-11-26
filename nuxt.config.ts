// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-auth-utils'
  ],

  css: ['./app/assets/styles/main.css'],

  routeRules: {
    '/app/**': {
      appMiddleware: 'only-secure-route'
    }
  }
})
