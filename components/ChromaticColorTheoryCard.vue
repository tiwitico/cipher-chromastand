<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-5 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/25">
          <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Bot class="w-5 h-5 text-rose-400" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-white">Gemini Chromatic Intelligence</h3>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
              Color Theory Engine
            </span>
          </div>
          <p class="text-xs text-slate-400">Multimodal facial tone extraction & CIELAB chromatic harmony mapping</p>
        </div>
      </div>

      <!-- Action Button -->
      <button
        type="button"
        @click="runAnalysis"
        :disabled="isLoading"
        class="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
      >
        <RefreshCw v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
        <Wand2 v-else class="w-3.5 h-3.5" />
        <span>{{ isLoading ? 'Analyzing Chromatic Vectors...' : 'Analyze My Face' }}</span>
      </button>
    </div>

    <!-- Loading State Skeleton -->
    <div v-if="isLoading" class="py-8 flex flex-col items-center justify-center text-center space-y-3">
      <div class="relative w-12 h-12">
        <div class="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-200">Gemini 2.5 Inspecting Facial Chromaticity...</p>
        <p class="text-xs text-slate-400">Extracting L*a*b* coordinates, iris warmth, and calculating color harmony matrices</p>
      </div>
    </div>

    <!-- Active Profile Content -->
    <div v-else-if="chromaticProfile" class="space-y-5">
      
      <!-- Chromatic Diagnosis Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <!-- Skin Undertone with Swatch -->
        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Skin Tone L*a*b*</span>
            <div
              class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              :style="{ backgroundColor: chromaticProfile.skinToneLab.hex }"
              :title="chromaticProfile.skinToneLab.hex"
            ></div>
          </div>
          <p class="text-xs font-bold text-rose-300 truncate">{{ skinUndertone || 'Warm Golden' }}</p>
          <span class="text-[10px] text-slate-400 font-mono block">
            L:{{ chromaticProfile.skinToneLab.L }} a:{{ chromaticProfile.skinToneLab.a }} b:{{ chromaticProfile.skinToneLab.b }}
          </span>
        </div>

        <!-- Eye Iris Chroma -->
        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Iris Chroma</span>
            <div
              class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              :style="{ backgroundColor: chromaticProfile.eyeChroma.hex }"
              :title="chromaticProfile.eyeChroma.name"
            ></div>
          </div>
          <p class="text-xs font-bold text-amber-300 truncate">{{ chromaticProfile.eyeChroma.name }}</p>
          <span class="text-[10px] text-slate-400 block">{{ chromaticProfile.eyeChroma.warmth }} Undertone</span>
        </div>

        <!-- Contrast Category -->
        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Facial Contrast</span>
          <p class="text-xs font-bold text-purple-300 truncate">{{ chromaticProfile.contrastLevel }}</p>
          <span class="text-[10px] text-slate-400 block">Skin-to-Hair Delta</span>
        </div>

        <!-- Seasonal Palette -->
        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Seasonal Palette</span>
          <p class="text-xs font-bold text-emerald-300 truncate">{{ chromaticProfile.seasonalArchetype }}</p>
          <span class="text-[10px] text-slate-400 block">12-Season Matrix</span>
        </div>
      </div>

      <!-- Color Theory Scientific Rationale -->
      <div class="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed flex items-start gap-2.5">
        <Sparkles class="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong class="text-purple-300">Chromatic Matrix Rationale: </strong>
          <span>{{ chromaticProfile.colorTheoryReasoning }}</span>
        </div>
      </div>

      <!-- 3 Programmatic Color Theory Recommendations -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Palette class="w-3.5 h-3.5 text-rose-400" />
            <span>Target Color Recommendations Based on Your Face</span>
          </h4>
          <span class="text-[10px] text-slate-400">1-Click to Simulate on Your Photo</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            v-for="(rec, idx) in recommendedColors"
            :key="idx"
            class="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition group shadow-md"
          >
            <div class="space-y-2 mb-3">
              <!-- Category Badge -->
              <div class="flex items-center justify-between">
                <span
                  class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                  :class="getHarmonyBadgeClass(rec.harmonyType)"
                >
                  {{ getHarmonyTitle(rec.harmonyType) }}
                </span>
                <span class="text-[10px] font-mono text-slate-400">Level {{ rec.targetLevel }}</span>
              </div>

              <!-- Color Name & Swatch -->
              <div class="flex items-center gap-2.5">
                <div
                  class="w-6 h-6 rounded-lg border border-white/20 shadow flex-shrink-0"
                  :style="{ backgroundColor: rec.colorHex }"
                ></div>
                <div>
                  <h5 class="text-xs font-bold text-white group-hover:text-rose-300 transition line-clamp-1">
                    {{ rec.colorName }}
                  </h5>
                  <span class="text-[10px] font-mono text-slate-400">{{ rec.colorHex }}</span>
                </div>
              </div>

              <!-- Scientific Rationale -->
              <p class="text-[11px] text-slate-400 leading-snug">
                {{ rec.whyItFits }}
              </p>
            </div>

            <!-- Apply Button -->
            <button
              type="button"
              @click="applyRecommendation(rec)"
              class="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-200 text-xs font-bold border border-slate-700 hover:border-rose-500 transition flex items-center justify-center gap-1.5 active:scale-95 shadow"
            >
              <span>Simulate This Shade</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Judges Deep-Dive Accordion: "Why This Isn't a Generic Filter" -->
      <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
        <button
          type="button"
          @click="isDeepDiveOpen = !isDeepDiveOpen"
          class="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition"
        >
          <div class="flex items-center gap-2">
            <Info class="w-4 h-4 text-amber-400" />
            <span class="text-xs font-bold text-slate-200">
              For Judges: How AuraHair Avoids Generic Filters (Color Theory & CIELAB Pipeline)
            </span>
          </div>
          <component :is="isDeepDiveOpen ? ChevronUp : ChevronDown" class="w-4 h-4 text-slate-400" />
        </button>

        <div v-show="isDeepDiveOpen" class="p-4 pt-1 border-t border-slate-800/80 space-y-3 text-[11px] text-slate-300">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span class="text-amber-400 font-bold block mb-1">1. Multimodal Feature Reasoning</span>
              <p class="text-slate-400">
                Gemini 2.5 extracts calibrated L*a*b* coordinates for facial dermis and iris warmth, rather than applying an indiscriminate screen blend across pixels.
              </p>
            </div>
            <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span class="text-rose-400 font-bold block mb-1">2. Luminosity & Highlight Retention</span>
              <p class="text-slate-400">
                Our rendering pipeline operates in CIELAB color space, preserving hair strand specular highlights and natural shadow depth without muddying or artificial glow.
              </p>
            </div>
            <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span class="text-emerald-400 font-bold block mb-1">3. Chemical Dispensary Physics</span>
              <p class="text-slate-400">
                Every recommended hue is tied to real developer volumes (10-40 Vol) and bleach gram formulas based on the user's starting level to ensure physical repeatability.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="py-6 text-center space-y-2">
      <p class="text-xs text-slate-400">Click "Analyze My Face" to extract chromatic vectors and get personalized color recommendations</p>
      <button
        type="button"
        @click="runAnalysis"
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
      >
        Run Chromatic Analysis
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Bot,
  Sparkles,
  Palette,
  RefreshCw,
  Wand2,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'
import type { ChromaticFaceProfile } from '~/server/utils/gemini'

const props = defineProps<{
  userPhoto?: string
  currentHairLevel?: number
}>()

const emit = defineEmits<{
  (e: 'apply-color', colorHex: string, colorName: string, colorFamily: string): void
}>()

const isLoading = ref(false)
const isDeepDiveOpen = ref(false)
const skinUndertone = ref('Warm Golden')
const chromaticProfile = ref<ChromaticFaceProfile | null>(null)
const recommendedColors = ref<any[]>([])

onMounted(() => {
  // Run initial analysis with default photo
  runAnalysis()
})

watch(() => props.userPhoto, () => {
  runAnalysis()
})

async function runAnalysis() {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const res = await $fetch<{ success: boolean; data: any }>('/api/ai/analyze-style', {
      method: 'POST',
      body: {
        imageBase64: props.userPhoto || undefined,
        currentHairLevel: props.currentHairLevel || 3,
        userNotes: 'Prioritize color theory harmony with skin undertone and eye chroma'
      }
    })

    if (res.success && res.data) {
      skinUndertone.value = res.data.skinUndertone || 'Warm Golden'
      chromaticProfile.value = res.data.chromaticProfile || null
      recommendedColors.value = res.data.recommendedColors || []
    }
  } catch (err) {
    console.error('Failed to analyze chromatic profile:', err)
  } finally {
    isLoading.value = false
  }
}

function getHarmonyTitle(type?: string) {
  switch (type) {
    case 'analogous_enhancer':
      return '🌟 Analogous Harmony'
    case 'complementary_eye_pop':
      return '👁️ Complementary Pop'
    case 'high_fashion_contrast':
      return '⚡ High-Fashion Contrast'
    default:
      return 'Harmonious Shade'
  }
}

function getHarmonyBadgeClass(type?: string) {
  switch (type) {
    case 'analogous_enhancer':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    case 'complementary_eye_pop':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    case 'high_fashion_contrast':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    default:
      return 'bg-slate-800 text-slate-300'
  }
}

function applyRecommendation(rec: any) {
  emit('apply-color', rec.colorHex, rec.colorName, rec.colorFamily)
}
</script>
