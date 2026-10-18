<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl text-[#2B2D42] flex flex-col h-full">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-[#F4F1DE] pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E07A5F]/15 to-[#F4A261]/25 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F] shadow-sm">
          <Sparkles class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-[#2B2D42] flex items-center gap-2">
            <span>{{ colorName }}</span>
            <span class="text-xs font-mono text-[#E07A5F] px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/20 font-bold">{{ colorHex }}</span>
          </h2>
          <p class="text-xs text-[#2B2D42]/60 mt-0.5">Physical melanin retention engine — recolors isolated hair fibers only</p>
        </div>
      </div>

      <div class="flex items-center bg-[#FDFBF7] p-1 rounded-2xl border border-[#F4F1DE] text-xs">
        <button
          v-for="v in views"
          :key="v.id"
          type="button"
          @click="activeView = v.id"
          class="px-3.5 py-1.5 rounded-xl transition font-semibold"
          :class="activeView === v.id ? 'bg-[#E07A5F] text-white shadow-sm' : 'text-[#2B2D42]/70 hover:text-[#2B2D42]'"
        >
          {{ v.label }}
        </button>
      </div>
    </div>

    <!-- Detection summary -->
    <div v-if="result" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs">
      <div class="bg-[#FDFBF7] border border-[#F4F1DE] rounded-2xl p-3">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Hair Area Read</span>
        <p class="font-bold text-[#2B2D42] mt-0.5">{{ result.hair.areaPercent }}% of photo</p>
        <span class="text-[10px] text-[#2B2D42]/60">{{ result.hair.lengthClass }} length · {{ Math.round(result.hair.confidence * 100) }}% confidence</span>
      </div>
      <div class="bg-[#FDFBF7] border border-[#F4F1DE] rounded-2xl p-3">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Natural Hair Color</span>
        <p class="font-bold text-[#2B2D42] mt-0.5 flex items-center gap-1.5">
          <span class="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" :style="{ backgroundColor: result.currentColor.hex }"></span>
          Level {{ result.currentColor.level }}
        </p>
        <span class="text-[10px] text-[#2B2D42]/60">{{ result.currentColor.levelName }} · {{ result.currentColor.undertone }}</span>
      </div>
      <div class="bg-[#FDFBF7] border border-[#F4F1DE] rounded-2xl p-3">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Bleach Needed?</span>
        <p class="font-bold mt-0.5" :class="result.feasibility.needsBleach ? 'text-[#E07A5F]' : 'text-emerald-700'">
          {{ result.feasibility.needsBleach ? 'Yes (Decolorize)' : 'No (Direct Lift)' }}
        </p>
        <span class="text-[10px] text-[#2B2D42]/60">{{ result.feasibility.headline }}</span>
      </div>
      <div class="bg-[#FDFBF7] border border-[#F4F1DE] rounded-2xl p-3">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Detection Engine</span>
        <p class="font-bold text-[#2B2D42] text-[11px] leading-tight mt-0.5">{{ result.method === 'segformer_hair_model' ? 'SegFormer hair segmentation (AI)' : result.method === 'gemini_mask+skin_exclusion' ? 'Gemini mask + skin exclusion' : 'Fallback colour/face detector' }}</p>
        <span class="text-[10px] text-[#2B2D42]/60">Grey: ~{{ result.currentColor.grayPercentage }}%</span>
      </div>
    </div>

    <!-- Viewport -->
    <div class="relative flex-1 min-h-[460px] rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#F4F1DE] flex items-center justify-center p-3 shadow-inner">
      <!-- Loading / error -->
      <div v-if="isLoading && !result" class="text-sm text-[#2B2D42]/80 flex items-center gap-2 font-medium">
        <Loader2 class="w-4 h-4 animate-spin text-[#E07A5F]" /> Reading hair in your photo...
      </div>
      <div v-else-if="errorMessage" class="max-w-sm text-center space-y-2">
        <AlertTriangle class="w-8 h-8 text-[#F4A261] mx-auto" />
        <p class="text-sm font-bold text-[#2B2D42]">{{ errorMessage }}</p>
        <p class="text-xs text-[#2B2D42]/60">Try a bright, front-facing selfie where your hair is visible above and around your face.</p>
      </div>

      <template v-else-if="result">
        <!-- side by side -->
        <div v-if="activeView === 'side_by_side'" class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <figure class="bg-white rounded-2xl overflow-hidden border border-[#F4F1DE] shadow-sm">
            <figcaption class="py-2.5 px-4 bg-[#FDFBF7] text-xs font-bold text-[#2B2D42] flex justify-between border-b border-[#F4F1DE]">
              <span>Before (Natural)</span><span class="font-mono text-[#2B2D42]/60 font-semibold">Level {{ result.currentColor.level }}</span>
            </figcaption>
            <img :src="showHairArea ? result.hair.overlayImage : photo" alt="Original" class="w-full object-contain max-h-[520px]" />
          </figure>
          <figure class="bg-white rounded-2xl overflow-hidden border border-[#E07A5F]/40 shadow-sm">
            <figcaption class="py-2.5 px-4 bg-[#E07A5F]/10 text-xs font-bold text-[#E07A5F] flex justify-between border-b border-[#E07A5F]/20">
              <span>After (Hair Only)</span><span class="font-mono text-[#2B2D42]/60 font-semibold">{{ colorName }}</span>
            </figcaption>
            <img :src="result.resultImage" alt="Recolored" class="w-full object-contain max-h-[520px]" />
          </figure>
        </div>

        <!-- wipe -->
        <div v-else-if="activeView === 'split_slider'" class="relative w-full max-w-[480px] mx-auto select-none rounded-2xl overflow-hidden shadow-md">
          <img :src="photo" alt="Original" class="w-full block" />
          <div class="absolute inset-0 overflow-hidden" :style="{ width: `${splitPos}%` }">
            <img :src="result.resultImage" alt="Recolored" class="block max-w-none h-full" :style="{ width: `${100 * (100 / Math.max(splitPos, 0.01))}%` }" />
          </div>
          <div class="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20" :style="{ left: `${splitPos}%` }">
            <div class="absolute top-1/2 -translate-y-1/2 -ml-3.5 w-8 h-8 rounded-full bg-[#E07A5F] border-2 border-white flex items-center justify-center text-white shadow-lg">
              <Sliders class="w-4 h-4" />
            </div>
          </div>
          <input type="range" min="0" max="100" v-model.number="splitPos" class="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full" />
        </div>

        <!-- single -->
        <div v-else class="w-full max-w-[480px] mx-auto">
          <img :src="result.resultImage" alt="Recolored" class="w-full rounded-2xl border border-[#F4F1DE] shadow-sm" />
        </div>

        <div v-if="isLoading" class="absolute top-3 right-3 text-[11px] text-[#2B2D42] bg-white/95 border border-[#F4F1DE] shadow rounded-xl px-3 py-1.5 flex items-center gap-1.5 font-semibold">
          <Loader2 class="w-3.5 h-3.5 animate-spin text-[#E07A5F]" /> Updating...
        </div>
      </template>

      <!-- bottom bar -->
      <div class="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
        <label class="text-[11px] font-semibold text-[#2B2D42] bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#F4F1DE] shadow-sm flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="showHairArea" class="accent-[#E07A5F]" />
          Show isolated hair area
        </label>
        <button
          type="button"
          @click="downloadComparisonCard"
          :disabled="!result"
          class="px-4 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-bold text-[#2B2D42] border border-[#F4F1DE] shadow-sm flex items-center gap-1.5 disabled:opacity-40 transition"
        >
          <Download class="w-3.5 h-3.5 text-[#E07A5F]" /> Export Snapshot
        </button>
      </div>
    </div>

    <!-- Warnings -->
    <ul v-if="result?.warnings?.length" class="mt-3 space-y-1 text-xs text-[#E07A5F]">
      <li v-for="(w, i) in result.warnings" :key="i" class="flex gap-1.5"><AlertTriangle class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {{ w }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Sparkles, Sliders, Download, Loader2, AlertTriangle } from 'lucide-vue-next'

export interface HairProcessResult {
  width: number
  height: number
  method: string
  hair: { areaPercent: number; lengthClass: string; confidence: number; overlayImage: string }
  currentColor: { hex: string; level: number; levelName: string; undertone: string; grayPercentage: number }
  feasibility: { needsBleach: boolean; headline: string; reasons: string[]; recommendation: string; sessions: number; status: string; possible: boolean }
  formula: any
  resultImage: string
  warnings: string[]
}

const props = defineProps<{
  userPhoto: string
  colorHex: string
  colorName: string
  colorFamily?: string
  secondaryHex?: string
  colorType?: 'solid' | 'balayage' | 'ombre' | 'highlights'
  gloss?: number
  rootDarkness?: number
  currentLevelOverride?: number | null
}>()

const emit = defineEmits<{
  (e: 'processed', data: HairProcessResult): void
}>()

const views = [
  { id: 'side_by_side', label: 'Side-by-Side' },
  { id: 'split_slider', label: 'Before / After Wipe' },
  { id: 'single', label: 'Result Only' }
] as const
const activeView = ref<'side_by_side' | 'split_slider' | 'single'>('side_by_side')
const splitPos = ref(50)
const showHairArea = ref(false)

const photo = ref('') // downscaled photo that is also what the backend reads
const result = ref<HairProcessResult | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

let timer: ReturnType<typeof setTimeout> | null = null
let requestId = 0

async function prepare(url: string): Promise<string> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = url
  })
  const scale = Math.min(1, 768 / Math.max(img.naturalWidth, img.naturalHeight))
  const c = document.createElement('canvas')
  c.width = Math.round(img.naturalWidth * scale)
  c.height = Math.round(img.naturalHeight * scale)
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.92)
}

async function run() {
  const id = ++requestId
  isLoading.value = true
  errorMessage.value = ''
  try {
    if (!photo.value) photo.value = await prepare(props.userPhoto)
    const res = await $fetch<{ success: boolean; data: HairProcessResult }>('/api/hair/process', {
      method: 'POST',
      body: {
        image: photo.value,
        targetHex: props.colorHex,
        secondaryHex: props.secondaryHex,
        colorType: props.colorType,
        gloss: props.gloss,
        rootDarkness: props.rootDarkness,
        colorFamily: props.colorFamily,
        colorName: props.colorName,
        currentLevelOverride: props.currentLevelOverride || undefined
      }
    })
    if (id !== requestId) return // a newer request superseded this one
    result.value = res.data
    emit('processed', res.data)
  } catch (err: any) {
    if (id !== requestId) return
    result.value = null
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'Could not process this photo.'
  } finally {
    if (id === requestId) isLoading.value = false
  }
}

function schedule(delay = 350) {
  if (timer) clearTimeout(timer)
  timer = setTimeout(run, delay)
}

onMounted(() => run())
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

watch(() => props.userPhoto, async () => {
  photo.value = ''
  result.value = null
  schedule(0)
})
watch(
  () => [props.colorHex, props.secondaryHex, props.colorType, props.gloss, props.rootDarkness, props.colorFamily, props.currentLevelOverride],
  () => schedule()
)

async function downloadComparisonCard() {
  if (!result.value) return
  const load = (src: string) => new Promise<HTMLImageElement>((resolve) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.src = src
  })
  const [before, after] = await Promise.all([load(photo.value), load(result.value.resultImage)])
  const panelH = 760
  const panelW = Math.round((before.naturalWidth / before.naturalHeight) * panelH)
  const canvas = document.createElement('canvas')
  canvas.width = panelW * 2 + 180
  canvas.height = panelH + 220
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0a0e17'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f43f5e'
  ctx.font = 'bold 34px sans-serif'
  ctx.fillText('AuraHair Colorist - Hair Color Simulation', 60, 60)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '20px sans-serif'
  ctx.fillText(`Target: ${props.colorName} (${props.colorHex})  |  Current: Level ${result.value.currentColor.level} ${result.value.currentColor.levelName}  |  ${result.value.feasibility.headline}`, 60, 96)
  ctx.drawImage(before, 60, 130, panelW, panelH)
  ctx.drawImage(after, 120 + panelW, 130, panelW, panelH)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('Before', 60, 130 + panelH + 36)
  ctx.fillStyle = '#f43f5e'
  ctx.fillText('After (hair only)', 120 + panelW, 130 + panelH + 36)
  const a = document.createElement('a')
  a.download = `AuraHair_${props.colorName.replace(/\s+/g, '_')}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}

defineExpose({
  getTransformedDataUrl: () => result.value?.resultImage || ''
})
</script>
