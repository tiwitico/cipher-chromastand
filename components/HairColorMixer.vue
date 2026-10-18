<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl text-[#2B2D42]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#F4F1DE] pb-5">
      <div>
        <h3 class="text-lg font-bold text-[#2B2D42] flex items-center gap-2">
          <Palette class="w-5 h-5 text-[#E07A5F]" />
          <span>Hair Color Simulation & Chemistry</span>
        </h3>
        <p class="text-xs text-[#2B2D42]/60 mt-0.5">Choose from salon-grade tones or formulate your custom shade</p>
      </div>

      <!-- Current Selected Color Chip -->
      <div class="flex items-center gap-2.5 bg-[#FDFBF7] px-3.5 py-2 rounded-2xl border border-[#F4F1DE] shadow-sm">
        <div
          class="w-6 h-6 rounded-full border border-black/10 shadow-sm"
          :style="{ backgroundColor: modelColor }"
        ></div>
        <div class="text-left">
          <p class="text-xs font-bold text-[#2B2D42] leading-tight">{{ currentColorName }}</p>
          <p class="text-[10px] text-[#2B2D42]/60 font-mono">{{ modelColor.toUpperCase() }}</p>
        </div>
      </div>
    </div>

    <!-- Color Techniques Tabs -->
    <div class="grid grid-cols-4 gap-1.5 p-1 bg-[#FDFBF7] rounded-2xl border border-[#F4F1DE] text-xs mb-6">
      <button
        v-for="tech in techniques"
        :key="tech.id"
        type="button"
        @click="selectedTechnique = tech.id"
        class="py-2 px-2.5 rounded-xl font-semibold transition text-center"
        :class="selectedTechnique === tech.id ? 'bg-[#E07A5F] text-white shadow-sm' : 'text-[#2B2D42]/70 hover:text-[#2B2D42]'"
      >
        {{ tech.label }}
      </button>
    </div>

    <!-- Salon Color Swatches Grid -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold text-[#2B2D42]">Curated Salon Swatches</span>
        <span class="text-[11px] text-[#2B2D42]/60 font-medium">12 Expert Formulations</span>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        <button
          v-for="color in presetColors"
          :key="color.id"
          type="button"
          @click="selectPresetColor(color)"
          class="group p-2.5 rounded-2xl border text-left transition flex flex-col items-center gap-1.5 shadow-sm"
          :class="modelColor.toLowerCase() === color.hex.toLowerCase() ? 'border-[#E07A5F] bg-white ring-2 ring-[#E07A5F]/30 shadow' : 'border-[#F4F1DE] bg-[#FDFBF7] hover:border-[#E07A5F]/40'"
        >
          <div class="relative w-8 h-8 rounded-full shadow-sm border border-black/10 overflow-hidden flex items-center justify-center">
            <div class="w-full h-full" :style="{ backgroundColor: color.hex }"></div>
            <Check
              v-if="modelColor.toLowerCase() === color.hex.toLowerCase()"
              class="w-4 h-4 text-white drop-shadow absolute"
            />
          </div>
          <span class="text-[11px] font-bold text-[#2B2D42] truncate w-full text-center">
            {{ color.name }}
          </span>
          <span class="text-[10px] font-mono text-[#2B2D42]/60 -mt-0.5">
            Lvl {{ color.level }}
          </span>
        </button>
      </div>
    </div>

    <!-- Custom Tone Adjusters & Sliders -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#F4F1DE]">
      
      <!-- Primary Custom Picker & Hex Input -->
      <div>
        <label class="block text-xs font-bold text-[#2B2D42] mb-1.5 flex items-center justify-between">
          <span>Target Color (Hex / Picker)</span>
          <span class="font-mono text-[#E07A5F]">{{ modelColor }}</span>
        </label>
        <div class="flex items-center gap-2.5">
          <input
            type="color"
            v-model="modelColor"
            class="w-11 h-11 rounded-xl cursor-pointer bg-white border border-[#F4F1DE] p-1 shadow-sm"
            @input="handleCustomColorInput"
          />
          <input
            type="text"
            v-model="modelColor"
            placeholder="#B8491A"
            class="flex-1 bg-[#FDFBF7] border border-[#F4F1DE] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#2B2D42] uppercase focus:outline-none focus:border-[#E07A5F] shadow-sm font-semibold"
            @input="handleCustomColorInput"
          />
        </div>
      </div>

      <!-- Secondary Color (For Balayage / Ombre / Highlights) -->
      <div v-if="selectedTechnique !== 'solid'">
        <label class="block text-xs font-bold text-[#2B2D42] mb-1.5 flex items-center justify-between">
          <span>Secondary / Ends Tone</span>
          <span class="font-mono text-[#F4A261]">{{ secondaryColor }}</span>
        </label>
        <div class="flex items-center gap-2.5">
          <input
            type="color"
            v-model="secondaryColor"
            class="w-11 h-11 rounded-xl cursor-pointer bg-white border border-[#F4F1DE] p-1 shadow-sm"
            @input="emitChange"
          />
          <input
            type="text"
            v-model="secondaryColor"
            class="flex-1 bg-[#FDFBF7] border border-[#F4F1DE] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#2B2D42] uppercase focus:outline-none focus:border-[#E07A5F] shadow-sm font-semibold"
            @input="emitChange"
          />
        </div>
      </div>

      <!-- Hair Gloss / Shine Slider -->
      <div>
        <label class="block text-xs font-bold text-[#2B2D42] mb-1 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-[#F4A261]" />
            <span>Gloss & Specular Luster</span>
          </span>
          <span class="font-mono text-[#F4A261]">{{ glossLevel }}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="100"
          v-model.number="glossLevel"
          class="w-full accent-[#E07A5F] bg-[#F4F1DE] h-2 rounded-lg cursor-pointer"
          @input="emitChange"
        />
        <div class="flex justify-between text-[10px] text-[#2B2D42]/60 mt-1">
          <span>Natural Matte</span>
          <span>Satin Glow</span>
          <span>Glass Mirror</span>
        </div>
      </div>

      <!-- Shadow Root / Root Darkening -->
      <div>
        <label class="block text-xs font-bold text-[#2B2D42] mb-1 flex items-center justify-between">
          <span>Root Depth / Shadow Root</span>
          <span class="font-mono text-[#E07A5F]">{{ rootDepth }}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="80"
          v-model.number="rootDepth"
          class="w-full accent-[#E07A5F] bg-[#F4F1DE] h-2 rounded-lg cursor-pointer"
          @input="emitChange"
        />
        <div class="flex justify-between text-[10px] text-[#2B2D42]/60 mt-1">
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

const modelColor = ref(props.initialColorHex || '#B8491A')
const secondaryColor = ref('#D1AC61')
const currentColorName = ref('Fiery Irish Copper')
const currentColorFamily = ref('copper')
const selectedTechnique = ref<'solid' | 'balayage' | 'ombre' | 'highlights'>('balayage')
const glossLevel = ref(75)
const rootDepth = ref(25)

const techniques = [
  { id: 'balayage', label: 'Balayage' },
  { id: 'solid', label: 'Solid All-Over' },
  { id: 'ombre', label: 'Gradient Ombre' },
  { id: 'highlights', label: 'Ribbon Highlights' }
] as const

const presetColors = ref<ColorPresetItem[]>([])

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean, data: ColorPresetItem[] }>('/api/presets/colors')
    if (res.success && res.data) {
      presetColors.value = res.data
    }
  } catch (err) {
    // Fallback static preset colors
    presetColors.value = [
      { id: 'c_espresso', name: 'Midnight Espresso', category: 'Natural', hex: '#1C1514', level: 2, family: 'natural' },
      { id: 'c_chestnut', name: 'Rich Chestnut', category: 'Natural', hex: '#442B21', level: 4, family: 'natural' },
      { id: 'c_caramel', name: 'Caramel Honey', category: 'Warm', hex: '#87532B', level: 6, family: 'warm_gold' },
      { id: 'c_copper', name: 'Fiery Irish Copper', category: 'Warm', hex: '#B8491A', level: 6, family: 'copper' },
      { id: 'c_cherry', name: 'Bordeaux Cherry', category: 'Red', hex: '#7A1C2C', level: 4, family: 'red' },
      { id: 'c_gold_blonde', name: 'Champagne Honey', category: 'Blonde', hex: '#D1AC61', level: 8, family: 'warm_gold' },
      { id: 'c_ash_nordic', name: 'Nordic Ash', category: 'Ash', hex: '#B5A898', level: 8, family: 'ash' },
      { id: 'c_platinum', name: 'Diamond Platinum', category: 'Silver', hex: '#EBE5DE', level: 10, family: 'silver' },
      { id: 'c_rose_quartz', name: 'Dusty Rose Quartz', category: 'Fashion', hex: '#C67B7A', level: 8, family: 'fashion' },
      { id: 'c_lavender', name: 'Smoked Lavender', category: 'Fashion', hex: '#8F82A8', level: 9, family: 'fashion' },
      { id: 'c_emerald', name: 'Midnight Emerald', category: 'Fashion', hex: '#16483C', level: 3, family: 'fashion' },
      { id: 'c_sapphire', name: 'Royal Sapphire', category: 'Fashion', hex: '#17274E', level: 2, family: 'fashion' }
    ]
  }
  emitChange()
})

watch(() => props.initialColorHex, (newHex) => {
  if (newHex && newHex !== modelColor.value) {
    modelColor.value = newHex
  }
})

function selectPresetColor(color: ColorPresetItem) {
  modelColor.value = color.hex
  currentColorName.value = color.name
  currentColorFamily.value = color.family
  emitChange()
}

function handleCustomColorInput() {
  currentColorName.value = 'Custom Shade'
  currentColorFamily.value = 'custom'
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
