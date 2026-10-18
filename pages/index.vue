<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2B2D42] font-sans flex flex-col selection:bg-[#F4A261] selection:text-[#2B2D42]">
    
    <!-- TOP NAVIGATION -->
    <header class="border-b border-[#F4F1DE] bg-[#FDFBF7]/90 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] p-0.5 shadow-md">
            <div class="w-full h-full bg-[#FDFBF7] rounded-[14px] flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-[#E07A5F]" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold tracking-tight text-[#2B2D42]">
                AuraHair
              </span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                Chromastand AI
              </span>
            </div>
            <p class="text-[11px] text-[#2B2D42]/60 hidden sm:block">Precision Hair Simulation & Salon Chemistry Formulation</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-[#2B2D42]/70">
          <a href="#features" class="hover:text-[#E07A5F] transition">Features & Science</a>
          <a href="#how-it-works" class="hover:text-[#E07A5F] transition">How It Works</a>
          <button
            type="button"
            @click="isAiModalOpen = true"
            class="hover:text-[#E07A5F] transition flex items-center gap-1.5"
          >
            <Bot class="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>AI Stylist Modal</span>
          </button>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            @click="isGalleryOpen = true"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] flex items-center gap-2 shadow-sm transition"
          >
            <BookmarkCheck class="w-4 h-4 text-[#E07A5F]" />
            <span class="hidden sm:inline">Saved Formulas</span>
            <span
              v-if="savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E07A5F]/15 text-[#E07A5F] font-mono font-bold"
            >
              {{ savedCount }}
            </span>
          </button>

          <button
            type="button"
            @click="scrollToSimulator"
            class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-5 py-2.5 text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Start Simulation</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>

    <!-- HERO SECTION (LANDING PAGE) -->
    <section class="relative overflow-hidden py-16 md:py-24 border-b border-[#F4F1DE] bg-gradient-to-b from-[#FDFBF7] via-[#F4F1DE]/30 to-[#FDFBF7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Hero Copy -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#F4F1DE] shadow-sm text-xs font-bold text-[#E07A5F]">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Google Gemini 2.5 Multimodal Chromatic Vision</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2B2D42] leading-[1.15]">
            Simulate Hair Color with <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#F4A261]">Salon Physics</span>, Not Generic Filters.
          </h1>

          <p class="text-sm sm:text-base text-[#2B2D42]/70 max-w-xl leading-relaxed">
            AuraHair combines Google Gemini 2.5 multimodal reasoning with CIELAB melanin retention. It isolates your facial undertones, preserves natural specular highlights, and calculates real dispensary chemical formulas (developer volumes, bleach thresholds, and dye grams).
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <!-- Requested Button Style -->
            <button
              type="button"
              @click="scrollToSimulator"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span>Start Hair Simulation</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <a
              href="#features"
              class="px-5 py-3 rounded-xl bg-white hover:bg-[#F4F1DE] text-[#2B2D42] text-sm font-semibold border border-[#F4F1DE] shadow-sm transition"
            >
              Explore Hair Science &rarr;
            </a>
          </div>

          <!-- Trust & Technology Badges -->
          <div class="pt-6 border-t border-[#F4F1DE] flex flex-wrap items-center gap-6 text-xs text-[#2B2D42]/60 font-semibold">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600" />
              <span>Face & Skin Mask Protection</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600" />
              <span>CIELAB L*a*b* Highlight Retention</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600" />
              <span>Real Salon Mixing Grams</span>
            </div>
          </div>
        </div>

        <!-- Right Hero Visual Card -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4F1DE] shadow-2xl space-y-4 relative">
            <!-- Floating Pill -->
            <div class="absolute -top-3.5 right-6 bg-[#2B2D42] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Colorist Engine</span>
            </div>

            <!-- Before/After Split Card Preview -->
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#2B2D42] border border-[#F4F1DE] shadow-inner">
              <img
                src="/models/woman_brunette.jpg"
                alt="Model Baseline"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div class="w-full flex items-center justify-between text-white">
                  <div>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-[#F4A261] block">Curated Transformation</span>
                    <h4 class="text-sm font-bold">Fiery Irish Copper Balayage</h4>
                  </div>
                  <span class="text-xs font-mono font-bold bg-[#E07A5F] px-2.5 py-1 rounded-lg">#B8491A</span>
                </div>
              </div>
            </div>

            <!-- Hero Metrics Grid -->
            <div class="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
                <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase">Skin Undertone</span>
                <span class="font-bold text-[#E07A5F] text-xs">Warm Golden</span>
              </div>
              <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
                <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase">Lift Required</span>
                <span class="font-bold text-[#2B2D42] text-xs">+3 Levels</span>
              </div>
              <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
                <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase">Dispensary Mix</span>
                <span class="font-bold text-[#F4A261] text-xs">20 Vol Developer</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- CORE FEATURES SECTION -->
    <section id="features" class="py-20 border-b border-[#F4F1DE] bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-1 rounded-full">
            Engineering Excellence
          </span>
          <h2 class="text-3xl font-extrabold text-[#2B2D42] tracking-tight">
            How AuraHair Solves Real Salon Challenges
          </h2>
          <p class="text-sm text-[#2B2D42]/70 leading-relaxed">
            Generic virtual makeover filters overlay semi-transparent colors that flatten hair highlights and shift skin tones. AuraHair treats hair simulation as physical color chemistry.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Eye class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Multimodal Chromatic Reasoning</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Gemini 2.5 extracts calibrated L*a*b* coordinates for facial dermis and iris warmth, mapping them directly to color theory principles (analogous, complementary, and contrast).
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/30 flex items-center justify-center text-[#F4A261]">
              <Sparkles class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Melanin-Preserving CIELAB</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Transforms hair in perceptual CIELAB color space. Luminosity channels ($L^*$) retain natural specular highlights, cuticle reflections, and root shadows without muddying.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Beaker class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Salon Dispensary Physics</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Every target shade calculates required lift levels, checks bleaching necessity, and generates exact gram recipes for color tubes, developer volume, and processing times.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#2B2D42]/10 border border-[#2B2D42]/20 flex items-center justify-center text-[#2B2D42]">
              <FileDown class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Consultation Card & Share</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Export professional client consultation cards directly to printable PDF, or share the chemical formulation recipe directly to WhatsApp or Email with one tap.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section id="how-it-works" class="py-16 border-b border-[#F4F1DE] bg-[#FDFBF7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F]">Workflow</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#2B2D42] tracking-tight">
            Step-by-Step Precision Hair Simulation
          </h2>
          <p class="text-xs sm:text-sm text-[#2B2D42]/70">
            From selfie portrait to dispensary-ready chemical recipe in 4 seamless steps
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">01</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Upload or Capture Selfie</h4>
            <p class="text-xs text-[#2B2D42]/70">Use webcam with live lighting feedback, upload photo, or pick studio models.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm">
            <span class="text-2xl font-black text-[#F4A261]/40 font-mono block mb-2">02</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Pick Color or AI Advice</h4>
            <p class="text-xs text-[#2B2D42]/70">Review Gemini chromatic harmonies for your undertone, or customize shade & technique.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">03</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Realistic Preview</h4>
            <p class="text-xs text-[#2B2D42]/70">Inspect results with side-by-side comparison and before/after interactive wipe slider.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm">
            <span class="text-2xl font-black text-[#2B2D42]/30 font-mono block mb-2">04</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Formulate & Share</h4>
            <p class="text-xs text-[#2B2D42]/70">Review chemical grams, download PDF consultation sheet, or share to WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STEP-BY-STEP INTERACTIVE SIMULATOR WORKSPACE -->
    <section id="simulation-workspace" class="py-12 flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        <!-- Stepper Navigation -->
        <div class="bg-white p-3 rounded-2xl border border-[#F4F1DE] shadow-sm">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <!-- Step 1 -->
            <button
              type="button"
              @click="currentStep = 1"
              class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
              :class="currentStep === 1 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                :class="currentStep === 1 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
              >
                1
              </div>
              <div class="overflow-hidden">
                <span class="text-xs font-bold block truncate">1. Selfie & Base</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">Auto-read Level {{ currentBaseLevel }}</span>
              </div>
            </button>

            <!-- Step 2 -->
            <button
              type="button"
              @click="currentStep = 2"
              class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
              :class="currentStep === 2 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                :class="currentStep === 2 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
              >
                2
              </div>
              <div class="overflow-hidden">
                <span class="text-xs font-bold block truncate">2. Target Color</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">{{ currentColorName }}</span>
              </div>
            </button>

            <!-- Step 3 -->
            <button
              type="button"
              @click="currentStep = 3"
              class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
              :class="currentStep === 3 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                :class="currentStep === 3 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
              >
                3
              </div>
              <div class="overflow-hidden">
                <span class="text-xs font-bold block truncate">3. Side-by-Side</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">Before / After Preview</span>
              </div>
            </button>

            <!-- Step 4 -->
            <button
              type="button"
              @click="currentStep = 4"
              class="flex items-center gap-3 p-3 rounded-xl border text-left transition"
              :class="currentStep === 4 ? 'border-[#E07A5F] bg-[#E07A5F]/10 text-[#2B2D42]' : 'border-transparent hover:bg-[#FDFBF7] text-[#2B2D42]/60'"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                :class="currentStep === 4 ? 'bg-[#E07A5F] text-white shadow-sm' : 'bg-[#F4F1DE] text-[#2B2D42]'"
              >
                4
              </div>
              <div class="overflow-hidden">
                <span class="text-xs font-bold block truncate">4. Formula & Share</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">PDF & WhatsApp</span>
              </div>
            </button>
          </div>
        </div>

        <!-- STEP 1: PHOTO INPUT & BASE CANVAS -->
        <div v-show="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div class="md:col-span-6">
              <CameraCapture
                @photo-selected="handlePhotoSelected"
              />
            </div>

            <div class="md:col-span-6 space-y-4">
              <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl space-y-5">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
                    <User class="w-6 h-6" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-[#2B2D42]">Step 1: Your Natural Canvas</h3>
                    <p class="text-xs text-[#2B2D42]/60 mt-0.5">The engine isolates hair pixels while strictly protecting facial skin</p>
                  </div>
                </div>

                <!-- Detected Base Info -->
                <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-3.5">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-[#2B2D42]">Detected Hair Level:</span>
                    <span class="text-xs font-bold text-[#E07A5F]">Level {{ currentBaseLevel }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-[#2B2D42]/70">
                    <span>Dominant Tone:</span>
                    <span class="font-semibold text-[#2B2D42]">{{ currentHairTone }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Facial skin, eyes, and background are protected from dye tint.</span>
                  </div>
                </div>

                <!-- Step Navigation Action -->
                <div class="pt-2 flex justify-end">
                  <button
                    type="button"
                    @click="currentStep = 2"
                    class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95"
                  >
                    <span>Next: Target Color & Recommendations &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- GEMINI CHROMATIC INTELLIGENCE & COLOR THEORY CARD -->
          <ChromaticColorTheoryCard
            :user-photo="currentPhoto"
            :current-hair-level="currentBaseLevel"
            @apply-color="handleApplyRecommendedColor"
          />
        </div>

        <!-- STEP 2: CHOOSE TARGET COLOR OR VIEW RECOMMENDATIONS -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7">
              <HairColorMixer
                :initial-color-hex="currentColorHex"
                @color-change="handleColorChange"
              />
            </div>

            <div class="lg:col-span-5 space-y-4">
              <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4F1DE] shadow-xl space-y-5">
                <h3 class="text-lg font-bold text-[#2B2D42] flex items-center gap-2">
                  <Sparkles class="w-5 h-5 text-[#F4A261]" />
                  <span>Selected Formulation</span>
                </h3>

                <div class="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F4F1DE] space-y-4">
                  <div class="flex items-center gap-3.5">
                    <div
                      class="w-12 h-12 rounded-2xl border border-black/10 shadow-md flex-shrink-0"
                      :style="{ backgroundColor: currentColorHex }"
                    ></div>
                    <div>
                      <h4 class="text-sm font-bold text-[#2B2D42]">{{ currentColorName }}</h4>
                      <p class="text-xs font-mono text-[#2B2D42]/60 mt-0.5">{{ currentColorHex }} &bull; {{ currentColorTechnique }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#F4F1DE] text-xs">
                    <div>
                      <span class="text-[#2B2D42]/50 block text-[10px] font-bold uppercase">Gloss / Shine</span>
                      <span class="font-bold text-[#F4A261]">{{ currentGloss }}% Mirror</span>
                    </div>
                    <div>
                      <span class="text-[#2B2D42]/50 block text-[10px] font-bold uppercase">Root Shadow</span>
                      <span class="font-bold text-[#E07A5F]">{{ currentRootDepth }}% Blend</span>
                    </div>
                  </div>
                </div>

                <!-- Navigation -->
                <div class="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    @click="currentStep = 1"
                    class="px-4 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
                  >
                    &larr; Back to Photo
                  </button>
                  <button
                    type="button"
                    @click="currentStep = 3"
                    class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95"
                  >
                    <span>Next: View Result &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: REALISTIC RESULT PREVIEW (SIDE-BY-SIDE) -->
        <div v-show="currentStep === 3" class="space-y-6">
          <HairSimulatorCanvas
            ref="simulatorRef"
            :user-photo="currentPhoto"
            :color-hex="currentColorHex"
            :color-name="currentColorName"
            :color-family="currentColorFamily"
            :secondary-hex="currentSecondaryHex"
            :color-type="currentColorTechnique"
            :gloss="currentGloss"
            :root-darkness="currentRootDepth"
            :current-level-override="levelOverride"
            @processed="handleProcessed"
          />

          <div class="flex items-center justify-between pt-2">
            <button
              type="button"
              @click="currentStep = 2"
              class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
            >
              &larr; Adjust Color
            </button>
            <button
              type="button"
              @click="currentStep = 4"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all text-xs flex items-center gap-2 active:scale-95"
            >
              <span>Next: Formula, PDF & Share &rarr;</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: SALON CHEMICAL FORMULATION & EXPORT -->
        <div v-show="currentStep === 4" class="space-y-6">
          <SalonFormulaCard
            :target-hex="currentColorHex"
            :color-name="currentColorName"
            :color-family="currentColorFamily"
            :user-photo="currentPhoto"
            :formula="processResult?.formula ?? null"
            :detected-level="processResult?.currentColor.level"
            :get-transformed-snapshot="getTransformedSnapshot"
            @override-level="levelOverride = $event"
            @simulation-saved="handleSimulationSaved"
          />

          <div class="flex items-center justify-between pt-2">
            <button
              type="button"
              @click="currentStep = 3"
              class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2B2D42] rounded-xl text-xs font-semibold border border-[#F4F1DE] transition"
            >
              &larr; Back to Side-by-Side Preview
            </button>
            <button
              type="button"
              @click="currentStep = 1"
              class="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#E07A5F] rounded-xl text-xs font-bold border border-[#F4F1DE] transition"
            >
              Try Another Selfie
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-[#F4F1DE] bg-white py-10 text-xs text-[#2B2D42]/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-medium">AuraHair Chromastand AI &bull; Google Cloud Run &bull; Gemini 2.5 Flash / Pro &bull; PostgreSQL</span>
        </div>
        <p>&copy; 2026 Cipher Team. All rights reserved &bull; AuraHair Chromastand AI.</p>
      </div>
    </footer>

    <!-- GEMINI 2.5 AI COLORIST MODAL -->
    <GeminiStylistModal
      :is-open="isAiModalOpen"
      :user-photo="currentPhoto"
      :current-hair-level="currentBaseLevel"
      @close="isAiModalOpen = false"
      @apply-style="handleApplyAiStyle"
      @apply-color="handleApplyAiColor"
    />

    <!-- SAVED GALLERY MODAL -->
    <SavedGalleryModal
      :is-open="isGalleryOpen"
      @close="isGalleryOpen = false"
      @load-look="handleLoadLook"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Sparkles,
  BookmarkCheck,
  Bot,
  User,
  CheckCircle,
  Eye,
  Beaker,
  FileDown,
  ArrowRight
} from 'lucide-vue-next'
import { SAMPLE_MODELS } from '~/utils/sampleModels'
import type { HairProcessResult } from '~/components/HairSimulatorCanvas.vue'

const currentStep = ref(1) // Step 1, 2, 3, or 4
const isGalleryOpen = ref(false)
const isAiModalOpen = ref(false)
const savedCount = ref(0)
const simulatorRef = ref<any>(null)

// Current Working State
const currentPhoto = ref<string>(SAMPLE_MODELS[0].imageUrl)
const currentBaseLevel = ref<number>(4)
const currentHairTone = ref<string>('Reading hair...')
const processResult = ref<HairProcessResult | null>(null)
const levelOverride = ref<number | null>(null)

const currentColorHex = ref('#B8491A')
const currentColorName = ref('Fiery Irish Copper')
const currentColorFamily = ref('copper')
const currentSecondaryHex = ref('#D1AC61')
const currentColorTechnique = ref<'solid' | 'balayage' | 'ombre' | 'highlights'>('balayage')
const currentGloss = ref(75)
const currentRootDepth = ref(25)

onMounted(async () => {
  await fetchSavedCount()
})

function scrollToSimulator() {
  currentStep.value = 1
  const el = document.getElementById('simulation-workspace')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

async function fetchSavedCount() {
  try {
    const res = await $fetch<{ success: boolean, data: any[] }>('/api/simulations')
    if (res.success && res.data) {
      savedCount.value = res.data.length
    }
  } catch (err) {
    // Ignore error on first boot
  }
}

function handlePhotoSelected(photoUrl: string) {
  currentPhoto.value = photoUrl
  levelOverride.value = null
  processResult.value = null
}

function handleColorChange(data: {
  colorHex: string
  colorName: string
  colorFamily: string
  secondaryHex: string
  technique: 'solid' | 'balayage' | 'ombre' | 'highlights'
  gloss: number
  rootDepth: number
}) {
  currentColorHex.value = data.colorHex
  currentColorName.value = data.colorName
  currentColorFamily.value = data.colorFamily
  currentSecondaryHex.value = data.secondaryHex
  currentColorTechnique.value = data.technique
  currentGloss.value = data.gloss
  currentRootDepth.value = data.rootDepth
}

function getTransformedSnapshot() {
  return simulatorRef.value?.getTransformedDataUrl ? simulatorRef.value.getTransformedDataUrl() : ''
}

function handleSimulationSaved(id: string) {
  savedCount.value++
}

function handleLoadLook(item: any) {
  if (item.user_photo) currentPhoto.value = item.user_photo
  currentColorHex.value = item.color_hex
  currentColorName.value = item.color_name
  currentColorFamily.value = item.color_family || 'natural'
  if (item.secondary_color_hex) currentSecondaryHex.value = item.secondary_color_hex
  currentStep.value = 3
  scrollToSimulator()
}

function handleApplyAiStyle(styleId: string, styleName: string) {
  // Focus on color
}

function handleApplyAiColor(colorHex: string, colorName: string, colorFamily: string) {
  currentColorHex.value = colorHex
  currentColorName.value = colorName
  currentColorFamily.value = colorFamily
  currentStep.value = 3 // Jump directly to preview
  scrollToSimulator()
}

function handleApplyRecommendedColor(colorHex: string, colorName: string, colorFamily: string) {
  currentColorHex.value = colorHex
  currentColorName.value = colorName
  currentColorFamily.value = colorFamily
  currentStep.value = 3 // Jump directly to side-by-side preview
  scrollToSimulator()
}

function handleProcessed(data: HairProcessResult) {
  processResult.value = data
  currentBaseLevel.value = data.currentColor.level
  currentHairTone.value = `${data.currentColor.levelName} · ${data.currentColor.undertone}`
}
</script>
