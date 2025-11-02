<template>
  <UApp>
    <ClientOnly>
      <QrGenerator />
      <template #fallback>
        <div class="flex justify-center items-center min-h-screen p-8">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <p>{{ $t('loading') }}</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

const canonicalUrl = computed(() => {
  const baseUrl = config.public?.siteUrl || ''
  // route.fullPath already includes the locale prefix when using prefix strategy
  return `${baseUrl}${route.fullPath}`
})

useHead({
  title: () => t('seo.title'),
  htmlAttrs: {
    lang: () => locale.value
  },
  meta: [
    {
      name: 'description',
      content: () => t('seo.description')
    },
    {
      property: 'og:title',
      content: () => t('seo.title')
    },
    {
      property: 'og:description',
      content: () => t('seo.description')
    },
    {
      property: 'og:url',
      content: () => canonicalUrl.value
    },
    {
      name: 'twitter:title',
      content: () => t('seo.title')
    },
    {
      name: 'twitter:description',
      content: () => t('seo.description')
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: () => canonicalUrl.value
    }
  ]
})
</script>
