<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot class="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-white">Gemini 2.5 AI Stylist Consultation</h3>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                Multimodal Vision
              </span>
            </div>
            <p class="text-xs text-slate-400">Personalized facial geometry, skin tone analysis, and salon chemistry advice</p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5">
        
        <!-- Input Configuration Card -->
        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Model Selector -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Cpu class="w-3.5 h-3.5 text-purple-400" />
                <span>Google GenAI Model</span>
              </label>
              <select
                v-model="selectedModel"
                class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast, Multimodal)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Complex Reasoning)</option>
              </select>
            </div>

            <!-- Target Vibe / Notes -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-amber-400" />
                <span>Your Style Preferences</span>
              </label>
              <input
                v-model="userNotes"
                type="text"
                placeholder="e.g., Professional, low-maintenance, love warm tones..."
                class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <!-- Analyze Action Button -->
          <div class="flex items-center justify-between pt-1">
            <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CheckCircle class="w-3.5 h-3.5 text-emerald-400" />
              <span>Current selfie portrait will be analyzed by Gemini Vision</span>
            </div>

            <button
              type="button"
              @click="runAnalysis"
              :disabled="isLoading"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Wand2 v-else class="w-4 h-4" />
              <span>{{ isLoading ? 'Gemini 2.5 Analyzing...' : 'Run AI Stylist Consultation' }}</span>
            </button>
          </div>
        </div>

        <!-- ANALYSIS RESULTS -->
        <div v-if="analysisResult" class="space-y-4">
          
          <!-- Key Diagnosis Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Face Shape</span>
              <p class="text-sm font-bold text-rose-300 mt-0.5">{{ analysisResult.faceShape }}</p>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Skin Undertone</span>
              <p class="text-sm font-bold text-amber-300 mt-0.5">{{ analysisResult.skinUndertone }}</p>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Detected Base</span>
              <p class="text-sm font-bold text-white mt-0.5">Level {{ analysisResult.detectedStartingLevel }}</p>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bleach Needed</span>
              <p class="text-sm font-bold mt-0.5" :class="analysisResult.chemicalFormulationGuidance?.requiresBleach ? 'text-rose-400' : 'text-emerald-400'">
                {{ analysisResult.chemicalFormulationGuidance?.requiresBleach ? 'Yes (Decolorize)' : 'No (Direct Lift)' }}
              </p>
            </div>
          </div>

          <!-- Recommended Hairstyles -->
          <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h4 class="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Scissors class="w-4 h-4 text-rose-400" />
              <span>AI Recommended Hairstyles for Your Face Shape</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="rec in analysisResult.recommendedHairstyles"
                :key="rec.styleId"
                class="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-slate-200">{{ rec.styleName }}</span>
                    <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                      {{ rec.flatteryScore }}% Match
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-400 leading-relaxed mb-3">{{ rec.rationale }}</p>
                </div>

                <button
                  type="button"
                  @click="applyStyle(rec.styleId, rec.styleName)"
                  class="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition"
                >
                  Apply This Hairstyle
                </button>
              </div>
            </div>
          </div>

          <!-- Recommended Hair Colors -->
          <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h4 class="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Palette class="w-4 h-4 text-amber-400" />
              <span>Harmonious Color Formulations for Your Undertone</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="col in analysisResult.recommendedColors"
                :key="col.colorName"
                class="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <div
                      class="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                      :style="{ backgroundColor: col.colorHex }"
                    ></div>
                    <span class="text-xs font-bold text-slate-200 line-clamp-1">{{ col.colorName }}</span>
                    <span class="text-[10px] font-mono text-slate-400">L{{ col.targetLevel }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 leading-relaxed mb-3">{{ col.whyItFits }}</p>
                </div>

                <button
                  type="button"
                  @click="applyColor(col.colorHex, col.colorName, col.colorFamily)"
                  class="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
                >
                  Apply This Shade
                </button>
              </div>
            </div>
          </div>

          <!-- Chemical Formulation & Care Tips -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Chemistry Guidance -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <FlaskConical class="w-4 h-4 text-rose-400" />
                <span>Gemini Chemical Advice</span>
              </h5>
              <div class="space-y-2 text-xs">
                <p class="text-slate-300">
                  <strong class="text-rose-300">Developer:</strong> {{ analysisResult.chemicalFormulationGuidance?.suggestedDeveloperVolume }} Vol Developer
                </p>
                <p class="text-slate-400 text-[11px]">
                  {{ analysisResult.chemicalFormulationGuidance?.liftNotes }}
                </p>
                <p class="text-amber-300/90 text-[11px] bg-amber-950/30 p-2 rounded border border-amber-800/40">
                  <strong>Porosity Caution:</strong> {{ analysisResult.chemicalFormulationGuidance?.porosityCaution }}
                </p>
              </div>
            </div>

            <!-- At Home Care Tips -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-emerald-400" />
                <span>At-Home Styling Maintenance</span>
              </h5>
              <ul class="space-y-1.5 text-[11px] text-slate-300">
                <li
                  v-for="(tip, idx) in analysisResult.atHomeStylingTips"
                  :key="idx"
                  class="flex items-start gap-1.5"
                >
                  <span class="text-emerald-400">&bull;</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Bot,
  X,
  Cpu,
  Sparkles,
  CheckCircle,
  Wand2,
  Loader2,
  Scissors,
  Palette,
  FlaskConical
} from 'lucide-vue-next'
import type { AiStylistAnalysisResult } from '~/server/utils/gemini'

const props = defineProps<{
  isOpen: boolean
  userPhoto: string
  currentHairLevel?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply-style', styleId: string, styleName: string): void
  (e: 'apply-color', colorHex: string, colorName: string, colorFamily: string): void
}>()

const selectedModel = ref<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash')
const userNotes = ref('')
const isLoading = ref(false)
const analysisResult = ref<AiStylistAnalysisResult | null>(null)

async function runAnalysis() {
  isLoading.value = true
  try {
    const res = await $fetch<{ success: boolean, data: AiStylistAnalysisResult }>('/api/ai/analyze-style', {
      method: 'POST',
      body: {
        imageBase64: props.userPhoto,
        userNotes: userNotes.value,
        currentHairLevel: props.currentHairLevel || 3,
        modelName: selectedModel.value
      }
    })

    if (res.success && res.data) {
      analysisResult.value = res.data
    }
  } catch (err) {
    console.error('Failed to run Gemini analysis', err)
  } finally {
    isLoading.value = false
  }
}

function applyStyle(styleId: string, styleName: string) {
  emit('apply-style', styleId, styleName)
  emit('close')
}

function applyColor(colorHex: string, colorName: string, colorFamily: string) {
  emit('apply-color', colorHex, colorName, colorFamily)
  emit('close')
}
</script>
