<template>
  <div class="relative bg-white rounded-3xl p-5 sm:p-6 border border-[#F4F1DE] shadow-2xl space-y-4">
    <!-- Top Live Ticker / Pill Header -->
    <div class="flex items-center justify-between gap-2 text-xs">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Interactive Mirror Preview</span>
      </div>

      <span class="text-[11px] text-[#2B2D42]/60 font-semibold flex items-center gap-1">
        <Sparkles class="w-3.5 h-3.5 text-[#E07A5F]" />
        <span>Drag handle to compare</span>
      </span>
    </div>

    <!-- Interactive Comparison Slider Viewport -->
    <div
      ref="containerRef"
      class="relative aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-[#F4F1DE] shadow-inner touch-none bg-[#2B2D42]"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @click="handleClick"
    >
      <!-- BEFORE IMAGE (Underneath: Natural Brunette Baseline) -->
      <img
        :src="beforeImage"
        alt="Natural Baseline Hair"
        class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      <!-- "Original" Badge (Bottom-Left) -->
      <div class="absolute bottom-3.5 left-3.5 z-10 pointer-events-none">
        <span class="backdrop-blur-md bg-black/40 border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Natural Baseline (Level 4)</span>
        </span>
      </div>

      <!-- AFTER IMAGE (On Top with Dynamic Inset Clip-Path) -->
      <div
        class="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
        :style="{ clipPath: `inset(0 0 0 ${sliderPos}%)` }"
      >
        <img
          :src="afterImage"
          alt="AuraTint Hair Simulation"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- "AuraTint Simulation" Badge (Bottom-Right) -->
        <div class="absolute bottom-3.5 right-3.5 z-10 pointer-events-none">
          <span class="backdrop-blur-md bg-white/30 border border-white/30 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#F4A261] animate-pulse"></span>
            <span>AuraTint Simulation</span>
            <span class="font-mono text-[10px] bg-[#E07A5F] px-1.5 py-0.5 rounded text-white">#B8491A</span>
          </span>
        </div>
      </div>

      <!-- Vertical Divider Line & Draggable Handle -->
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_12px_rgba(224,122,95,0.7)] pointer-events-none transition-transform"
        :style="{ left: `${sliderPos}%` }"
      >
        <!-- Center Handle Circle -->
        <div
          class="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] border-2 border-white flex items-center justify-center text-white shadow-xl pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform"
          @mousedown.stop="startDrag"
          @touchstart.stop="startDrag"
        >
          <ChevronsLeftRight class="w-4 h-4 text-white drop-shadow" />
        </div>
      </div>
    </div>

    <!-- Scientific Metrics Grid -->
    <div class="grid grid-cols-3 gap-2.5 text-center text-xs">
      <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
        <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase tracking-wider">Complexion</span>
        <span class="font-bold text-[#E07A5F] text-xs">Warm Golden</span>
      </div>
      <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
        <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase tracking-wider">Luminosity</span>
        <span class="font-bold text-[#2B2D42] text-xs">CIELAB High Specular</span>
      </div>
      <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
        <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase tracking-wider">Dispensary Mix</span>
        <span class="font-bold text-[#F4A261] text-xs">20 Vol + 60g 7.43</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Sparkles, ChevronsLeftRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    beforeImage?: string
    afterImage?: string
  }>(),
  {
    beforeImage: '/models/woman_brunette.jpg',
    afterImage: '/models/woman_brunette_copper_after.jpg'
  }
)

const sliderPos = ref(50) // Initial slider position: 50%
const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function updateSlider(clientX: number) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const offsetX = clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
  sliderPos.value = Math.round(percentage * 10) / 10
}

function handleClick(e: MouseEvent) {
  updateSlider(e.clientX)
}

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  updateSlider(clientX)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  updateSlider(e.clientX)
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  updateSlider(e.touches[0].clientX)
}

function stopDrag() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', stopDrag)
})
</script>
