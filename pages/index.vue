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
          <a href="#features" class="hover:text-[#E07A5F] transition">Why Us vs Filters</a>
          <a href="#how-it-works" class="hover:text-[#E07A5F] transition">How It Works</a>
          <a href="#for-salons" class="hover:text-[#E07A5F] transition">For Salons & Colorists</a>
          <button
            type="button"
            @click="isAiModalOpen = true"
            class="hover:text-[#E07A5F] transition flex items-center gap-1.5"
          >
            <Bot class="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>AI Colorist Chat</span>
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
            <span>Simulate Your Look Now</span>
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
            <span>Powered by Google Gemini 2.5 • Zero Regrets, 100% Predictable Color</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2B2D42] leading-[1.15]">
            Never Walk Out of a Salon Wondering If You Made a <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#F4A261]">Mistake.</span>
          </h1>

          <p class="text-sm sm:text-base text-[#2B2D42]/75 max-w-xl leading-relaxed">
            Stop gambling $250+ and 4 hours in the chair on guesswork. AuraHair combines Google Gemini 2.5 multimodal intelligence with real hair physics—reading your facial undertones and iris chroma to reveal the exact shades that make your features pop, paired with the exact dispensary formula your colorist needs.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <!-- Primary Action Button -->
            <button
              type="button"
              @click="scrollToSimulator"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3 shadow-md hover:opacity-95 transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span>Find My Flawless Shade (Free)</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <a
              href="#features"
              class="px-5 py-3 rounded-xl bg-white hover:bg-[#F4F1DE] text-[#2B2D42] text-sm font-semibold border border-[#F4F1DE] shadow-sm transition"
            >
              Why Filters Fail vs AuraHair &rarr;
            </a>
          </div>

          <!-- Trust & Value Badges -->
          <div class="pt-6 border-t border-[#F4F1DE] flex flex-wrap items-center gap-6 text-xs text-[#2B2D42]/70 font-semibold">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Complexion Harmony</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Real Strand Luster (No Flat AI Plastic)</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Exact Grams & Developer for Stylists</span>
            </div>
          </div>
        </div>

        <!-- Right Hero Visual Card -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4F1DE] shadow-2xl space-y-4 relative">
            <!-- Floating Pill -->
            <div class="absolute -top-3.5 right-6 bg-[#2B2D42] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Colorist Match</span>
            </div>

            <!-- Before/After Split Card Preview -->
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#2B2D42] border border-[#F4F1DE] shadow-inner">
              <img
                src="/models/woman_brunette.jpg"
                alt="Model Baseline"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                <div class="w-full flex items-center justify-between text-white">
                  <div>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-[#F4A261] block">Curated Transformation</span>
                    <h4 class="text-sm font-bold">Fiery Irish Copper Balayage</h4>
                    <span class="text-[11px] text-white/80 block mt-0.5">Harmonizes Warm Golden Undertones</span>
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
                <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase">Safety Lift</span>
                <span class="font-bold text-[#2B2D42] text-xs">+3 Levels Safe</span>
              </div>
              <div class="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F4F1DE]">
                <span class="text-[10px] text-[#2B2D42]/50 font-bold block uppercase">Salon Formula</span>
                <span class="font-bold text-[#F4A261] text-xs">20 Vol + 60g 7.43</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- CORE FEATURES SECTION ("WHY FILTERS FAIL VS HOW AURAHAIR WINS") -->
    <section id="features" class="py-20 border-b border-[#F4F1DE] bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-1 rounded-full">
            The Virtual Makeover Breakthrough
          </span>
          <h2 class="text-3xl font-extrabold text-[#2B2D42] tracking-tight">
            Why Virtual Makeovers Look Fake—And How We Fixed It
          </h2>
          <p class="text-sm text-[#2B2D42]/75 leading-relaxed">
            Most makeover apps smear a flat purple or blonde sticker over your head that flattens highlights and clashes with your skin tone. AuraHair treats hair transformation as pure optical physics and dermis harmony.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Eye class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Colors That Make You Glow, Not Wash You Out</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Google Gemini 2.5 isolates your exact skin undertones (L*a*b*) and iris chroma. We automatically eliminate shades that make you look pale or sickly, surfacing tones that illuminate your face.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/30 flex items-center justify-center text-[#F4A261]">
              <Sparkles class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">See Real Hair Strands, Not Airbrushed Plastic</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Our perceptual CIELAB luminosity engine preserves individual strand depth, natural specular shine, cuticle reflections, and root shadows for hyper-photorealistic fidelity.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Beaker class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Zero Surprises in the Salon Chair</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              No more crossing your fingers. AuraHair computes chemical lifting levels, developer volume (10–40 Vol), bleach requirements, and exact dye tube gram ratios your colorist needs to achieve the look.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="bg-[#FDFBF7] p-6 rounded-3xl border border-[#F4F1DE] space-y-3.5 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#2B2D42]/10 border border-[#2B2D42]/20 flex items-center justify-center text-[#2B2D42]">
              <FileDown class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-[#2B2D42]">Walk In With Confidence, Walk Out In Love</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              No more awkward Pinterest scrolling or miscommunications. Export a complete dispensary work order to PDF or send the exact recipe straight to your stylist’s WhatsApp in one click.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section id="how-it-works" class="py-16 border-b border-[#F4F1DE] bg-[#FDFBF7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F]">Frictionless Experience</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#2B2D42] tracking-tight">
            From Selfie to Salon Perfection in 4 Easy Steps
          </h2>
          <p class="text-xs sm:text-sm text-[#2B2D42]/70">
            No guesswork, no chemical disasters, and zero regret.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">01</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Snap or Upload Your Canvas</h4>
            <p class="text-xs text-[#2B2D42]/70">Snap a quick selfie with live lighting feedback or choose our studio models. We analyze your baseline hair level instantly.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#F4A261]/40 font-mono block mb-2">02</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Unlock Your Flawless AI Palette</h4>
            <p class="text-xs text-[#2B2D42]/70">Gemini 2.5 decodes your undertones and curates tailored Analogous, Complementary, and Statement shades.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">03</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Inspect True-To-Life Results</h4>
            <p class="text-xs text-[#2B2D42]/70">Test dynamic shades with interactive side-by-side and wipe sliders that preserve natural sheen and strand depth.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#2B2D42]/30 font-mono block mb-2">04</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Hand the Recipe to Your Stylist</h4>
            <p class="text-xs text-[#2B2D42]/70">Download a dispensary card with exact developer volumes, tube grams, and aftercare recommendations ready for your appointment.</p>
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
                <span class="text-xs font-bold block truncate">1. Baseline Canvas</span>
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
                <span class="text-xs font-bold block truncate">2. Harmonic Shade</span>
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
                <span class="text-xs font-bold block truncate">3. True Mirror Split</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">Before / After Review</span>
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
                <span class="text-xs font-bold block truncate">4. Salon Work Order</span>
                <span class="text-[10px] text-[#2B2D42]/60 block truncate">PDF & WhatsApp Recipe</span>
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
                    <h3 class="text-lg font-bold text-[#2B2D42]">Step 1: Your Baseline Canvas</h3>
                    <p class="text-xs text-[#2B2D42]/60 mt-0.5">Lighting calibration and skin protection ensure streak-free, predictable color</p>
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

    <!-- B2B & SALON SUITE SECTION -->
    <section id="for-salons" class="py-20 border-b border-[#F4F1DE] bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3.5 py-1 rounded-full">
            For Salons, Stylists & Beauty Brands
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-[#2B2D42] tracking-tight">
            Cut Consultation Time in Half. Eliminate $200+ Color Correction Redos.
          </h2>
          <p class="text-sm sm:text-base text-[#2B2D42]/75 leading-relaxed">
            Transform your chair into a high-margin, zero-dispute consultation experience. AuraHair bridges the gap between what clients imagine and what salon chemistry can safely achieve.
          </p>
        </div>

        <!-- 3 B2B Pillars -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Pillar 1 -->
          <div class="bg-[#FDFBF7] p-8 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Clock class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#2B2D42]">50% Shorter Consultations</h3>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 leading-relaxed">
              Align on realistic target shades in 90 seconds. Clients see safe lift feasibility upfront on screen before you ever touch a bowl of bleach.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#FDFBF7] p-8 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/30 flex items-center justify-center text-[#F4A261]">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#2B2D42]">Zero "That's Not What I Wanted" Disputes</h3>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 leading-relaxed">
              Eliminate miscommunication and costly unpaid re-dos. Both colorist and client review the exact visual target, required developer, and expected lift together.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[#FDFBF7] p-8 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#2B2D42]">+35% Boost in Retail Aftercare Upsells</h3>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 leading-relaxed">
              Every generated client consultation card automatically matches bond builders (Olaplex/K18), toning shampoos, and gloss treatments for instant retail checkout.
            </p>
          </div>
        </div>

        <!-- Salon Proof Metric Banner -->
        <div class="bg-gradient-to-r from-[#2B2D42] to-[#3A3D5A] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div class="space-y-1 pt-2 sm:pt-0">
              <span class="text-3xl sm:text-4xl font-extrabold text-[#F4A261] font-mono">98%</span>
              <p class="text-xs text-white/70 font-medium">Client Color Satisfaction</p>
            </div>
            <div class="space-y-1 pt-4 sm:pt-0">
              <span class="text-3xl sm:text-4xl font-extrabold text-[#E07A5F] font-mono">0</span>
              <p class="text-xs text-white/70 font-medium">Bleach Level Surprises</p>
            </div>
            <div class="space-y-1 pt-4 sm:pt-0">
              <span class="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">3.5x</span>
              <p class="text-xs text-white/70 font-medium">Faster Color Decision-Making</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL-TO-ACTION BANNER -->
    <section class="py-16 md:py-20 bg-gradient-to-b from-white to-[#FDFBF7]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="bg-gradient-to-tr from-[#2B2D42] via-[#2F3249] to-[#2B2D42] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10 text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4A261] text-xs font-bold border border-white/10">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Risk-Free Hair Transformation</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Stop Guessing. <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#F4A261]">Start Glowing.</span>
          </h2>

          <p class="text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
            Never gamble hundreds of dollars and hours in the chair on a color disaster again. Test your tailored shade and claim your dispensary recipe in 30 seconds.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              @click="scrollToSimulator"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-7 py-3.5 shadow-lg hover:opacity-95 transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span>Simulate Your Look Now (Free)</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="isGalleryOpen = true"
              class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition flex items-center gap-2"
            >
              <BookmarkCheck class="w-4 h-4 text-[#F4A261]" />
              <span>Browse Saved Looks</span>
            </button>
          </div>

          <div class="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
            <div class="flex items-center gap-1.5">
              <CheckCircle class="w-4 h-4 text-emerald-400" />
              <span>Instant 30-Second Simulation</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CheckCircle class="w-4 h-4 text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CheckCircle class="w-4 h-4 text-emerald-400" />
              <span>100% Zero Filter Distortion</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-[#F4F1DE] bg-white py-10 text-xs text-[#2B2D42]/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-medium">AuraHair Chromastand AI</span>
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
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock
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
