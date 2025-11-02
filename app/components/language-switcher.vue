<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    setLocale(value as 'en' | 'uk' | 'pl' | 'es' | 'it' | 'de')
  }
})

console.log(locales.value)
</script>

<template>
  <USelectMenu
    v-model="currentLocale"
    :items="locales"
    label-key="name"
    value-key="code"
    class="w-40"
    size="sm"
  />
</template>

