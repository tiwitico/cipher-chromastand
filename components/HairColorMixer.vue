<template>
  <div class="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <Palette class="w-5 h-5 text-rose-400" />
          <span>Hair Color Simulation & Chemistry</span>
        </h3>
        <p class="text-xs text-slate-400">Choose from salon-grade tones or formulate your custom shade</p>
      </div>

      <!-- Current Selected Color Chip -->
      <div class="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
        <div
          class="w-5 h-5 rounded-full border border-white/20 shadow-inner"
          :style="{ backgroundColor: modelColor }"
        ></div>
        <div class="text-left">
          <p class="text-xs font-bold text-slate-100 leading-tight">{{ currentColorName }}</p>
          <p class="text-[10px] text-slate-400 font-mono">{{ modelColor.toUpperCase() }}</p>
        </div>
      </div>
    </div>

    <!-- Color Techniques Tabs -->
    <div class="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs mb-4">
      <button
        v-for="tech in techniques"
        :key="tech.id"
        type="button"
        @click="selectedTechnique = tech.id"
        class="py-1.5 px-2 rounded-lg font-medium transition text-center"
        :class="selectedTechnique === tech.id ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
      >
        {{ tech.label }}
      </button>
    </div>

    <!-- Salon Color Swatches Grid -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-slate-300">Curated Salon Swatches</span>
        <span class="text-[11px] text-slate-500">12 Expert Formulations</span>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        <button
          v-for="color in presetColors"
          :key="color.id"
          type="button"
          @click="selectPresetColor(color)"
          class="group p-2 rounded-xl border text-left transition flex flex-col items-center gap-1.5"
          :class="modelColor.toLowerCase() === color.hex.toLowerCase() ? 'border-rose-400 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.2)]' : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'"
        >
          <div class="relative w-8 h-8 rounded-full shadow-md border border-white/10 overflow-hidden flex items-center justify-center">
            <div class="w-full h-full" :style="{ backgroundColor: color.hex }"></div>
            <Check
              v-if="modelColor.toLowerCase() === color.hex.toLowerCase()"
              class="w-4 h-4 text-white drop-shadow absolute"
            />
          </div>
          <span class="text-[11px] font-medium text-slate-200 truncate w-full text-center">
            {{ color.name }}
          </span>
          <span class="text-[9px] font-mono text-slate-400 -mt-1">
            Lvl {{ color.level }}
          </span>
        </button>
      </div>
    </div>

    <!-- Custom Tone Adjusters & Sliders -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
      
      <!-- Primary Custom Picker & Hex Input -->
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
          <span>Target Color (Hex / Picker)</span>
          <span class="font-mono text-rose-300">{{ modelColor }}</span>
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="modelColor"
            class="w-10 h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-0.5"
            @input="handleCustomColorInput"
          />
          <input
            type="text"
            v-model="modelColor"
            placeholder="#B8491A"
            class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-rose-500"
            @input="handleCustomColorInput"
          />
        </div>
      </div>

      <!-- Secondary Color (For Balayage / Ombre / Highlights) -->
      <div v-if="selectedTechnique !== 'solid'">
        <label class="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
          <span>Secondary / Ends Tone</span>
          <span class="font-mono text-amber-300">{{ secondaryColor }}</span>
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="secondaryColor"
            class="w-10 h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-0.5"
            @input="emitChange"
          />
          <input
            type="text"
            v-model="secondaryColor"
            class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-rose-500"
            @input="emitChange"
          />
        </div>
      </div>

      <!-- Hair Gloss / Shine Slider -->
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-amber-400" />
            <span>Gloss & Specular Luster</span>
          </span>
          <span class="font-mono text-amber-300">{{ glossLevel }}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="100"
          v-model.number="glossLevel"
          class="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          @input="emitChange"
        />
        <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
          <span>Natural Matte</span>
          <span>Satin</span>
          <span>Glass Mirror</span>
        </div>
      </div>

      <!-- Shadow Root / Root Darkening -->
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
          <span>Root Depth / Shadow Root</span>
          <span class="font-mono text-rose-300">{{ rootDepth }}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="80"
          v-model.number="rootDepth"
          class="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          @input="emitChange"
        />
        <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
          <span>Blended Soft Root</span>
          <span>Smudged</span>
          <span>Deep Root Melt</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Palette, Sparkles, Check } from 'lucide-vue-next'

export interface ColorPresetItem {
  id: string
  name: string
  category: string
  hex: string
  level: number
  family: string
  description?: string
  undertone?: string
}

const props = defineProps<{
  initialColorHex?: string
}>()

const emit = defineEmits<{
  (e: 'color-change', data: {
    colorHex: string
    colorName: string
    colorFamily: string
    secondaryHex: string
    technique: 'solid' | 'balayage' | 'ombre' | 'highlights'
    gloss: number
    rootDepth: number
  }): void
}>()

const techniques = [
  { id: 'solid' as const, label: 'Solid Shade' },
  { id: 'balayage' as const, label: 'Balayage Melt' },
  { id: 'ombre' as const, label: 'Ombré Gradient' },
  { id: 'highlights' as const, label: 'Sun Highlights' }
]

const selectedTechnique = ref<'solid' | 'balayage' | 'ombre' | 'highlights'>('balayage')
const modelColor = ref(props.initialColorHex || '#87532B')
const currentColorName = ref('Toasted Caramel Honey')
const currentColorFamily = ref('warm_gold')
const secondaryColor = ref('#D1AC61')
const glossLevel = ref(75)
const rootDepth = ref(30)

const presetColors = ref<ColorPresetItem[]>([])

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean, data: ColorPresetItem[] }>('/api/presets/colors')
    if (res.success && res.data) {
      presetColors.value = res.data
      // Find matching or default
      const match = presetColors.value.find(c => c.hex.toLowerCase() === modelColor.value.toLowerCase()) || presetColors.value[2]
      if (match) {
        selectPresetColor(match)
      } else {
        emitChange()
      }
    }
  } catch (err) {
    console.error('Failed to load preset colors', err)
    emitChange()
  }
})

watch(selectedTechnique, () => {
  emitChange()
})

function selectPresetColor(preset: ColorPresetItem) {
  modelColor.value = preset.hex
  currentColorName.value = preset.name
  currentColorFamily.value = preset.family

  // Auto-set complementary secondary tone for dimension
  if (preset.level <= 4) {
    secondaryColor.value = '#87532B' // caramel lift
  } else if (preset.level <= 7) {
    secondaryColor.value = '#D1AC61' // honey gold
  } else {
    secondaryColor.value = '#EBE5DE' // platinum shine
  }

  emitChange()
}

function handleCustomColorInput() {
  currentColorName.value = 'Custom Formulated Tone'
  currentColorFamily.value = 'natural'
  emitChange()
}

function emitChange() {
  emit('color-change', {
    colorHex: modelColor.value,
    colorName: currentColorName.value,
    colorFamily: currentColorFamily.value,
    secondaryHex: secondaryColor.value,
    technique: selectedTechnique.value,
    gloss: glossLevel.value,
    rootDepth: rootDepth.value
  })
}
</script>
