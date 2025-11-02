<template>
  <UApp>
    <ClientOnly>
      <QrGenerator />
      <template #fallback>
        <div class="flex justify-center items-center min-h-screen p-8">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <p>Loading QR Code Generator...</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </UApp>
</template>
