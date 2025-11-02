<template>
  <div class="flex justify-center p-4 md:p-8">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h2 class="text-2xl font-semibold">QR Code Generator</h2>
      </template>

      <div class="space-y-6">
        <URadioGroup
          v-model="qrType"
          :items="qrTypeOptions"
          legend="QR Code Type:"
          orientation="horizontal"
          variant="table"
          color="neutral"
          class="w-full"
          :ui="{
            item: 'font-medium flex-1',
          }"
        />

        <!-- Text Type -->
        <div v-if="qrType === 'text'">
          <UFormField label="Enter text:" name="qr-text">
            <UTextarea
              v-model="textInput"
              placeholder="Enter any text to generate QR code"
              :rows="3"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- URL Type -->
        <div v-if="qrType === 'url'">
          <UFormField
            label="Enter URL:"
            name="qr-url"
            :error="urlError.length > 0 && !urlError.includes('Note')"
          >
            <UInput
              v-model="urlInput"
              type="url"
              placeholder="https://domain.com/blog"
              size="lg"
              class="w-full"
              @blur="validateURL"
            />
            <template #hint>
              <span v-if="urlError" :class="urlError.includes('Note') ? 'text-blue-500 text-sm' : 'text-red-500 text-sm'">{{ urlError }}</span>
              <span v-else class="text-gray-500 text-sm">Enter a valid URL (e.g., https://example.com)</span>
            </template>
          </UFormField>
        </div>

        <!-- WiFi Type -->
        <div v-if="qrType === 'wifi'" class="grid gap-4 grid-cols-2">
          <UFormField label="Network Name (SSID):" name="wifi-ssid" required>
            <UInput
              v-model="wifiData.ssid"
              placeholder="MyWiFiNetwork"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Password:" name="wifi-password">
            <UInput
              v-model="wifiData.password"
              type="password"
              placeholder="Enter WiFi password"
              size="lg"
              class="w-full"

              :disabled="wifiData.encryption === 'nopass'"
            />
          </UFormField>
          <UFormField label="Encryption Type:" name="wifi-encryption">
            <USelect
              v-model="wifiData.encryption"
              :items="encryptionOptions"
              size="lg"
              class="w-full"
              @change="($event: Event) => ($event.target as HTMLSelectElement).value === 'nopass' && (wifiData.password = '')"
            />
          </UFormField>
          <UFormField label="Hidden Network:" name="wifi-hidden">
            <USwitch v-model="wifiData.hidden" />
          </UFormField>
        </div>

        <!-- Calendar Event Type -->
        <div v-if="qrType === 'calendar'" class="space-y-4 grid gap-4 grid-cols-2">
          <UFormField label="Event Title:" name="calendar-title" required class="col-span-2">
            <UInput
              v-model="calendarData.title"
              placeholder="Meeting with Team"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Start Date & Time:" name="calendar-start" required>
            <UInput
              v-model="calendarData.startDate"
              type="datetime-local"
              class="w-full"
              size="lg"
            />
          </UFormField>
          <UFormField label="End Date & Time:" name="calendar-end" class="relative">
            <UInput
              v-model="calendarData.endDate"
              type="datetime-local"
              class="w-full"
              size="lg"
              :disabled="!calendarData.startDate"
            />
            <template #hint>
              <span :hidden="!calendarData.startDate" class="text-gray-500 text-xs absolute -bottom-1 left-0">Optional - leave empty to use start date</span>
            </template>
          </UFormField>
        </div>

        <!-- Color Customization -->
        <div class="space-y-4  pt-4 flex gap-4 items-center">
          <h3 class="text-lg font-semibold m-0">Customize Colors</h3>
          <ColorPicker v-model="qrColors.dark" label="Content" class="m-0 flex-1" />
          <ColorPicker v-model="qrColors.light" label="Background" class="m-0 flex-1" />
        </div>

        <div class="flex justify-center items-center min-h-[320px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div v-if="qrText" class="flex justify-center items-center p-4">
            <canvas ref="qrCanvas" class="max-w-full h-auto" />
          </div>
          <div v-else class="text-center text-gray-500 dark:text-gray-400 italic">
            <p>Configure options above to generate QR code</p>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-center">Download QR Code</h3>
          <div class="flex flex-wrap gap-4">
            <UButton
              @click="downloadQR('png')"
              :disabled="!qrText"
              color="primary"
              size="lg"
              icon="i-heroicons-arrow-down-tray"
              class="flex-1 justify-center"
            >
              Download PNG
            </UButton>
            <UButton
              @click="downloadQR('svg')"
              :disabled="!qrText"
              color="secondary"
              size="lg"
              icon="i-heroicons-arrow-down-tray"
              class="flex-1 justify-center"
            >
              Download SVG
            </UButton>
            <UButton
              @click="downloadQR('pdf')"
              :disabled="!qrText"
              color="neutral"
              size="lg"
              icon="i-heroicons-arrow-down-tray"
              class="flex-1 justify-center"
            >
              Download PDF
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
type QRType = 'text' | 'url' | 'wifi' | 'calendar'

const qrType = ref<QRType>('text')
const qrText = ref<string>('')
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const QRCode = ref<any>(null)

// Text input
const textInput = ref<string>('')

// URL input
const urlInput = ref<string>('')
const urlError = ref<string>('')

// WiFi data
const wifiData = ref({
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false
})

// Calendar data
const calendarData = ref({
  title: '',
  startDate: '',
  endDate: ''
})

// Color settings
const qrColors = ref({
  dark: '#000000',  // Content color
  light: '#FFFFFF'  // Background color
})

// QR Type options
const qrTypeOptions = computed(() => [
  { label: 'Text', value: 'text', icon: 'i-heroicons-text-square' },
  { label: 'URL', value: 'url', icon: 'i-heroicons-link' },
  { label: 'WiFi', value: 'wifi', icon: 'i-heroicons-wifi' },
  { label: 'Calendar Event', value: 'calendar', icon: 'i-heroicons-calendar' }
])

// Encryption options
const encryptionOptions = computed(() => [
  { label: 'WPA/WPA2', value: 'WPA' },
  { label: 'WEP', value: 'WEP' },
  { label: 'No Password', value: 'nopass' }
])

// URL validation
const validateURL = (): boolean => {
  urlError.value = ''

  const urlString = urlInput.value.trim()

  // Empty URL is valid (user might be typing)
  if (!urlString) {
    return true
  }

  // Check if URL has a protocol
  const hasProtocol = /^https?:\/\//i.test(urlString)

  // Create test URL with protocol if missing
  const testUrl = hasProtocol ? urlString : `https://${urlString}`

  try {
    const url = new URL(testUrl)

    // Validate protocol (only http or https)
    if (!['http:', 'https:'].includes(url.protocol.toLowerCase())) {
      urlError.value = 'URL must use http:// or https:// protocol'
      return false
    }

    // Validate hostname (must not be empty)
    if (!url.hostname || url.hostname.length === 0) {
      urlError.value = 'Please enter a valid URL with a domain name'
      return false
    }

    // Basic hostname validation - check for valid characters and structure
    // Allow: domain.com, subdomain.domain.com, localhost, IP addresses
    const hasValidChars = /^[a-z0-9.\-:[\]]+$/i.test(url.hostname)
    if (!hasValidChars) {
      urlError.value = 'Domain name contains invalid characters'
      return false
    }

    // If protocol was missing, show informational message
    if (!hasProtocol) {
      urlError.value = 'Note: https:// will be added automatically'
    }

    return true
  } catch (error) {
    // More specific error messages based on common issues
    if (urlString.includes(' ')) {
      urlError.value = 'URL cannot contain spaces'
    } else if (!urlString.includes('.')) {
      urlError.value = 'Please enter a valid URL with a domain name'
    } else {
      urlError.value = 'Please enter a valid URL'
    }
    return false
  }
}

// Format WiFi QR code string
const formatWiFiQR = (): string => {
  const { ssid, password, encryption, hidden } = wifiData.value
  if (!ssid) return ''

  const parts: string[] = []
  parts.push(`WIFI:T:${encryption};`)
  parts.push(`S:${ssid};`)
  if (password && !password.includes('nopass')) {
    parts.push(`P:${password};`)
  }
  parts.push(`H:${hidden ? 'true' : 'false'};`)
  parts.push(';')

  return parts.join('')
}

// Format Calendar QR code string
const formatCalendarQR = (): string => {
  const { title, startDate, endDate } = calendarData.value

  if (!title || !startDate) return ''

  // Format dates: convert from YYYY-MM-DDTHH:mm to YYYYMMDDTHHmmss
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}00`
  }

  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : start

  // Format as iCalendar
  const lines: string[] = []
  lines.push('BEGIN:VCALENDAR')
  lines.push('VERSION:2.0')
  lines.push('BEGIN:VEVENT')
  lines.push(`SUMMARY:${title}`)
  lines.push(`DTSTART:${start}`)
  lines.push(`DTEND:${end}`)
  lines.push('END:VEVENT')
  lines.push('END:VCALENDAR')

  return lines.join('\n')
}

// Compute QR text based on type
const computeQRText = (): string => {
  switch (qrType.value) {
    case 'text':
      return textInput.value
    case 'url':
      if (!urlInput.value.trim()) return ''
      // Auto-add https:// if missing (for QR generation only, don't modify input)
      let urlString = urlInput.value.trim()
      if (!urlString.match(/^https?:\/\//i)) {
        urlString = 'https://' + urlString
      }
      // Only return if URL is actually valid (check error message)
      if (urlError.value && !urlError.value.includes('Note')) {
        return ''
      }
      return urlString
    case 'wifi':
      return formatWiFiQR()
    case 'calendar':
      return formatCalendarQR()
    default:
      return ''
  }
}

const generateQRCode = async () => {
  if (!QRCode.value || typeof window === 'undefined') return

  const computedText = computeQRText()
  qrText.value = computedText

  if (!qrText.value) return

  // Wait for Vue to render the canvas element (it's conditionally rendered with v-if="qrText")
  await nextTick()

  if (!qrCanvas.value) {
    console.warn('Canvas element not found after rendering')
    return
  }

  try {
    await QRCode.value.toCanvas(qrCanvas.value, qrText.value, {
      width: 300,
      margin: 2,
      color: {...qrColors.value}
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const downloadQR = async (format: 'png' | 'svg' | 'pdf') => {
  if (!qrText.value) return

  try {
    switch (format) {
      case 'png':
        await downloadPNG()
        break
      case 'svg':
        await downloadSVG()
        break
      case 'pdf':
        await downloadPDF()
        break
    }
  } catch (error) {
    console.error(`Error downloading ${format}:`, error)
  }
}

const downloadPNG = async () => {
  if (!qrCanvas.value) return

  const dataURL = qrCanvas.value.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataURL
  link.download = 'qrcode.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadSVG = async () => {
  if (!QRCode.value || typeof window === 'undefined') return

  try {
    const svgString = await QRCode.value.toString(qrText.value, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {...qrColors.value}
    })

    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'qrcode.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating SVG:', error)
  }
}

const downloadPDF = async () => {
  if (!qrCanvas.value || typeof window === 'undefined') return

  try {
    // Dynamically import jsPDF only on client side
    const { jsPDF } = await import('jspdf')

    // Get the QR code as data URL
    const dataURL = qrCanvas.value.toDataURL('image/png')

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Calculate dimensions to center the QR code
    const imgWidth = 50 // mm
    const imgHeight = 50 // mm
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    // Add QR code image
    pdf.addImage(dataURL, 'PNG', x, y, imgWidth, imgHeight)

    // Optional: Add text below QR code
    pdf.setFontSize(12)
    pdf.text(qrText.value, pageWidth / 2, y + imgHeight + 10, {
      align: 'center',
      maxWidth: pageWidth - 20
    })

    pdf.save('qrcode.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

// Watch for changes and regenerate QR code
watch([qrType, textInput, urlInput, wifiData, calendarData, qrColors], async () => {
  const computedText = computeQRText()
  if (computedText) {
    await generateQRCode()
  } else {
    qrText.value = ''
  }
}, { deep: true })

// Watch QR type to clear errors when switching
watch(qrType, () => {
  urlError.value = ''
})

// Watch URL input for real-time validation
watch(urlInput, () => {
  if (urlInput.value) {
    validateURL()
  } else {
    urlError.value = ''
  }
})

// Generate QR code on mount if there's initial data
onMounted(async () => {
  // Dynamically import QRCode only on client side
  if (typeof window !== 'undefined') {
    QRCode.value = (await import('qrcode')).default
    await nextTick()
    const computedText = computeQRText()
    if (computedText) {
      await generateQRCode()
    }
  }
})
</script>