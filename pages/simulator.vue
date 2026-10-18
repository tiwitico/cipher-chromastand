<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2B2D42] font-sans flex flex-col selection:bg-[#F4A261] selection:text-[#2B2D42]">
    
    <!-- TOP WIZARD HEADER -->
    <header class="border-b border-[#F4F1DE] bg-[#FDFBF7]/90 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        <!-- Logo & Back to Home -->
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="w-9 h-9 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] flex items-center justify-center text-[#2B2D42] shadow-sm transition"
            title="Return to Home"
          >
            <ArrowLeft class="w-4 h-4" />
          </NuxtLink>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] p-0.5 shadow-md">
              <div class="w-full h-full bg-[#FDFBF7] rounded-[14px] flex items-center justify-center">
                <Sparkles class="w-5 h-5 text-[#E07A5F]" />
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold tracking-tight text-[#2B2D42]">
                  AuraHair
                </span>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                  Simulator Wizard
                </span>
              </div>
              <p class="text-[11px] text-[#2B2D42]/60 hidden sm:block">Perceptual CIELAB Highlight Fidelity & Chemistry Formulas</p>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-2.5">
          <!-- Link to AI Recommendation Wizard -->
          <NuxtLink
            to="/recommendation"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] hidden sm:flex items-center gap-2 shadow-sm transition"
          >
            <Sparkles class="w-3.5 h-3.5 text-[#F4A261]" />
            <span>AI Color Match</span>
          </NuxtLink>

          <!-- Saved Formulas -->
          <button
            type="button"
            @click="isGalleryOpen = true"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] flex items-center gap-2 shadow-sm transition"
          >
            <BookmarkCheck class="w-4 h-4 text-[#E07A5F]" />
            <span class="hidden md:inline">Saved Formulas</span>
            <span
              v-if="savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E07A5F]/15 text-[#E07A5F] font-mono font-bold"
            >
              {{ savedCount }}
            </span>
          </button>

          <!-- AI Stylist Chat -->
          <button
            type="button"
            @click="isAiModalOpen = true"
            class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-4 py-2 text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Bot class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">AI Colorist Chat</span>
          </button>
        </div>
      </div>
    </header>

    <!-- WIZARD STEPPER NAVIGATION BAR -->
    <div class="border-b border-[#F4F1DE] bg-white py-3 shadow-sm sticky top-18 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          
          <!-- Step 1 -->
          <button
            type="button"
            @click="currentStep = 1"
            class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
            :class="currentStep === 1 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="currentStep === 1 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              1
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">1. Baseline Canvas</span>
              <span class="text-[10px] text-[#2B2D42]/60 block truncate">Auto Level {{ currentBaseLevel }}</span>
            </div>
          </button>

          <!-- Step 2 -->
          <button
            type="button"
            @click="currentStep = 2"
            class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
            :class="currentStep === 2 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="currentStep === 2 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              2
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">2. Choose / Mix Color</span>
              <span class="text-[10px] text-[#2B2D42]/60 block truncate">{{ currentColorName }}</span>
            </div>
          </button>

          <!-- Step 3 -->
          <button
            type="button"
            @click="currentStep = 3"
            class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
            :class="currentStep === 3 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="currentStep === 3 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              3
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">3. True Mirror Split</span>
              <span class="text-[10px] text-[#2B2D42]/60 block truncate">Before / After Review</span>
            </div>
          </button>

          <!-- Step 4 -->
          <button
            type="button"
            @click="currentStep = 4"
            class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
            :class="currentStep === 4 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="currentStep === 4 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              4
            </div>
            <div class="overflow-hidden">
              <span class="text-xs font-bold block truncate">4. Salon Work Order</span>
              <span class="text-[10px] text-[#2B2D42]/60 block truncate">PDF & WhatsApp Mix</span>
            </div>
          </button>

        </div>
      </div>
    </div>

    <!-- MAIN SIMULATOR WIZARD CONTENT -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
      
      <!-- STEP 1: PORTRAIT PHOTO CANVAS -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div class="md:col-span-6">
            <CameraCapture
              @photo-selected="handlePhotoSelected"
            />
          </div>

          <div class="md:col-span-6 space-y-4">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl space-y-5">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
                  <User class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[#2B2D42]">Step 1: Your Baseline Canvas</h3>
                  <p class="text-xs text-[#2B2D42]/60 mt-0.5">Lighting calibration and skin protection ensure streak-free, predictable color</p>
                </div>
              </div>

              <!-- Detected Base Info -->
              <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#2B2D42]">Detected Hair Level:</span>
                  <span class="text-xs font-bold text-[#E07A5F]">Level {{ currentBaseLevel }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-[#2B2D42]/70">
                  <span>Dominant Tone:</span>
                  <span class="font-semibold text-[#2B2D42]">{{ currentHairTone }}</span>
                </div>
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Facial skin, eyes, and background are protected from dye tint.</span>
                </div>
              </div>

              <!-- Navigation Action -->
              <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <NuxtLink
                  to="/recommendation"
                  class="text-xs font-bold text-[#E07A5F] hover:underline flex items-center gap-1.5"
                >
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>Need help choosing? View AI Color Recommendations &rarr;</span>
                </NuxtLink>

                <button
                  type="button"
                  @click="currentStep = 2"
                  class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95 w-full sm:w-auto justify-center"
                >
                  <span>Next: Choose Color &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: CHOOSE TARGET COLOR / MIXER -->
      <div v-show="currentStep === 2" class="space-y-6">
        
        <!-- Cross-sell banner to AI Recommendation -->
        <div class="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F4F1DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5">
            <Sparkles class="w-4 h-4 text-[#E07A5F] flex-shrink-0" />
            <span class="text-[#2B2D42]/80">
              Not sure which hue flatters your face? Our <strong>Gemini 2.5 Chromatic Engine</strong> analyzes your skin tone and iris chroma.
            </span>
          </div>
          <NuxtLink
            to="/recommendation"
            class="font-bold text-[#E07A5F] hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            Get AI Color Match &rarr;
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-7">
            <HairColorMixer
              :initial-color-hex="currentColorHex"
              @color-change="handleColorChange"
            />
          </div>

          <div class="lg:col-span-5 space-y-4">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl space-y-5">
              <h3 class="text-lg font-bold text-[#2B2D42] flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-[#F4A261]" />
                <span>Selected Formulation</span>
              </h3>

              <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-4">
                <div class="flex items-center gap-3.5">
                  <div
                    class="w-12 h-12 rounded-2xl border border-black/10 shadow-md flex-shrink-0"
                    :style="{ backgroundColor: currentColorHex }"
                  ></div>
                  <div>
                    <h4 class="text-sm font-bold text-[#2B2D42]">{{ currentColorName }}</h4>
                    <p class="text-xs font-mono text-[#2B2D42]/60 mt-0.5">{{ currentColorHex }} &bull; {{ currentColorTechnique }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#F4F1DE] text-xs">
                  <div>
                    <span class="text-[#2B2D42]/50 block text-[10px] font-bold uppercase">Gloss / Shine</span>
                    <span class="font-bold text-[#F4A261]">{{ currentGloss }}% Mirror</span>
                  </div>
                  <div>
                    <span class="text-[#2B2D42]/50 block text-[10px] font-bold uppercase">Root Shadow</span>
                    <span class="font-bold text-[#E07A5F]">{{ currentRootDepth }}% Blend</span>
                  </div>
                </div>
              </div>

              <!-- Navigation Controls -->
              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  @click="currentStep = 1"
                  class="px-4 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
                >
                  &larr; Back to Photo
                </button>
                <button
                  type="button"
                  @click="currentStep = 3"
                  class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95"
                >
                  <span>Next: View Result &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3: REALISTIC RESULT PREVIEW (SIDE-BY-SIDE & WIPE) -->
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
            class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
          >
            &larr; Adjust Color
          </button>
          <button
            type="button"
            @click="currentStep = 4"
            class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95"
          >
            <span>Next: Salon Formula & PDF Work Order &rarr;</span>
          </button>
        </div>
      </div>

      <!-- STEP 4: SALON CHEMICAL FORMULATION & EXPORT -->
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
            class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
          >
            &larr; Back to Mirror Preview
          </button>
          <button
            type="button"
            @click="currentStep = 1"
            class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#E07A5F] rounded-xl text-xs font-bold border border-[#F4F1DE] transition"
          >
            Try Another Photo
          </button>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-[#F4F1DE] bg-white py-8 text-xs text-[#2B2D42]/60 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-medium">AuraHair Chromastand AI &bull; Simulator Wizard</span>
        </div>
        <p>&copy; 2026 Cipher Team. All rights reserved &bull; AuraHair Chromastand AI.</p>
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
import {
  Sparkles,
  ArrowLeft,
  BookmarkCheck,
  Bot,
  User,
  CheckCircle
} from 'lucide-vue-next'
import { useHairSession } from '~/composables/useHairSession'
import type { HairProcessResult } from '~/components/HairSimulatorCanvas.vue'

const route = useRoute()
const currentStep = ref(1)
const isGalleryOpen = ref(false)
const isAiModalOpen = ref(false)
const simulatorRef = ref<any>(null)

const {
  currentPhoto,
  currentBaseLevel,
  currentHairTone,
  processResult,
  levelOverride,
  currentColorHex,
  currentColorName,
  currentColorFamily,
  currentSecondaryHex,
  currentColorTechnique,
  currentGloss,
  currentRootDepth,
  savedCount,
  fetchSavedCount,
  setPhoto,
  setColor
} = useHairSession()

onMounted(async () => {
  await fetchSavedCount()
  if (route.query.step) {
    const stepNum = parseInt(route.query.step as string, 10)
    if (stepNum >= 1 && stepNum <= 4) {
      currentStep.value = stepNum
    }
  }
})

function handlePhotoSelected(photoUrl: string) {
  setPhoto(photoUrl)
}

function handleColorChange(data: any) {
  setColor(data)
}

function getTransformedSnapshot() {
  return simulatorRef.value?.getTransformedDataUrl ? simulatorRef.value.getTransformedDataUrl() : ''
}

function handleSimulationSaved(id: string) {
  savedCount.value++
}

function handleLoadLook(item: any) {
  if (item.user_photo) setPhoto(item.user_photo)
  setColor({
    colorHex: item.color_hex,
    colorName: item.color_name,
    colorFamily: item.color_family || 'natural',
    secondaryHex: item.secondary_color_hex
  })
  currentStep.value = 3
}

function handleApplyAiStyle(styleId: string, styleName: string) {
  // Focus on color
}

function handleApplyAiColor(colorHex: string, colorName: string, colorFamily: string) {
  setColor({ colorHex, colorName, colorFamily })
  currentStep.value = 3
}

function handleProcessed(data: HairProcessResult) {
  processResult.value = data
  currentBaseLevel.value = data.currentColor.level
  currentHairTone.value = `${data.currentColor.levelName} · ${data.currentColor.undertone}`
}
</script>
