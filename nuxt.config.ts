// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/globals.css'],
  // Rimuove l'SSR per un'integrazione SPA più semplice con l'Auth Django, oppure no.
  // Per ora manteniamo SSR = true di default in Nuxt.
  app: {
    baseURL: '/superenalotto/',
    head: {
      title: 'VibeProject - Hub',
    }
  }
})
