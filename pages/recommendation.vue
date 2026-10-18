<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2B2D42] font-sans flex flex-col selection:bg-[#F4A261] selection:text-[#2B2D42]">
    
    <!-- WIZARD TOP NAVIGATION BAR -->
    <header class="border-b border-[#F4F1DE] bg-[#FDFBF7]/90 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        <!-- Brand & Back Button -->
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
                  AI Colorist Wizard
                </span>
              </div>
              <p class="text-[11px] text-[#2B2D42]/60 hidden sm:block">Multimodal Facial Tone Extraction & Chromatic Harmonies</p>
            </div>
          </div>
        </div>

        <!-- Direct Link to Manual Simulator -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/simulator"
            class="px-4 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] flex items-center gap-2 shadow-sm transition"
          >
            <SlidersHorizontal class="w-3.5 h-3.5 text-[#E07A5F]" />
            <span class="hidden sm:inline">Go to Simulator</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- WIZARD STEPPER HEADER -->
    <div class="border-b border-[#F4F1DE] bg-white py-4 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between">
          
          <!-- Step 1 Indicator -->
          <button
            type="button"
            @click="wizardStep = 1"
            class="flex items-center gap-3 text-left transition"
            :class="wizardStep === 1 ? 'opacity-100' : 'opacity-60 hover:opacity-90'"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="wizardStep === 1 ? 'bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white shadow-md' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              1
            </div>
            <div>
              <span class="text-xs font-bold block text-[#2B2D42]">1. Facial Portrait Scan</span>
              <span class="text-[10px] text-[#2B2D42]/60 block">Lighting & skin calibration</span>
            </div>
          </button>

          <!-- Connector -->
          <div class="flex-1 h-0.5 mx-4 bg-[#F4F1DE] relative">
            <div
              class="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E07A5F] to-[#F4A261] transition-all duration-300"
              :style="{ width: wizardStep >= 2 ? '100%' : '0%' }"
            ></div>
          </div>

          <!-- Step 2 Indicator -->
          <button
            type="button"
            @click="wizardStep = 2"
            class="flex items-center gap-3 text-left transition"
            :class="wizardStep === 2 ? 'opacity-100' : 'opacity-60 hover:opacity-90'"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition"
              :class="wizardStep === 2 ? 'bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white shadow-md' : 'bg-[#F4F1DE] text-[#2B2D42]'"
            >
              2
            </div>
            <div>
              <span class="text-xs font-bold block text-[#2B2D42]">2. Gemini Chromatic Harmonies</span>
              <span class="text-[10px] text-[#2B2D42]/60 block">Tailored shades & theory</span>
            </div>
          </button>

        </div>
      </div>
    </div>

    <!-- MAIN WIZARD BODY -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
      
      <!-- STEP 1: PORTRAIT PHOTO & LIGHTING SCAN -->
      <section v-show="wizardStep === 1" class="space-y-6">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-1 rounded-full">
            Step 1 of 2
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2B2D42] tracking-tight">
            Capture or Select Your Portrait Canvas
          </h1>
          <p class="text-xs sm:text-sm text-[#2B2D42]/70">
            For scientific accuracy, our Gemini 2.5 engine measures skin undertones and eye chroma under calibrated lighting.
          </p>
        </div>

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
                  <h3 class="text-lg font-bold text-[#2B2D42]">Facial Canvas Diagnostics</h3>
                  <p class="text-xs text-[#2B2D42]/60 mt-0.5">Lighting calibration and skin boundary isolation</p>
                </div>
              </div>

              <!-- Detected Base Info -->
              <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#2B2D42]">Current Baseline Level:</span>
                  <span class="text-xs font-bold text-[#E07A5F]">Level {{ currentBaseLevel }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-[#2B2D42]/70">
                  <span>Detected Base Tone:</span>
                  <span class="font-semibold text-[#2B2D42]">{{ currentHairTone }}</span>
                </div>
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Facial skin, eyes, and background are protected from dye tint.</span>
                </div>
              </div>

              <div class="pt-2 flex justify-end">
                <button
                  type="button"
                  @click="wizardStep = 2"
                  class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95 w-full sm:w-auto justify-center"
                >
                  <span>Next: Unlock Harmonic Recommendations &rarr;</span>
                </button>
              </div>
            </div>

            <!-- Value Callout -->
            <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] text-xs text-[#2B2D42]/70 leading-relaxed flex items-start gap-3">
              <Sparkles class="w-4 h-4 text-[#F4A261] flex-shrink-0 mt-0.5" />
              <div>
                <strong class="text-[#2B2D42]">How It Works:</strong> Gemini 2.5 extracts your precise $L^*a^*b^*$ dermal color coordinates and iris chroma, programmatically mapping them to complementary, analogous, and seasonal color theory palettes.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 2: GEMINI CHROMATIC ANALYSIS & RECOMMENDATIONS -->
      <section v-show="wizardStep === 2" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] text-xs font-bold mb-2 border border-[#E07A5F]/20">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Step 2 of 2: AI Chromatic Consultation</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#2B2D42] tracking-tight">
              Your Personalized Complexion Palette
            </h2>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 mt-1">
              Click any shade below to instantly simulate it on your hair in the virtual mirror!
            </p>
          </div>

          <button
            type="button"
            @click="wizardStep = 1"
            class="self-start sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] flex items-center gap-2 shadow-sm transition"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Retake / Change Photo</span>
          </button>
        </div>

        <!-- Recommendation Card -->
        <ChromaticColorTheoryCard
          :user-photo="currentPhoto"
          :current-hair-level="currentBaseLevel"
          @apply-color="handleApplyRecommendationAndSimulate"
        />

        <!-- Alternative Path Action Banner -->
        <div class="p-6 rounded-3xl bg-white border border-[#F4F1DE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-[#2B2D42]">Want to mix your own custom color or balayage technique?</h4>
            <p class="text-xs text-[#2B2D42]/65">You can switch directly to our full manual color lab with gloss and root-depth controls.</p>
          </div>

          <NuxtLink
            to="/simulator"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
          >
            <span>Open Manual Color Lab</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-[#F4F1DE] bg-white py-8 text-xs text-[#2B2D42]/60 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-medium">AuraHair Chromastand AI &bull; Colorist Wizard</span>
        </div>
        <p>&copy; 2026 Cipher Team. All rights reserved &bull; AuraHair Chromastand AI.</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  User,
  CheckCircle
} from 'lucide-vue-next'
import { useHairSession } from '~/composables/useHairSession'

const router = useRouter()
const {
  currentPhoto,
  currentBaseLevel,
  currentHairTone,
  setPhoto,
  applyRecommendation
} = useHairSession()

const wizardStep = ref(1)

function handlePhotoSelected(photoUrl: string) {
  setPhoto(photoUrl)
}

function handleApplyRecommendationAndSimulate(colorHex: string, colorName: string, colorFamily: string) {
  applyRecommendation(colorHex, colorName, colorFamily)
  // Transition directly into the simulator on step 3 (Interactive Mirror Simulation)
  router.push({
    path: '/simulator',
    query: { step: '3' }
  })
}
</script>
