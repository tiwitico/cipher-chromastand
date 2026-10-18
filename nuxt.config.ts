// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  telemetry: false,
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    googleGenAiUseVertex: process.env.GOOGLE_GENAI_USE_VERTEX || '',
    googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT || '',
    googleCloudLocation: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    public: {
      appName: 'AuraHair Studio'
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'AuraHair Studio | Hair Styling & Color Mixer Simulation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Virtual selfie hair styling & color simulation with multi-angle views and professional salon color formulation.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' }
      ]
    }
  }
})
