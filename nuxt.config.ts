// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/google-fonts', '@nuxtjs/i18n'],
  css: ['~/assets/main.css'],
  app: {
    head: {
      titleTemplate: '%s | QR Worker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        {
          name: 'keywords',
          content: 'QR code generator, QR code maker, free QR code, QR code online, QR code creator, generate QR code, custom QR code, WiFi QR code, calendar QR code'
        },
        { name: 'author', content: 'QR Worker' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#18181b' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/favicon.png' },
        { property: 'og:image:alt', content: 'QR Code Generator' },
        { property: 'og:site_name', content: 'QR Worker' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image', content: '/favicon.png' },
        { name: 'twitter:image:alt', content: 'QR Code Generator' },
        // Additional SEO
        { name: 'application-name', content: 'QR Worker' },
        { name: 'apple-mobile-web-app-title', content: 'QR Generator' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' }
      ]
    }
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true
  },
  i18n: {
    locales: [
      { code: 'uk', name: 'Українська', file: 'uk.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'uk',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  }
})
