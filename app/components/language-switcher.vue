<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    setLocale(value as 'en' | 'uk' | 'pl' | 'es' | 'it' | 'de')
  }
})

const flagMap: Record<string, string> = {
  en: '🇬🇧',
  uk: '🇺🇦',
  pl: '🇵🇱',
  es: '🇪🇸',
  it: '🇮🇹',
  de: '🇩🇪'
}

const localesWithFlags = computed(() => {
  return locales.value.map(loc => ({
    ...loc,
    name: `${flagMap[loc.code] || '🌐'} ${loc.name}`
  }))
})
</script>

<template>
  <USelectMenu
    v-model="currentLocale"
    :items="localesWithFlags"
    label-key="name"
    value-key="code"
    class="w-40"
    size="sm"
  />
</template>

