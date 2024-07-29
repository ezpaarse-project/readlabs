// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      title: 'ReadLabs: API d\'interrogation de données laboratoires du CNRS',
      charset: 'utf-8',
      meta: [],
      link: [],
    },
  },

  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV || 'development',
      version: process.env.VERSION || 'development',
      APIHost: process.env.API_HOST || 'http://localhost:59701',
    }
  },

  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  build: {
    transpile: ['vuetify'],
  },

  i18n: {
    vueI18n: './config/i18n.js'
  },

  pinia: {
    storesDirs: ['./store/**'],
  },

  plugins: [
    '~/plugins/vuetify',
    '~/plugins/fetch',
    '~/plugins/highlight.client'
  ],

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  compatibilityDate: '2024-07-15',
})