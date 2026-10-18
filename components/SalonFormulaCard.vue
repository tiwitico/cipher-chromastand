<template>
  <div class="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
    <!-- Top Decorative Gradient Glow -->
    <div
      class="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
      :style="{ backgroundColor: targetHex }"
    ></div>

    <!-- Header & Save Action -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
          <FlaskConical class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span>Color Formulation & Substances Recipe</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Salon Professional Mix
            </span>
          </h3>
          <p class="text-xs text-slate-400">Chemical dye ratio, developer volume, and bleaching procedure</p>
        </div>
      </div>

      <!-- Save Simulation & Recipe Button -->
      <button
        type="button"
        @click="saveSimulation"
        :disabled="isSaving"
        class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
      >
        <BookmarkCheck class="w-4 h-4" />
        <span>{{ isSaving ? 'Saving to Database...' : 'Save Look & Formula' }}</span>
      </button>
    </div>

    <!-- Starting Hair Level (detected from photo, can be corrected) -->
    <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 mb-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-xs font-semibold text-slate-200">Current Hair Level (read from your photo)</span>
          <p class="text-[11px] text-slate-400">Wrong? Correct it and feasibility + materials are recalculated by the backend</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-rose-300">Level {{ startingLevel }}</span>
          <span class="text-[11px] text-slate-400 block">{{ startingLevelName }}</span>
          <button
            v-if="detectedLevel && startingLevel !== detectedLevel"
            type="button"
            class="text-[10px] text-amber-300 underline mt-0.5"
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
          class="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          @change="applyLevelFromSlider"
        />
        <div class="grid grid-cols-10 gap-1 text-center">
          <button
            v-for="lvl in 10"
            :key="lvl"
            type="button"
            @click="setLevel(lvl)"
            class="py-1 rounded border text-[10px] font-mono transition"
            :class="startingLevel === lvl ? 'border-rose-400 bg-rose-500/20 text-white font-bold' : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'"
          >
            L{{ lvl }}
          </button>
        </div>
      </div>
    </div>

    <!-- Feasibility verdict: can this colour change be done, and is bleach needed? -->
    <div
      v-if="formulaResult?.feasibility"
      class="p-4 rounded-xl border mb-6"
      :class="{
        'bg-emerald-950/30 border-emerald-800/60': ['direct', 'deposit_only'].includes(formulaResult.feasibility.status),
        'bg-amber-950/30 border-amber-800/60': ['bleach_required', 'multi_session'].includes(formulaResult.feasibility.status),
        'bg-rose-950/40 border-rose-800/60': formulaResult.feasibility.status === 'not_recommended'
      }"
    >
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 class="text-sm font-bold text-white">{{ formulaResult.feasibility.headline }}</h4>
        <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
          Level {{ formulaResult.currentLevel }} &rarr; Level {{ formulaResult.targetLevel }} &middot;
          {{ formulaResult.feasibility.sessions }} session{{ formulaResult.feasibility.sessions > 1 ? 's' : '' }}
        </span>
      </div>
      <ul class="space-y-1 text-[11px] text-slate-300 mb-2">
        <li v-for="(r, i) in formulaResult.feasibility.reasons" :key="i" class="flex gap-1.5">
          <span class="text-slate-500">&bull;</span><span>{{ r }}</span>
        </li>
      </ul>
      <p class="text-xs text-slate-100"><strong>Recommendation:</strong> {{ formulaResult.feasibility.recommendation }}</p>
    </div>


    <!-- Lift & Diagnosis Stats Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Starting Canvas</span>
        <p class="text-sm font-bold text-white mt-0.5">Level {{ startingLevel }}</p>
        <span class="text-[10px] text-slate-500">{{ startingLevelName }}</span>
      </div>

      <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Target Canvas</span>
        <p class="text-sm font-bold text-rose-300 mt-0.5">Level {{ formulaResult?.targetLevel || 7 }}</p>
        <span class="text-[10px] text-slate-400">{{ colorName }}</span>
      </div>

      <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Lift Required</span>
        <p class="text-sm font-bold mt-0.5" :class="formulaResult && formulaResult.liftRequired > 0 ? 'text-amber-400' : 'text-emerald-400'">
          {{ formulaResult?.liftRequired ? `+${formulaResult.liftRequired} Levels` : 'Tone on Tone (0 Lift)' }}
        </p>
        <span class="text-[10px] text-slate-500">Exposes: {{ formulaResult?.undertoneAtTarget || 'Neutral' }}</span>
      </div>

      <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pre-Lightener</span>
        <p class="text-sm font-bold mt-0.5" :class="formulaResult?.needsBleach ? 'text-rose-400' : 'text-emerald-400'">
          {{ formulaResult?.needsBleach ? 'Bleach Required' : 'Direct Lift OK' }}
        </p>
        <span class="text-[10px] text-slate-500">{{ formulaResult?.needsBleach ? 'Requires Decolorization' : 'Single Process' }}</span>
      </div>
    </div>

    <!-- PRE-LIGHTENING / BLEACH STAGE (If Lift > 3 or Target >= 8) -->
    <div
      v-if="formulaResult?.needsBleach && formulaResult?.bleachRecipe"
      class="bg-rose-950/30 border border-rose-800/60 p-4 rounded-xl mb-6 relative"
    >
      <div class="flex items-center gap-2 mb-2 text-rose-300 font-semibold text-xs uppercase tracking-wide">
        <AlertTriangle class="w-4 h-4 text-rose-400" />
        <span>Stage 1: Pre-Lightening & Decolorization Recipe</span>
      </div>
      <p class="text-xs text-rose-200/80 mb-3">
        Because this transition requires lifting {{ formulaResult.liftRequired }} levels from Level {{ startingLevel }} to Level {{ formulaResult.targetLevel }}, a bleach canvas is required before depositing target tone.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-400 text-[11px] block">Bleaching Powder</span>
          <span class="font-bold text-white">{{ formulaResult.bleachRecipe.powderGrams }}g</span>
          <span class="text-[10px] text-slate-500 block">Blue Dust-Free</span>
        </div>
        <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-400 text-[11px] block">Developer Volume</span>
          <span class="font-bold text-white">{{ formulaResult.bleachRecipe.developerVolume }} Vol ({{ formulaResult.bleachRecipe.developerVolume === 30 ? '9%' : '6%' }})</span>
          <span class="text-[10px] text-slate-500 block">{{ formulaResult.bleachRecipe.developerGrams }}g (1:2 ratio)</span>
        </div>
        <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-400 text-[11px] block">Bond Protector</span>
          <span class="font-bold text-amber-300">{{ formulaResult.bleachRecipe.additive }}</span>
          <span class="text-[10px] text-slate-500 block">Cuticle shield</span>
        </div>
        <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span class="text-slate-400 text-[11px] block">Process Time</span>
          <span class="font-bold text-rose-300">{{ formulaResult.bleachRecipe.processingTimeMinutes }} mins</span>
          <span class="text-[10px] text-slate-500 block">Monitor lift visual</span>
        </div>
      </div>
    </div>

    <!-- COLOR SUBSTANCES MIXTURE BREAKDOWN TABLE -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Beaker class="w-4 h-4 text-rose-400" />
          <span>Substances & Formulation Breakdown</span>
        </span>
        <span class="text-[11px] font-mono text-slate-400">
          Total Bowl Weight: {{ formulaResult?.colorMixture?.totalProductGrams || 125 }}g
        </span>
      </div>

      <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/70">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-800/80 text-slate-300 border-b border-slate-700/60">
              <th class="py-2.5 px-3 font-semibold">Substance Component</th>
              <th class="py-2.5 px-3 font-semibold">Shade Code</th>
              <th class="py-2.5 px-3 font-semibold">Weight</th>
              <th class="py-2.5 px-3 font-semibold">Role / Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="(comp, i) in formulaResult?.colorMixture?.components"
              :key="i"
              class="hover:bg-slate-800/40 transition"
            >
              <td class="py-2.5 px-3 font-medium text-slate-100 flex items-center gap-2">
                <span
                  class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm inline-block flex-shrink-0"
                  :style="{ backgroundColor: comp.colorPreview || '#f8fafc' }"
                ></span>
                <span>{{ comp.name }}</span>
              </td>
              <td class="py-2.5 px-3 font-mono text-rose-300 font-semibold">{{ comp.code }}</td>
              <td class="py-2.5 px-3 font-bold text-white">{{ comp.amountGrams }}g</td>
              <td class="py-2.5 px-3 text-slate-400 text-[11px]">{{ comp.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Application Steps & Care Recommendations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Steps -->
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <h4 class="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Clock class="w-4 h-4 text-rose-400" />
          <span>Step-by-Step Salon Application</span>
        </h4>
        <div class="space-y-3">
          <div
            v-for="step in formulaResult?.applicationSteps"
            :key="step.step"
            class="flex items-start gap-2.5 text-xs"
          >
            <div class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
              {{ step.step }}
            </div>
            <div>
              <div class="flex items-center gap-2 font-semibold text-slate-200">
                <span>{{ step.phase }}</span>
                <span v-if="step.timeMinutes" class="text-[10px] text-amber-300 font-mono">
                  ({{ step.timeMinutes }} mins)
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{{ step.instruction }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Aftercare Checklist -->
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
        <div>
          <h4 class="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>Salon Aftercare & Tone Preservation</span>
          </h4>
          <ul class="space-y-2 text-xs text-slate-300">
            <li
              v-for="(note, idx) in formulaResult?.salonCareNotes"
              :key="idx"
              class="flex items-start gap-2"
            >
              <CheckCircle class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span class="text-[11px] text-slate-300 leading-relaxed">{{ note }}</span>
            </li>
          </ul>
        </div>

        <!-- Success feedback if saved -->
        <div
          v-if="saveSuccessMessage"
          class="mt-4 p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center gap-2"
        >
          <Check class="w-4 h-4 text-emerald-400" />
          <span>{{ saveSuccessMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  FlaskConical,
  BookmarkCheck,
  AlertTriangle,
  Beaker,
  Clock,
  ShieldCheck,
  CheckCircle,
  Check
} from 'lucide-vue-next'
import type { FormulationResult } from '~/server/utils/hairChemistry'

const props = defineProps<{
  targetHex: string
  colorName: string
  colorFamily?: string
  userPhoto: string
  /** formula computed by the backend from the photo (/api/hair/process) */
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

// Manual correction of the level read from the photo: the backend re-runs feasibility + materials.
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
      saveSuccessMessage.value = `Color formula successfully saved to PostgreSQL database (ID: ${res.data.id})!`
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
