<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl relative overflow-hidden text-[#2B2D42]">
    
    <!-- Top Decorative Subtle Glow -->
    <div
      class="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
      :style="{ backgroundColor: targetHex }"
    ></div>

    <!-- Header & Action Toolbar -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 relative z-10 border-b border-[#F4F1DE] pb-6">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E07A5F]/15 to-[#F4A261]/25 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F] shadow-sm">
          <FlaskConical class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold tracking-tight text-[#2B2D42]">
              Color Formulation & Substances Recipe
            </h3>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[#F4F1DE] text-[#2B2D42] border border-[#E8E2CD]">
              Salon Professional Mix
            </span>
          </div>
          <p class="text-xs text-[#2B2D42]/60 mt-0.5">Dispensary mixing ratios, developer volume, and bleaching procedure</p>
        </div>
      </div>

      <!-- Export & Share Actions Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- PDF Download -->
        <button
          type="button"
          @click="downloadPdfConsultation"
          class="px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#F4F1DE] text-[#2B2D42] font-semibold text-xs border border-[#F4F1DE] shadow-sm flex items-center gap-1.5 transition active:scale-95"
          title="Download printable salon consultation card as PDF"
        >
          <FileDown class="w-4 h-4 text-[#E07A5F]" />
          <span>Download PDF</span>
        </button>

        <!-- Share to WhatsApp -->
        <button
          type="button"
          @click="shareToWhatsApp"
          class="px-3.5 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] font-semibold text-xs border border-[#25D366]/30 shadow-sm flex items-center gap-1.5 transition active:scale-95"
          title="Share formula directly to WhatsApp"
        >
          <Share2 class="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </button>

        <!-- Share to Email -->
        <button
          type="button"
          @click="shareToEmail"
          class="px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#F4F1DE] text-[#2B2D42] font-semibold text-xs border border-[#F4F1DE] shadow-sm flex items-center gap-1.5 transition active:scale-95"
          title="Email consultation sheet"
        >
          <Mail class="w-4 h-4 text-[#F4A261]" />
          <span>Email</span>
        </button>

        <!-- Save Simulation Button (with requested gradient) -->
        <button
          type="button"
          @click="saveSimulation"
          :disabled="isSaving"
          class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-4 py-2.5 text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <BookmarkCheck class="w-4 h-4" />
          <span>{{ isSaving ? 'Saving...' : 'Save Formula' }}</span>
        </button>
      </div>
    </div>

    <!-- Starting Hair Level (detected from photo, can be corrected) -->
    <div class="bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-[#F4F1DE] mb-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-xs font-bold text-[#2B2D42]">Current Hair Level (Read from Photo)</span>
          <p class="text-[11px] text-[#2B2D42]/60">Adjust if needed — chemistry and substance weights update automatically</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-[#E07A5F]">Level {{ startingLevel }}</span>
          <span class="text-[11px] text-[#2B2D42]/60 block font-medium">{{ startingLevelName }}</span>
          <button
            v-if="detectedLevel && startingLevel !== detectedLevel"
            type="button"
            class="text-[10px] text-[#E07A5F] underline font-semibold mt-0.5"
            @click="resetToDetected"
          >
            Reset to detected (L{{ detectedLevel }})
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <input
          type="range"
          min="1"
          max="10"
          v-model.number="startingLevel"
          class="w-full accent-[#E07A5F] bg-[#F4F1DE] h-2 rounded-lg cursor-pointer"
          @change="applyLevelFromSlider"
        />
        <div class="grid grid-cols-10 gap-1 text-center">
          <button
            v-for="lvl in 10"
            :key="lvl"
            type="button"
            @click="setLevel(lvl)"
            class="py-1 rounded-lg border text-[10px] font-mono transition"
            :class="startingLevel === lvl ? 'border-[#E07A5F] bg-[#E07A5F] text-white font-bold shadow-sm' : 'border-[#F4F1DE] bg-white text-[#2B2D42]/70 hover:border-[#E07A5F]/40'"
          >
            L{{ lvl }}
          </button>
        </div>
      </div>
    </div>

    <!-- Feasibility Verdict Alert -->
    <div
      v-if="formulaResult?.feasibility"
      class="p-4 sm:p-5 rounded-2xl border mb-6"
      :class="{
        'bg-emerald-50/80 border-emerald-200 text-emerald-900': ['direct', 'deposit_only'].includes(formulaResult.feasibility.status),
        'bg-amber-50/80 border-amber-200 text-amber-900': ['bleach_required', 'multi_session'].includes(formulaResult.feasibility.status),
        'bg-rose-50/80 border-rose-200 text-rose-900': formulaResult.feasibility.status === 'not_recommended'
      }"
    >
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 class="text-sm font-bold">{{ formulaResult.feasibility.headline }}</h4>
        <span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/80 border border-current font-semibold">
          Level {{ formulaResult.currentLevel }} &rarr; Level {{ formulaResult.targetLevel }} &middot;
          {{ formulaResult.feasibility.sessions }} session{{ formulaResult.feasibility.sessions > 1 ? 's' : '' }}
        </span>
      </div>
      <ul class="space-y-1 text-xs opacity-90 mb-2">
        <li v-for="(r, i) in formulaResult.feasibility.reasons" :key="i" class="flex gap-1.5">
          <span>&bull;</span><span>{{ r }}</span>
        </li>
      </ul>
      <p class="text-xs font-medium"><strong>Recommendation:</strong> {{ formulaResult.feasibility.recommendation }}</p>
    </div>

    <!-- Lift & Diagnosis Stats Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Starting Canvas</span>
        <p class="text-sm font-bold text-[#2B2D42] mt-0.5">Level {{ startingLevel }}</p>
        <span class="text-[11px] text-[#2B2D42]/60">{{ startingLevelName }}</span>
      </div>

      <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Target Canvas</span>
        <p class="text-sm font-bold text-[#E07A5F] mt-0.5">Level {{ formulaResult?.targetLevel || 7 }}</p>
        <span class="text-[11px] text-[#2B2D42]/60 truncate block">{{ colorName }}</span>
      </div>

      <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Lift Required</span>
        <p class="text-sm font-bold mt-0.5" :class="formulaResult && formulaResult.liftRequired > 0 ? 'text-[#F4A261]' : 'text-emerald-600'">
          {{ formulaResult?.liftRequired ? `+${formulaResult.liftRequired} Levels` : 'Tone on Tone (0 Lift)' }}
        </p>
        <span class="text-[11px] text-[#2B2D42]/60">Exposes: {{ formulaResult?.undertoneAtTarget || 'Neutral' }}</span>
      </div>

      <div class="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#F4F1DE]">
        <span class="text-[10px] uppercase tracking-wider text-[#2B2D42]/50 font-bold">Pre-Lightener</span>
        <p class="text-sm font-bold mt-0.5" :class="formulaResult?.needsBleach ? 'text-[#E07A5F]' : 'text-emerald-600'">
          {{ formulaResult?.needsBleach ? 'Bleach Required' : 'Direct Lift OK' }}
        </p>
        <span class="text-[11px] text-[#2B2D42]/60">{{ formulaResult?.needsBleach ? 'Requires Decolorization' : 'Single Process' }}</span>
      </div>
    </div>

    <!-- PRE-LIGHTENING / BLEACH STAGE (If Lift > 3 or Target >= 8) -->
    <div
      v-if="formulaResult?.needsBleach && formulaResult?.bleachRecipe"
      class="bg-rose-50/70 border border-rose-200 p-4 sm:p-5 rounded-2xl mb-6 relative"
    >
      <div class="flex items-center gap-2 mb-2 text-[#E07A5F] font-bold text-xs uppercase tracking-wide">
        <AlertTriangle class="w-4 h-4 text-[#E07A5F]" />
        <span>Stage 1: Pre-Lightening & Decolorization Recipe</span>
      </div>
      <p class="text-xs text-[#2B2D42]/80 mb-3">
        Because this transition requires lifting {{ formulaResult.liftRequired }} levels from Level {{ startingLevel }} to Level {{ formulaResult.targetLevel }}, a bleach canvas is required before depositing target tone.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div class="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
          <span class="text-[#2B2D42]/60 text-[11px] block">Bleaching Powder</span>
          <span class="font-bold text-[#2B2D42] text-sm">{{ formulaResult.bleachRecipe.powderGrams }}g</span>
          <span class="text-[10px] text-[#2B2D42]/50 block">Blue Dust-Free</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
          <span class="text-[#2B2D42]/60 text-[11px] block">Developer Volume</span>
          <span class="font-bold text-[#2B2D42] text-sm">{{ formulaResult.bleachRecipe.developerVolume }} Vol ({{ formulaResult.bleachRecipe.developerVolume === 30 ? '9%' : '6%' }})</span>
          <span class="text-[10px] text-[#2B2D42]/50 block">{{ formulaResult.bleachRecipe.developerGrams }}g (1:2 ratio)</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
          <span class="text-[#2B2D42]/60 text-[11px] block">Bond Protector</span>
          <span class="font-bold text-[#E07A5F] text-sm">{{ formulaResult.bleachRecipe.additive }}</span>
          <span class="text-[10px] text-[#2B2D42]/50 block">Cuticle shield</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
          <span class="text-[#2B2D42]/60 text-[11px] block">Process Time</span>
          <span class="font-bold text-[#F4A261] text-sm">{{ formulaResult.bleachRecipe.processingTimeMinutes }} mins</span>
          <span class="text-[10px] text-[#2B2D42]/50 block">Monitor lift visual</span>
        </div>
      </div>
    </div>

    <!-- COLOR SUBSTANCES MIXTURE BREAKDOWN TABLE -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold text-[#2B2D42] flex items-center gap-1.5">
          <Beaker class="w-4 h-4 text-[#E07A5F]" />
          <span>Substances & Formulation Breakdown</span>
        </span>
        <span class="text-[11px] font-mono text-[#2B2D42]/60 font-semibold">
          Total Bowl Weight: {{ formulaResult?.colorMixture?.totalProductGrams || 125 }}g
        </span>
      </div>

      <div class="border border-[#F4F1DE] rounded-2xl overflow-hidden bg-white shadow-sm">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-[#FDFBF7] text-[#2B2D42] border-b border-[#F4F1DE] font-semibold">
              <th class="py-3 px-4">Substance Component</th>
              <th class="py-3 px-4">Shade Code</th>
              <th class="py-3 px-4">Weight</th>
              <th class="py-3 px-4">Role / Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F4F1DE]">
            <tr
              v-for="(comp, i) in formulaResult?.colorMixture?.components"
              :key="i"
              class="hover:bg-[#FDFBF7]/80 transition"
            >
              <td class="py-3 px-4 font-semibold text-[#2B2D42] flex items-center gap-2.5">
                <span
                  class="w-4 h-4 rounded-full border border-black/10 shadow-sm inline-block flex-shrink-0"
                  :style="{ backgroundColor: comp.colorPreview || '#f8fafc' }"
                ></span>
                <span>{{ comp.name }}</span>
              </td>
              <td class="py-3 px-4 font-mono text-[#E07A5F] font-bold">{{ comp.code }}</td>
              <td class="py-3 px-4 font-bold text-[#2B2D42]">{{ comp.amountGrams }}g</td>
              <td class="py-3 px-4 text-[#2B2D42]/70 text-[11px]">{{ comp.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Application Steps & Care Recommendations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Steps -->
      <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE]">
        <h4 class="text-xs font-bold text-[#2B2D42] mb-3 flex items-center gap-2">
          <Clock class="w-4 h-4 text-[#E07A5F]" />
          <span>Step-by-Step Salon Application</span>
        </h4>
        <div class="space-y-3">
          <div
            v-for="step in formulaResult?.applicationSteps"
            :key="step.step"
            class="flex items-start gap-3 text-xs"
          >
            <div class="w-6 h-6 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] border border-[#E07A5F]/30 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
              {{ step.step }}
            </div>
            <div>
              <div class="flex items-center gap-2 font-bold text-[#2B2D42]">
                <span>{{ step.phase }}</span>
                <span v-if="step.timeMinutes" class="text-[10px] text-[#F4A261] font-mono">
                  ({{ step.timeMinutes }} mins)
                </span>
              </div>
              <p class="text-[11px] text-[#2B2D42]/70 mt-0.5 leading-relaxed">{{ step.instruction }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Aftercare Checklist -->
      <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] flex flex-col justify-between">
        <div>
          <h4 class="text-xs font-bold text-[#2B2D42] mb-3 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>Salon Aftercare & Tone Preservation</span>
          </h4>
          <ul class="space-y-2.5 text-xs text-[#2B2D42]/80">
            <li
              v-for="(note, idx) in formulaResult?.salonCareNotes"
              :key="idx"
              class="flex items-start gap-2"
            >
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span class="text-[11px] leading-relaxed">{{ note }}</span>
            </li>
          </ul>
        </div>

        <!-- Success feedback if saved -->
        <div
          v-if="saveSuccessMessage"
          class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2"
        >
          <Check class="w-4 h-4 text-emerald-600" />
          <span>{{ saveSuccessMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FlaskConical,
  BookmarkCheck,
  AlertTriangle,
  Beaker,
  Clock,
  ShieldCheck,
  CheckCircle,
  Check,
  FileDown,
  Share2,
  Mail
} from 'lucide-vue-next'
import type { FormulationResult } from '~/server/utils/hairChemistry'

const props = defineProps<{
  targetHex: string
  colorName: string
  colorFamily?: string
  userPhoto: string
  formula: FormulationResult | null
  detectedLevel?: number
  getTransformedSnapshot?: () => string
}>()

const emit = defineEmits<{
  (e: 'simulation-saved', id: string): void
  (e: 'override-level', level: number | null): void
}>()

const formulaResult = computed(() => props.formula)
const startingLevel = ref(props.formula?.currentLevel || props.detectedLevel || 4)
const isSaving = ref(false)
const saveSuccessMessage = ref<string | null>(null)

watch(() => props.formula?.currentLevel, (lvl) => {
  if (lvl) startingLevel.value = lvl
})

const levelNames: Record<number, string> = {
  1: 'Level 1: Black',
  2: 'Level 2: Darkest Brown',
  3: 'Level 3: Dark Brown',
  4: 'Level 4: Medium Brown',
  5: 'Level 5: Light Brown',
  6: 'Level 6: Dark Blonde',
  7: 'Level 7: Medium Blonde',
  8: 'Level 8: Light Blonde',
  9: 'Level 9: Very Light Blonde',
  10: 'Level 10: Lightest Blonde'
}

const startingLevelName = computed(() => levelNames[startingLevel.value] || 'Natural Base')

function setLevel(lvl: number) {
  startingLevel.value = lvl
  emit('override-level', lvl)
}
function applyLevelFromSlider() {
  emit('override-level', startingLevel.value)
}
function resetToDetected() {
  if (props.detectedLevel) startingLevel.value = props.detectedLevel
  emit('override-level', null)
}

function downloadPdfConsultation() {
  // Triggers clean browser print dialog which user can Save as PDF
  window.print()
}

function shareToWhatsApp() {
  const headline = `*AuraHair Salon Consultation: ${props.colorName}*`
  const level = `Base Level: L${startingLevel.value} -> Target: L${formulaResult.value?.targetLevel || 7}`
  const formula = formulaResult.value?.dispensaryFormula
    ? `Developer: ${formulaResult.value.dispensaryFormula.developerVolume} Vol | Mix: ${formulaResult.value.dispensaryFormula.mixingRatio} | Time: ${formulaResult.value.dispensaryFormula.processingTimeMinutes} mins`
    : ''
  const bleach = formulaResult.value?.needsBleach
    ? `Bleach: Required (${formulaResult.value.bleachRecipe?.powderGrams || 30}g powder + ${formulaResult.value.bleachRecipe?.developerGrams || 60}g developer)`
    : 'Bleach: Direct lift, no decolorization needed'
  
  const text = encodeURIComponent(`${headline}\n${level}\n${formula}\n${bleach}\n\nGenerated with AuraHair Chromastand AI`)
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
}

function shareToEmail() {
  const subject = encodeURIComponent(`AuraHair Consultation Card: ${props.colorName}`)
  const body = encodeURIComponent(
    `AuraHair Salon Work Order & Color Consultation\n\n` +
    `Client Target Look: ${props.colorName} (${props.targetHex})\n` +
    `Starting Level: Level ${startingLevel.value} (${startingLevelName.value})\n` +
    `Target Level: Level ${formulaResult.value?.targetLevel || 7}\n\n` +
    `Dispensary Mix:\n` +
    `- Developer Volume: ${formulaResult.value?.dispensaryFormula?.developerVolume || 20} Vol\n` +
    `- Mixing Ratio: ${formulaResult.value?.dispensaryFormula?.mixingRatio || '1:1.5'}\n` +
    `- Processing Time: ${formulaResult.value?.dispensaryFormula?.processingTimeMinutes || 35} minutes\n\n` +
    `Feasibility Notes:\n${formulaResult.value?.feasibility?.recommendation || 'Standard salon procedure'}\n\n` +
    `Simulated via AuraHair Chromastand AI`
  )
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

async function saveSimulation() {
  isSaving.value = true
  saveSuccessMessage.value = null
  try {
    const transformedImage = props.getTransformedSnapshot ? props.getTransformedSnapshot() : ''

    const res = await $fetch<{ success: boolean, data: { id: string } }>('/api/simulations', {
      method: 'POST',
      body: {
        title: `${props.colorName} Hair Color Formulation`,
        clientName: 'Personal Simulation',
        userPhoto: props.userPhoto,
        hairStyleId: 'hair_color_studio',
        hairStyleName: props.colorName,
        hairCategory: 'Color Chemistry',
        colorHex: props.targetHex,
        colorName: props.colorName,
        colorFamily: props.colorFamily || 'natural',
        baseHairLevel: startingLevel.value,
        targetHairLevel: formulaResult.value?.targetLevel || 7,
        formula: formulaResult.value,
        frontImage: transformedImage,
        sideImage: null,
        backImage: null
      }
    })

    if (res.success && res.data?.id) {
      saveSuccessMessage.value = `Color formula saved to database (ID: ${res.data.id})!`
      emit('simulation-saved', res.data.id)
      setTimeout(() => {
        saveSuccessMessage.value = null
      }, 5000)
    }
  } catch (err) {
    console.error('Failed to save simulation', err)
    saveSuccessMessage.value = 'Failed to save to database.'
  } finally {
    isSaving.value = false
  }
}
</script>
