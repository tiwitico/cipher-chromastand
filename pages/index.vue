<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- TOP NAVIGATION -->
    <header class="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-bold tracking-tight text-white font-serif">
                AuraHair <span class="text-rose-400 font-sans font-semibold text-sm">Colorist</span>
              </h1>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Precision Hair Dye
              </span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">Step-by-Step Selfie Hair Coloring & Salon Chemical Formulation</p>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            @click="isAiModalOpen = true"
            class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition active:scale-95"
          >
            <Bot class="w-4 h-4 text-white" />
            <span class="hidden sm:inline">AI Colorist (Gemini 2.5)</span>
            <span class="sm:hidden">AI Colorist</span>
          </button>

          <button
            type="button"
            @click="isGalleryOpen = true"
            class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
          >
            <BookmarkCheck class="w-4 h-4 text-amber-400" />
            <span class="hidden md:inline">Saved Formulas</span>
            <span
              v-if="savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono"
            >
              {{ savedCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- STEPPER PROGRESS BAR -->
    <div class="border-b border-slate-800/60 bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          
          <!-- Step 1 -->
          <button
            type="button"
            @click="currentStep = 1"
            class="flex items-center gap-2.5 p-2 rounded-xl border text-left transition"
            :class="currentStep === 1 ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'"
          >
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              :class="currentStep === 1 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              1
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">Selfie & Base</span>
              <span class="text-[10px] text-slate-400 block truncate">Auto-read Level {{ currentBaseLevel }}</span>
            </div>
          </button>

          <!-- Step 2 -->
          <button
            type="button"
            @click="currentStep = 2"
            class="flex items-center gap-2.5 p-2 rounded-xl border text-left transition"
            :class="currentStep === 2 ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'"
          >
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              :class="currentStep === 2 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              2
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">Target Color</span>
              <span class="text-[10px] text-slate-400 block truncate">{{ currentColorName }}</span>
            </div>
          </button>

          <!-- Step 3 -->
          <button
            type="button"
            @click="currentStep = 3"
            class="flex items-center gap-2.5 p-2 rounded-xl border text-left transition"
            :class="currentStep === 3 ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'"
          >
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              :class="currentStep === 3 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              3
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">Side-by-Side</span>
              <span class="text-[10px] text-slate-400 block truncate">Before / After Preview</span>
            </div>
          </button>

          <!-- Step 4 -->
          <button
            type="button"
            @click="currentStep = 4"
            class="flex items-center gap-2.5 p-2 rounded-xl border text-left transition"
            :class="currentStep === 4 ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'"
          >
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              :class="currentStep === 4 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              4
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">Chemical Formula</span>
              <span class="text-[10px] text-slate-400 block truncate">Dye Grams & Bleach</span>
            </div>
          </button>

        </div>
      </div>
    </div>

    <!-- MAIN STEP-BY-STEP WORKSPACE -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">

      <!-- STEP 1: SELFIE CAPTURE & BASE LEVEL DETECTION -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div class="md:col-span-6">
            <CameraCapture
              @photo-selected="handlePhotoSelected"
            />
          </div>

          <div class="md:col-span-6 space-y-4">
            <div class="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <User class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">Step 1: Your Photo & Natural Canvas</h3>
                  <p class="text-xs text-slate-400">The system isolates hair pixels and protects your facial skin</p>
                </div>
              </div>

              <!-- Detected Base Info -->
              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-300">Detected Hair Level:</span>
                  <span class="text-xs font-bold text-rose-300">Level {{ currentBaseLevel }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span>Dominant Tone:</span>
                  <span class="text-slate-200">{{ currentHairTone }}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Face, skin, eyes, and background are strictly protected from color tint.</span>
                </div>
              </div>

              <!-- Step Navigation -->
              <div class="pt-2 flex justify-end">
                <button
                  type="button"
                  @click="currentStep = 2"
                  class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition"
                >
                  <span>Or Manually Customize Palette &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- GEMINI CHROMATIC INTELLIGENCE & COLOR THEORY RECOMMENDATIONS -->
        <ChromaticColorTheoryCard
          :user-photo="currentPhoto"
          :current-hair-level="currentBaseLevel"
          @apply-color="handleApplyRecommendedColor"
        />
      </div>

      <!-- STEP 2: CHOOSE TARGET HAIR COLOR & TECHNIQUE -->
      <div v-show="currentStep === 2" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-7">
            <HairColorMixer
              :initial-color-hex="currentColorHex"
              @color-change="handleColorChange"
            />
          </div>

          <div class="lg:col-span-5 space-y-4">
            <div class="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-amber-400" />
                <span>Selected Color Formulation</span>
              </h3>

              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl border border-white/20 shadow-md flex-shrink-0"
                    :style="{ backgroundColor: currentColorHex }"
                  ></div>
                  <div>
                    <h4 class="text-sm font-bold text-white">{{ currentColorName }}</h4>
                    <p class="text-xs font-mono text-slate-400">{{ currentColorHex }} &bull; {{ currentColorTechnique }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <div>
                    <span class="text-slate-500 block text-[10px]">Gloss / Shine:</span>
                    <span class="font-bold text-amber-300">{{ currentGloss }}% Mirror</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">Root Shadow:</span>
                    <span class="font-bold text-rose-300">{{ currentRootDepth }}% Blend</span>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  @click="currentStep = 1"
                  class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
                >
                  &larr; Back to Photo
                </button>
                <button
                  type="button"
                  @click="currentStep = 3"
                  class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition"
                >
                  <span>Next: View Side-by-Side &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3: SIDE-BY-SIDE PREVIEW & BEFORE / AFTER COMPARISON -->
      <div v-show="currentStep === 3" class="space-y-6">
        <HairSimulatorCanvas
          ref="simulatorRef"
          :user-photo="currentPhoto"
          :color-hex="currentColorHex"
          :color-name="currentColorName"
          :color-family="currentColorFamily"
          :secondary-hex="currentSecondaryHex"
          :color-type="currentColorTechnique"
          :gloss="currentGloss"
          :root-darkness="currentRootDepth"
          :current-level-override="levelOverride"
          @processed="handleProcessed"
        />

        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="currentStep = 2"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
          >
            &larr; Adjust Color
          </button>
          <button
            type="button"
            @click="currentStep = 4"
            class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition"
          >
            <span>Next: Chemical Formulation & Recipe &rarr;</span>
          </button>
        </div>
      </div>

      <!-- STEP 4: SALON CHEMICAL FORMULATION & SUBSTANCES BREAKDOWN -->
      <div v-show="currentStep === 4" class="space-y-6">
        <SalonFormulaCard
          :target-hex="currentColorHex"
          :color-name="currentColorName"
          :color-family="currentColorFamily"
          :user-photo="currentPhoto"
          :formula="processResult?.formula ?? null"
          :detected-level="processResult?.currentColor.level"
          :get-transformed-snapshot="getTransformedSnapshot"
          @override-level="levelOverride = $event"
          @simulation-saved="handleSimulationSaved"
        />

        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="currentStep = 3"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
          >
            &larr; Back to Side-by-Side Preview
          </button>
          <button
            type="button"
            @click="currentStep = 1"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-rose-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
          >
            Try Another Selfie
          </button>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Nuxt 3 &bull; Hair-Only Coloring &bull; PostgreSQL (Cloud SQL Ready) &bull; Google GenAI</span>
        </div>
        <p>AuraHair Colorist &bull; Precision salon chemical mixing ratios & side-by-side hair transformation</p>
      </div>
    </footer>

    <!-- GEMINI 2.5 AI COLORIST MODAL -->
    <GeminiStylistModal
      :is-open="isAiModalOpen"
      :user-photo="currentPhoto"
      :current-hair-level="currentBaseLevel"
      @close="isAiModalOpen = false"
      @apply-style="handleApplyAiStyle"
      @apply-color="handleApplyAiColor"
    />

    <!-- SAVED GALLERY MODAL -->
    <SavedGalleryModal
      :is-open="isGalleryOpen"
      @close="isGalleryOpen = false"
      @load-look="handleLoadLook"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sparkles, BookmarkCheck, Bot, User, CheckCircle } from 'lucide-vue-next'
import { SAMPLE_MODELS } from '~/utils/sampleModels'
import type { HairProcessResult } from '~/components/HairSimulatorCanvas.vue'

const currentStep = ref(1) // Step 1, 2, 3, or 4
const isGalleryOpen = ref(false)
const isAiModalOpen = ref(false)
const savedCount = ref(0)
const simulatorRef = ref<any>(null)

// Current Working State
const currentPhoto = ref<string>(SAMPLE_MODELS[0].imageUrl)
const currentBaseLevel = ref<number>(4)
const currentHairTone = ref<string>('Reading hair...')
const processResult = ref<HairProcessResult | null>(null)
const levelOverride = ref<number | null>(null)

const currentColorHex = ref('#B8491A')
const currentColorName = ref('Fiery Irish Copper')
const currentColorFamily = ref('copper')
const currentSecondaryHex = ref('#D1AC61')
const currentColorTechnique = ref<'solid' | 'balayage' | 'ombre' | 'highlights'>('balayage')
const currentGloss = ref(75)
const currentRootDepth = ref(25)

onMounted(async () => {
  await fetchSavedCount()
})

async function fetchSavedCount() {
  try {
    const res = await $fetch<{ success: boolean, data: any[] }>('/api/simulations')
    if (res.success && res.data) {
      savedCount.value = res.data.length
    }
  } catch (err) {
    // Ignore error on first boot
  }
}

function handlePhotoSelected(photoUrl: string) {
  currentPhoto.value = photoUrl
  levelOverride.value = null
  processResult.value = null
}

function handleColorChange(data: {
  colorHex: string
  colorName: string
  colorFamily: string
  secondaryHex: string
  technique: 'solid' | 'balayage' | 'ombre' | 'highlights'
  gloss: number
  rootDepth: number
}) {
  currentColorHex.value = data.colorHex
  currentColorName.value = data.colorName
  currentColorFamily.value = data.colorFamily
  currentSecondaryHex.value = data.secondaryHex
  currentColorTechnique.value = data.technique
  currentGloss.value = data.gloss
  currentRootDepth.value = data.rootDepth
}

function getTransformedSnapshot() {
  return simulatorRef.value?.getTransformedDataUrl ? simulatorRef.value.getTransformedDataUrl() : ''
}

function handleSimulationSaved(id: string) {
  savedCount.value++
}

function handleLoadLook(item: any) {
  if (item.user_photo) currentPhoto.value = item.user_photo
  currentColorHex.value = item.color_hex
  currentColorName.value = item.color_name
  currentColorFamily.value = item.color_family || 'natural'
  if (item.secondary_color_hex) currentSecondaryHex.value = item.secondary_color_hex
  currentStep.value = 3
}

function handleApplyAiStyle(styleId: string, styleName: string) {
  // Focus on color
}

function handleApplyAiColor(colorHex: string, colorName: string, colorFamily: string) {
  currentColorHex.value = colorHex
  currentColorName.value = colorName
  currentColorFamily.value = colorFamily
  currentStep.value = 3 // Jump directly to preview
}

function handleApplyRecommendedColor(colorHex: string, colorName: string, colorFamily: string) {
  currentColorHex.value = colorHex
  currentColorName.value = colorName
  currentColorFamily.value = colorFamily
  currentStep.value = 3 // Jump directly to side-by-side preview
}

function handleProcessed(data: HairProcessResult) {
  processResult.value = data
  currentBaseLevel.value = data.currentColor.level
  currentHairTone.value = `${data.currentColor.levelName} · ${data.currentColor.undertone}`
}
</script>
