<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed({
  get: () => locale.value,
  set: async (value: string) => {
    const newLocale = value as 'en' | 'uk' | 'pl' | 'es' | 'it' | 'de'
    // Set locale first to ensure translations are loaded (with lazy: true)
    await setLocale(newLocale)
    const path = switchLocalePath(newLocale)
    await navigateTo(path)
  }
})

const flagMap: Record<string, string> = {
  uk: '🇺🇦',
  en: '🇬🇧',
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

