<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
    <div class="relative w-full max-w-4xl max-h-[85vh] bg-white border border-[#F4F1DE] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#2B2D42]">
      
      <!-- Modal Header -->
      <div class="p-6 border-b border-[#F4F1DE] flex items-center justify-between bg-[#FDFBF7]">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
            <BookmarkCheck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-[#2B2D42]">Saved Hair Color Journey</h3>
            <p class="text-xs text-[#2B2D42]/60 mt-0.5">Your simulated hairstyles and salon chemistry recipes</p>
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

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center text-[#2B2D42]/60 space-y-2">
          <Loader2 class="w-8 h-8 animate-spin text-[#E07A5F]" />
          <p class="text-xs font-semibold">Loading saved looks from database...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="savedList.length === 0" class="py-16 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-[#FDFBF7] border border-[#F4F1DE] flex items-center justify-center text-[#E07A5F] mb-3 shadow-sm">
            <Bookmark class="w-8 h-8" />
          </div>
          <h4 class="text-base font-bold text-[#2B2D42]">No Saved Looks Yet</h4>
          <p class="text-xs text-[#2B2D42]/60 max-w-sm mt-1 mb-5">
            Simulate any hair color formulation, then click "Save Formula" to archive it here.
          </p>
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-2.5 text-xs shadow-md hover:opacity-95 transition-all"
          >
            Start Hair Simulation
          </button>
        </div>

        <!-- Grid of Saved Simulations -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="item in savedList"
            :key="item.id"
            class="bg-[#FDFBF7] border border-[#F4F1DE] rounded-2xl p-4 flex flex-col justify-between hover:border-[#E07A5F]/40 transition shadow-sm"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold text-[#2B2D42] line-clamp-1">{{ item.title }}</span>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    class="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    :style="{ backgroundColor: item.color_hex }"
                  ></span>
                  <span class="text-[11px] font-mono text-[#2B2D42]/60">{{ item.color_hex }}</span>
                </div>
              </div>

              <!-- Metadata pills -->
              <div class="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                <span class="px-2.5 py-0.5 rounded-full bg-white border border-[#F4F1DE] text-[#E07A5F] font-bold">
                  {{ item.hair_style_name }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-white border border-[#F4F1DE] text-[#2B2D42]/80 font-medium">
                  Base L{{ item.base_hair_level }} → Target L{{ item.target_hair_level }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-white border border-[#F4F1DE] text-[#2B2D42]/50">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <!-- Snapshot Preview -->
              <div class="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#F4F1DE] mb-3 flex items-center justify-center">
                <img
                  v-if="item.front_image && (item.front_image.startsWith('data:') || item.front_image.startsWith('http'))"
                  :src="item.front_image"
                  alt="Snapshot"
                  class="w-full h-full object-cover"
                />
                <User v-else class="w-6 h-6 text-[#2B2D42]/30" />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-2 border-t border-[#F4F1DE] text-xs">
              <button
                type="button"
                @click="loadLook(item)"
                class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E07A5F] hover:text-white text-[#2B2D42] font-semibold border border-[#F4F1DE] hover:border-transparent transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Load in Simulator</span>
              </button>

              <button
                type="button"
                @click="deleteItem(item.id)"
                class="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition"
                title="Delete Look"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-[#FDFBF7] border-t border-[#F4F1DE] flex items-center justify-between text-xs text-[#2B2D42]/60">
        <span>Stored securely in PostgreSQL / SQLite</span>
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-white hover:bg-[#F4F1DE] text-[#2B2D42] rounded-xl border border-[#F4F1DE] font-semibold transition"
        >
          Close Gallery
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  BookmarkCheck,
  X,
  Loader2,
  Bookmark,
  Trash2,
  User
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'load-look', item: any): void
}>()

const isLoading = ref(false)
const savedList = ref<any[]>([])

watch(() => props.isOpen, (open) => {
  if (open) {
    fetchSaved()
  }
})

async function fetchSaved() {
  isLoading.value = true
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>('/api/simulations')
    if (res.success && res.data) {
      savedList.value = res.data
    }
  } catch (err) {
    console.error('Failed to fetch simulations', err)
  } finally {
    isLoading.value = false
  }
}

async function deleteItem(id: string) {
  try {
    await $fetch(`/api/simulations/${id}`, { method: 'DELETE' })
    savedList.value = savedList.value.filter((it) => it.id !== id)
  } catch (err) {
    console.error('Failed to delete item', err)
  }
}

function loadLook(item: any) {
  emit('load-look', item)
  emit('close')
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
