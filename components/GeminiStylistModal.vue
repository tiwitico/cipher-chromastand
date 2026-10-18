<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
    <div class="relative w-full max-w-3xl max-h-[90vh] bg-white border border-[#F4F1DE] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#2B2D42]">
      
      <!-- Modal Header -->
      <div class="p-6 border-b border-[#F4F1DE] flex items-center justify-between bg-[#FDFBF7]">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
            <Bot class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-[#2B2D42]">Gemini 2.5 AI Stylist Consultation</h3>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F4F1DE] text-[#2B2D42] border border-[#E8E2CD] font-semibold">
                Multimodal Vision
              </span>
            </div>
            <p class="text-xs text-[#2B2D42]/60 mt-0.5">Personalized facial geometry, skin tone analysis, and salon chemistry advice</p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="p-2 rounded-xl text-[#2B2D42]/60 hover:text-[#2B2D42] hover:bg-[#F4F1DE] transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5">
        
        <!-- Input Configuration Card -->
        <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Model Selector -->
            <div>
              <label class="block text-xs font-bold text-[#2B2D42] mb-1.5 flex items-center gap-1.5">
                <Cpu class="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Google GenAI Model</span>
              </label>
              <select
                v-model="selectedModel"
                class="w-full bg-white border border-[#F4F1DE] rounded-xl px-3.5 py-2 text-xs text-[#2B2D42] focus:outline-none focus:border-[#E07A5F] shadow-sm font-semibold"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast, Multimodal)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Complex Reasoning)</option>
              </select>
            </div>

            <!-- Target Vibe / Notes -->
            <div>
              <label class="block text-xs font-bold text-[#2B2D42] mb-1.5 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-[#F4A261]" />
                <span>Your Style Preferences</span>
              </label>
              <input
                v-model="userNotes"
                type="text"
                placeholder="e.g., Professional, low-maintenance, love warm tones..."
                class="w-full bg-white border border-[#F4F1DE] rounded-xl px-3.5 py-2 text-xs text-[#2B2D42] placeholder-[#2B2D42]/40 focus:outline-none focus:border-[#E07A5F] shadow-sm font-medium"
              />
            </div>
          </div>

          <!-- Analyze Action Button -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-[#F4F1DE]">
            <div class="text-[11px] text-[#2B2D42]/70 flex items-center gap-1.5">
              <CheckCircle class="w-3.5 h-3.5 text-emerald-600" />
              <span>Current portrait photo will be analyzed by Gemini Vision</span>
            </div>

            <button
              type="button"
              @click="runAnalysis"
              :disabled="isLoading"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-5 py-2.5 text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Wand2 v-else class="w-4 h-4" />
              <span>{{ isLoading ? 'Gemini 2.5 Analyzing...' : 'Run AI Stylist Consultation' }}</span>
            </button>
          </div>
        </div>

        <!-- ANALYSIS RESULTS -->
        <div v-if="analysisResult" class="space-y-5">
          
          <!-- Key Diagnosis Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
              <span class="text-[10px] uppercase font-bold text-[#2B2D42]/50 tracking-wider">Face Shape</span>
              <p class="text-sm font-bold text-[#E07A5F] mt-0.5">{{ analysisResult.faceShape }}</p>
            </div>
            <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
              <span class="text-[10px] uppercase font-bold text-[#2B2D42]/50 tracking-wider">Skin Undertone</span>
              <p class="text-sm font-bold text-[#F4A261] mt-0.5">{{ analysisResult.skinUndertone }}</p>
            </div>
            <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
              <span class="text-[10px] uppercase font-bold text-[#2B2D42]/50 tracking-wider">Detected Base</span>
              <p class="text-sm font-bold text-[#2B2D42] mt-0.5">Level {{ analysisResult.detectedStartingLevel }}</p>
            </div>
            <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
              <span class="text-[10px] uppercase font-bold text-[#2B2D42]/50 tracking-wider">Bleach Needed</span>
              <p class="text-sm font-bold mt-0.5" :class="analysisResult.chemicalFormulationGuidance?.requiresBleach ? 'text-[#E07A5F]' : 'text-emerald-700'">
                {{ analysisResult.chemicalFormulationGuidance?.requiresBleach ? 'Yes (Decolorize)' : 'No (Direct Lift)' }}
              </p>
            </div>
          </div>

          <!-- Recommended Hair Colors -->
          <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE]">
            <h4 class="text-xs font-bold text-[#2B2D42] mb-3 flex items-center gap-2">
              <Palette class="w-4 h-4 text-[#E07A5F]" />
              <span>Harmonious Color Formulations for Your Undertone</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="col in analysisResult.recommendedColors"
                :key="col.colorName"
                class="bg-white border border-[#F4F1DE] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#E07A5F]/40 transition shadow-sm"
              >
                <div>
                  <div class="flex items-center gap-2.5 mb-2">
                    <div
                      class="w-5 h-5 rounded-lg border border-black/10 shadow-sm flex-shrink-0"
                      :style="{ backgroundColor: col.colorHex }"
                    ></div>
                    <span class="text-xs font-bold text-[#2B2D42] line-clamp-1">{{ col.colorName }}</span>
                    <span class="text-[10px] font-mono text-[#2B2D42]/60">L{{ col.targetLevel }}</span>
                  </div>
                  <p class="text-[11px] text-[#2B2D42]/70 leading-relaxed mb-3">{{ col.whyItFits }}</p>
                </div>

                <button
                  type="button"
                  @click="applyColor(col.colorHex, col.colorName, col.colorFamily)"
                  class="w-full py-2 bg-[#FDFBF7] hover:bg-gradient-to-r hover:from-[#E07A5F] hover:to-[#F4A261] hover:text-white text-[#2B2D42] border border-[#F4F1DE] hover:border-transparent rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Apply This Shade
                </button>
              </div>
            </div>
          </div>

          <!-- Chemical Formulation & Care Tips -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Chemistry Guidance -->
            <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE]">
              <h5 class="text-xs font-bold text-[#2B2D42] mb-2 flex items-center gap-2">
                <FlaskConical class="w-4 h-4 text-[#E07A5F]" />
                <span>Gemini Chemical Advice</span>
              </h5>
              <div class="space-y-2 text-xs">
                <p class="text-[#2B2D42]">
                  <strong class="text-[#E07A5F]">Developer:</strong> {{ analysisResult.chemicalFormulationGuidance?.suggestedDeveloperVolume }} Vol Developer
                </p>
                <p class="text-[#2B2D42]/70 text-[11px] leading-relaxed">
                  {{ analysisResult.chemicalFormulationGuidance?.liftNotes }}
                </p>
                <p class="text-[#2B2D42] text-[11px] bg-white p-2.5 rounded-xl border border-[#F4F1DE]">
                  <strong class="text-[#F4A261]">Porosity Caution:</strong> {{ analysisResult.chemicalFormulationGuidance?.porosityCaution }}
                </p>
              </div>
            </div>

            <!-- At Home Care Tips -->
            <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE]">
              <h5 class="text-xs font-bold text-[#2B2D42] mb-2 flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-emerald-600" />
                <span>At-Home Styling Maintenance</span>
              </h5>
              <ul class="space-y-2 text-[11px] text-[#2B2D42]/80">
                <li
                  v-for="(tip, idx) in analysisResult.atHomeStylingTips"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <span class="text-emerald-600 font-bold">&bull;</span>
                  <span class="leading-relaxed">{{ tip }}</span>
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
  Palette,
  FlaskConical
} from 'lucide-vue-next'
import type { AiStylistAnalysisResult } from '~/server/utils/gemini'

const props = defineProps<{
  isOpen: boolean
  userPhoto?: string
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
    const res = await $fetch<{ success: boolean; data: AiStylistAnalysisResult }>('/api/ai/analyze-style', {
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
    console.error('Gemini analysis failed', err)
  } finally {
    isLoading.value = false
  }
}

function applyColor(hex: string, name: string, family: string) {
  emit('apply-color', hex, name, family)
  emit('close')
}
</script>
