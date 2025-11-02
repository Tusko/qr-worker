<script setup lang="ts">
const color = defineModel<string>({ required: true, default: '#000000' })

const props = defineProps<{
  label: string
}>()

const chip = computed(() => ({ backgroundColor: color.value }))
</script>

<template>
  <UPopover>
    <UButton :label="props.label" color="neutral" variant="outline">
      <template #leading>
        <span :style="chip" class="size-3 rounded-full border-1 border-gray-300" />
      </template>
    </UButton>

    <template #content>
      <UColorPicker v-model="color" class="p-2" />
    </template>
  </UPopover>
</template>