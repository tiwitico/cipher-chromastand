<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <BookmarkCheck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Saved Styling & Color Journey</h3>
            <p class="text-xs text-slate-400">Your simulated hairstyles and salon chemistry recipes stored in SQLite</p>
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

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-5">
        <!-- Loading State -->
        <div v-if="isLoading" class="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 class="w-8 h-8 animate-spin text-rose-400 mb-2" />
          <p class="text-xs">Loading saved looks from SQLite database...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="savedList.length === 0" class="py-16 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
            <Bookmark class="w-8 h-8" />
          </div>
          <h4 class="text-sm font-semibold text-slate-200">No Saved Looks Yet</h4>
          <p class="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Simulate any hairstyle and color combination, then click "Save Look & Formula" to archive it here.
          </p>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
          >
            Start Styling
          </button>
        </div>

        <!-- Grid of Saved Simulations -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="item in savedList"
            :key="item.id"
            class="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold text-white line-clamp-1">{{ item.title }}</span>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                    :style="{ backgroundColor: item.color_hex }"
                  ></span>
                  <span class="text-[11px] font-mono text-slate-400">{{ item.color_hex }}</span>
                </div>
              </div>

              <!-- Metadata pills -->
              <div class="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300 font-medium">
                  {{ item.hair_style_name }}
                </span>
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                  Base L{{ item.base_hair_level }} → Target L{{ item.target_hair_level }}
                </span>
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <!-- Multi-angle Thumbnails preview -->
              <div class="grid grid-cols-3 gap-2 bg-slate-900/70 p-2 rounded-lg border border-slate-800/60 mb-3">
                <div class="text-center">
                  <span class="text-[9px] text-slate-400 block mb-1">Front</span>
                  <div class="aspect-[4/5] rounded overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      v-if="item.front_image && (item.front_image.startsWith('data:') || item.front_image.startsWith('http'))"
                      :src="item.front_image"
                      alt="Front"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else-if="item.front_image"
                      class="w-full h-full"
                      viewBox="0 0 600 750"
                      v-html="item.front_image"
                    ></svg>
                    <User v-else class="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <div class="text-center">
                  <span class="text-[9px] text-slate-400 block mb-1">Side</span>
                  <div class="aspect-[4/5] rounded overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      v-if="item.side_image && (item.side_image.startsWith('data:') || item.side_image.startsWith('http'))"
                      :src="item.side_image"
                      alt="Side"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else-if="item.side_image"
                      class="w-full h-full"
                      viewBox="0 0 600 750"
                      v-html="item.side_image"
                    ></svg>
                    <Compass v-else class="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <div class="text-center">
                  <span class="text-[9px] text-slate-400 block mb-1">Back</span>
                  <div class="aspect-[4/5] rounded overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      v-if="item.back_image && (item.back_image.startsWith('data:') || item.back_image.startsWith('http'))"
                      :src="item.back_image"
                      alt="Back"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else-if="item.back_image"
                      class="w-full h-full"
                      viewBox="0 0 600 750"
                      v-html="item.back_image"
                    ></svg>
                    <Layers v-else class="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                @click="loadSimulation(item)"
                class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1.5 transition"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Load in Simulator</span>
              </button>

              <button
                type="button"
                @click="deleteSimulation(item.id)"
                class="p-1.5 text-slate-500 hover:text-rose-400 transition"
                title="Delete from SQLite"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  BookmarkCheck,
  Bookmark,
  X,
  Loader2,
  User,
  Compass,
  Layers,
  RotateCcw,
  Trash2
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'load-look', item: any): void
}>()

const savedList = ref<any[]>([])
const isLoading = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadSaved()
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadSaved()
  }
})

async function loadSaved() {
  isLoading.value = true
  try {
    const res = await $fetch<{ success: boolean, data: any[] }>('/api/simulations')
    if (res.success && res.data) {
      savedList.value = res.data
    }
  } catch (err) {
    console.error('Failed to load saved simulations', err)
  } finally {
    isLoading.value = false
  }
}

async function deleteSimulation(id: string) {
  if (!confirm('Are you sure you want to delete this simulation?')) return
  try {
    const res = await $fetch<{ success: boolean }>(`/api/simulations/${id}`, {
      method: 'DELETE'
    })
    if (res.success) {
      savedList.value = savedList.value.filter(s => s.id !== id)
    }
  } catch (err) {
    console.error('Failed to delete simulation', err)
  }
}

function loadSimulation(item: any) {
  emit('load-look', item)
  emit('close')
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
</script>
