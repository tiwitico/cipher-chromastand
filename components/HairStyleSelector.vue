<template>
  <div class="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <Scissors class="w-5 h-5 text-rose-400" />
          <span>Hairstyle Collection</span>
        </h3>
        <p class="text-xs text-slate-400">Choose from precision cuts, trendy bangs, and versatile textures</p>
      </div>

      <!-- Gender Filter -->
      <div class="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
        <button
          v-for="g in ['all', 'female', 'male']"
          :key="g"
          type="button"
          @click="selectedGender = g"
          class="px-2.5 py-1 rounded-md capitalize transition"
          :class="selectedGender === g ? 'bg-rose-500 text-white font-medium shadow' : 'text-slate-400 hover:text-white'"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- Search & Category Filters -->
    <div class="flex flex-col sm:flex-row gap-2 mb-4">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search cuts (e.g., Bob, Waves, Shag, Fade)..."
          class="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
        />
      </div>

      <!-- Quick category pills -->
      <div class="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedCategory = cat"
          class="px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition border"
          :class="selectedCategory === cat ? 'bg-slate-800 text-rose-300 border-rose-500/40' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-300'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Hairstyles Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
      <div
        v-for="style in filteredStyles"
        :key="style.id"
        @click="selectStyle(style)"
        class="group p-3 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between"
        :class="modelValue === style.id ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/50' : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700'"
      >
        <div>
          <!-- Badges -->
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-rose-300 capitalize">
              {{ style.length }}
            </span>
            <span
              v-if="style.trending"
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5"
            >
              <Sparkles class="w-2.5 h-2.5" /> Trend
            </span>
          </div>

          <h4 class="text-xs font-semibold text-slate-100 group-hover:text-rose-200 transition line-clamp-1">
            {{ style.name }}
          </h4>
          <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
            {{ style.description }}
          </p>
        </div>

        <div class="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
          <span class="capitalize">{{ style.texture }}</span>
          <span
            v-if="modelValue === style.id"
            class="text-rose-400 font-bold flex items-center gap-1"
          >
            <Check class="w-3 h-3" /> Selected
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Scissors, Search, Sparkles, Check } from 'lucide-vue-next'

export interface HairStyleItem {
  id: string
  name: string
  gender: string
  category: string
  length: string
  description: string
  texture: string
  trending: number
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void
  (e: 'style-change', style: HairStyleItem): void
}>()

const styles = ref<HairStyleItem[]>([])
const selectedGender = ref('all')
const selectedCategory = ref('All')
const searchQuery = ref('')

const categories = ['All', 'Modern Classic', 'Short & Sleek', 'Edgy & Layered', 'Gentleman Modern', 'K-Trend', 'Boho Chic']

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean, data: HairStyleItem[] }>('/api/presets/hairstyles')
    if (res.success && res.data) {
      styles.value = res.data
      const initial = styles.value.find(s => s.id === props.modelValue) || styles.value[0]
      if (initial) {
        emit('style-change', initial)
      }
    }
  } catch (err) {
    console.error('Failed to load hairstyles', err)
  }
})

const filteredStyles = computed(() => {
  return styles.value.filter(style => {
    // Gender
    if (selectedGender.value !== 'all' && style.gender !== 'unisex' && style.gender !== selectedGender.value) {
      return false
    }
    // Category
    if (selectedCategory.value !== 'All' && style.category !== selectedCategory.value) {
      return false
    }
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return style.name.toLowerCase().includes(q) || style.description.toLowerCase().includes(q)
    }
    return true
  })
})

function selectStyle(style: HairStyleItem) {
  emit('update:modelValue', style.id)
  emit('style-change', style)
}
</script>
