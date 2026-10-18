<template>
  <div class="bg-white rounded-3xl p-6 border border-[#F4F1DE] shadow-xl text-[#2B2D42]">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#F4F1DE] pb-4">
      <div>
        <h3 class="text-lg font-bold text-[#2B2D42] flex items-center gap-2">
          <Camera class="w-5 h-5 text-[#E07A5F]" />
          <span>Selfie Capture & Studio Models</span>
        </h3>
        <p class="text-xs text-[#2B2D42]/60 mt-0.5">Capture your selfie, upload a photo, or choose a studio model</p>
      </div>

      <!-- Mode Selector -->
      <div class="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#F4F1DE] text-xs">
        <button
          type="button"
          @click="activeMode = 'webcam'"
          :class="activeMode === 'webcam' ? 'bg-[#E07A5F] text-white font-semibold shadow-sm' : 'text-[#2B2D42]/70 hover:text-[#2B2D42]'"
          class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <Camera class="w-3.5 h-3.5" />
          <span>Webcam</span>
        </button>
        <button
          type="button"
          @click="activeMode = 'upload'"
          :class="activeMode === 'upload' ? 'bg-[#E07A5F] text-white font-semibold shadow-sm' : 'text-[#2B2D42]/70 hover:text-[#2B2D42]'"
          class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <UploadCloud class="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          @click="activeMode = 'samples'"
          :class="activeMode === 'samples' ? 'bg-[#E07A5F] text-white font-semibold shadow-sm' : 'text-[#2B2D42]/70 hover:text-[#2B2D42]'"
          class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <Users class="w-3.5 h-3.5" />
          <span>Models</span>
        </button>
      </div>
    </div>

    <!-- Active Mode Container -->
    <div class="relative rounded-2xl overflow-hidden bg-[#2B2D42] border border-[#F4F1DE] aspect-[4/5] max-h-[380px] flex items-center justify-center shadow-inner">
      
      <!-- 1. WEBCAM MODE -->
      <div v-if="activeMode === 'webcam'" class="w-full h-full relative flex items-center justify-center">
        <!-- Live Video Element -->
        <video
          ref="videoEl"
          autoplay
          playsinline
          muted
          :class="['w-full h-full object-cover', facingMode === 'user' ? '-scale-x-100' : '']"
          v-show="isStreaming && !capturedPhoto"
        ></video>

        <!-- Display Captured Photo -->
        <img
          v-if="capturedPhoto && !isStreaming"
          :src="capturedPhoto"
          alt="Captured Selfie"
          :class="['w-full h-full object-cover', facingMode === 'user' ? '-scale-x-100' : '']"
        />

        <!-- Live Lighting Quality Badge -->
        <div
          v-if="isStreaming && !capturedPhoto"
          class="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none"
        >
          <div
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md shadow"
            :class="lightingBadgeClass"
          >
            <span class="w-2 h-2 rounded-full animate-pulse" :class="lightingDotClass"></span>
            <span>{{ lightingStatusText }}</span>
          </div>

          <button
            type="button"
            @click.stop="toggleCameraFacing"
            class="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow"
            title="Flip Camera"
          >
            <RefreshCw class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Face Alignment Guide Overlay (Shown during live video) -->
        <div
          v-if="isStreaming && !capturedPhoto"
          class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
        >
          <div class="relative w-56 h-72 border-2 border-dashed border-[#F4A261] rounded-[50%] shadow-[0_0_25px_rgba(244,162,97,0.35)] flex items-center justify-center">
            <div class="w-3 h-0.5 bg-[#F4A261]/60 absolute"></div>
            <div class="h-3 w-0.5 bg-[#F4A261]/60 absolute"></div>
            <span class="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-black/80 text-[#F4A261] border border-[#F4A261]/40 backdrop-blur-md -mt-2 shadow">
              Oval Face Target
            </span>
          </div>
          <p class="text-[10px] text-white bg-black/70 px-3 py-1 rounded-full mt-3 backdrop-blur-md border border-white/20 shadow">
            Center your face with even front lighting
          </p>
        </div>

        <!-- Countdown Overlay -->
        <div
          v-if="countdown > 0"
          class="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-20"
        >
          <span class="text-7xl font-bold text-[#F4A261] animate-ping">{{ countdown }}</span>
        </div>

        <!-- Camera Controls Overlay -->
        <div class="absolute bottom-3.5 inset-x-0 flex items-center justify-center gap-3 z-10 px-4">
          <template v-if="isStreaming && !capturedPhoto">
            <button
              type="button"
              @click="startCountdownCapture"
              :disabled="countdown > 0"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-2.5 shadow-md hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
            >
              <Aperture class="w-4 h-4" />
              <span>Capture Portrait</span>
            </button>
            <button
              type="button"
              @click="stopCamera"
              class="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow"
              title="Stop Camera"
            >
              <PowerOff class="w-4 h-4" />
            </button>
          </template>

          <template v-else-if="capturedPhoto">
            <button
              type="button"
              @click="retakePhoto"
              class="px-4 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition shadow"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
            <span class="text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shadow">
              <Check class="w-3.5 h-3.5 text-emerald-600" />
              <span>Portrait Locked</span>
            </span>
          </template>

          <template v-else>
            <button
              type="button"
              @click="startCamera"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Camera class="w-4 h-4" />
              <span>Open Studio Webcam</span>
            </button>
          </template>
        </div>

        <!-- Camera Error Notice -->
        <div v-if="cameraError" class="absolute inset-0 bg-[#2B2D42]/95 p-5 flex flex-col items-center justify-center text-center text-white">
          <AlertCircle class="w-8 h-8 text-[#F4A261] mb-2" />
          <p class="text-sm font-bold mb-1">{{ cameraError }}</p>
          <p class="text-xs text-white/70 mb-3">You can also upload a photo or select one of our studio models below</p>
          <button
            type="button"
            @click="activeMode = 'samples'"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-[#F4A261] font-semibold border border-[#F4A261]/40"
          >
            Switch to Studio Models
          </button>
        </div>
      </div>

      <!-- 2. UPLOAD MODE -->
      <div
        v-else-if="activeMode === 'upload'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        class="w-full h-full p-6 flex flex-col items-center justify-center text-center cursor-pointer transition relative bg-[#FDFBF7]"
        :class="isDragging ? 'bg-[#E07A5F]/10 border-2 border-dashed border-[#E07A5F]' : ''"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputEl"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />

        <div v-if="uploadedPreview" class="w-full h-full relative">
          <img :src="uploadedPreview" alt="Uploaded Portrait" class="w-full h-full object-cover rounded-xl" />
          <div class="absolute bottom-3 inset-x-3 flex justify-between items-center bg-white/90 backdrop-blur-md p-2.5 rounded-xl text-xs shadow-md border border-[#F4F1DE]">
            <span class="text-emerald-700 font-bold flex items-center gap-1.5">
              <Check class="w-4 h-4 text-emerald-600" /> Photo Loaded
            </span>
            <button
              type="button"
              @click.stop="triggerFileInput"
              class="text-[#E07A5F] hover:underline font-semibold text-xs"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/30 flex items-center justify-center text-[#E07A5F]">
            <UploadCloud class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-bold text-[#2B2D42]">Drag & drop your portrait here</p>
            <p class="text-xs text-[#2B2D42]/60 mt-1">Supports PNG, JPG, WEBP (front-facing selfie works best)</p>
          </div>
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-white hover:bg-[#FDFBF7] text-xs font-semibold text-[#2B2D42] border border-[#F4F1DE] shadow-sm"
          >
            Browse Computer
          </button>
        </div>
      </div>

      <!-- 3. STUDIO MODELS MODE -->
      <div v-else-if="activeMode === 'samples'" class="w-full h-full p-3.5 flex flex-col justify-between bg-[#FDFBF7]">
        <div class="relative w-full h-[70%] rounded-xl overflow-hidden bg-[#2B2D42] border border-[#F4F1DE] shadow-sm">
          <img :src="selectedModel?.imageUrl" :alt="selectedModel?.name" class="w-full h-full object-cover" />
          <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#E07A5F] border border-[#F4F1DE] shadow-sm">
            {{ selectedModel?.name }}
          </div>
          <div class="absolute bottom-2 inset-x-2 bg-white/90 backdrop-blur-md p-2 rounded-lg text-[11px] text-[#2B2D42] border border-[#F4F1DE] shadow-sm font-medium">
            {{ selectedModel?.description }}
          </div>
        </div>

        <!-- Model Picker Thumbnails -->
        <div class="grid grid-cols-4 gap-2 pt-2">
          <button
            v-for="model in sampleModels"
            :key="model.id"
            type="button"
            @click="chooseModel(model)"
            class="p-1 rounded-xl border text-left transition flex flex-col items-center gap-1 shadow-sm"
            :class="selectedModel?.id === model.id ? 'border-[#E07A5F] bg-white ring-2 ring-[#E07A5F]/30' : 'border-[#F4F1DE] bg-white hover:border-[#E07A5F]/40'"
          >
            <div class="w-8 h-8 rounded-full overflow-hidden border border-[#F4F1DE]">
              <img :src="model.imageUrl" :alt="model.name" class="w-full h-full object-cover" />
            </div>
            <span class="text-[10px] font-bold text-[#2B2D42] truncate w-full text-center">
              {{ model.name.split(' ')[0] }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Camera,
  UploadCloud,
  Users,
  Aperture,
  PowerOff,
  RotateCcw,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-vue-next'
import { SAMPLE_MODELS, type SampleModel } from '~/utils/sampleModels'

const emit = defineEmits<{
  (e: 'photo-selected', photoUrl: string, baseLevel?: number, skinTone?: string): void
}>()

const activeMode = ref<'webcam' | 'upload' | 'samples'>('samples')
const videoEl = ref<HTMLVideoElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)

const isStreaming = ref(false)
const capturedPhoto = ref<string | null>(null)
const uploadedPreview = ref<string | null>(null)
const isDragging = ref(false)
const countdown = ref(0)
const cameraError = ref<string | null>(null)

// Camera controls & lighting feedback
const facingMode = ref<'user' | 'environment'>('user')
const averageLuminance = ref<number>(140) // 0 - 255
let lightCheckTimer: any = null
let mediaStream: MediaStream | null = null

const lightingStatusText = computed(() => {
  if (averageLuminance.value < 85) return 'Lighting: Low (Move Closer to Light)'
  if (averageLuminance.value > 215) return 'Lighting: Glare (Diffuse Direct Sun)'
  return 'Lighting: Studio Grade (Ideal)'
})

const lightingBadgeClass = computed(() => {
  if (averageLuminance.value < 85) return 'bg-amber-950/80 text-amber-300 border border-amber-800'
  if (averageLuminance.value > 215) return 'bg-amber-950/80 text-amber-300 border border-amber-800'
  return 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
})

const lightingDotClass = computed(() => {
  if (averageLuminance.value < 85 || averageLuminance.value > 215) return 'bg-amber-400'
  return 'bg-emerald-400'
})

const sampleModels = SAMPLE_MODELS
const selectedModel = ref<SampleModel>(SAMPLE_MODELS[0])

onMounted(() => {
  // Emit initial default model
  if (selectedModel.value) {
    emit('photo-selected', selectedModel.value.imageUrl, selectedModel.value.initialHairLevel, selectedModel.value.skinTone)
  }
})

onBeforeUnmount(() => {
  stopCamera()
})

async function startCamera() {
  cameraError.value = null
  stopCamera() // Clear any existing track
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 960 },
        facingMode: facingMode.value
      },
      audio: false
    })

    if (videoEl.value) {
      videoEl.value.srcObject = mediaStream
      isStreaming.value = true
      capturedPhoto.value = null
      startLightingMonitor()
    }
  } catch (err: any) {
    cameraError.value = 'Camera access was denied or is unavailable on this device.'
    isStreaming.value = false
  }
}

function stopCamera() {
  stopLightingMonitor()
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
  isStreaming.value = false
}

function toggleCameraFacing() {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
  if (isStreaming.value) {
    startCamera()
  }
}

function startLightingMonitor() {
  stopLightingMonitor()
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  lightCheckTimer = setInterval(() => {
    if (!videoEl.value || !isStreaming.value || !ctx) return
    try {
      ctx.drawImage(videoEl.value, 0, 0, 64, 64)
      const frame = ctx.getImageData(0, 0, 64, 64)
      const data = frame.data
      let totalLuma = 0
      for (let i = 0; i < data.length; i += 4) {
        // ITU-R BT.601 standard luma formula
        totalLuma += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      }
      averageLuminance.value = Math.round(totalLuma / (data.length / 4))
    } catch {
      // Ignore cross-origin frame capture errors
    }
  }, 600)
}

function stopLightingMonitor() {
  if (lightCheckTimer) {
    clearInterval(lightCheckTimer)
    lightCheckTimer = null
  }
}

function startCountdownCapture() {
  countdown.value = 3
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      takePhoto()
    }
  }, 1000)
}

function takePhoto() {
  if (!videoEl.value) return

  const video = videoEl.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth || 800
  canvas.height = video.videoHeight || 1000
  const ctx = canvas.getContext('2d')

  if (ctx) {
    if (facingMode.value === 'user') {
      // Flip horizontally for natural mirror selfie
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    capturedPhoto.value = dataUrl
    stopCamera()
    emit('photo-selected', dataUrl, 3, '#f5cbb0')
  }
}

function retakePhoto() {
  capturedPhoto.value = null
  startCamera()
}

function triggerFileInput() {
  fileInputEl.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    loadFile(target.files[0])
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    loadFile(e.dataTransfer.files[0])
  }
}

function loadFile(file: File) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const res = e.target?.result as string
    uploadedPreview.value = res
    emit('photo-selected', res, 3, '#f5cbb0')
  }
  reader.readAsDataURL(file)
}

function chooseModel(model: SampleModel) {
  selectedModel.value = model
  emit('photo-selected', model.imageUrl, model.initialHairLevel, model.skinTone)
}
</script>
