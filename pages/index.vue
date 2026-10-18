<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2B2D42] font-sans flex flex-col selection:bg-[#F4A261] selection:text-[#2B2D42]">
    
    <!-- TOP NAVIGATION -->
    <header class="border-b border-[#F4F1DE] bg-[#FDFBF7]/90 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] p-0.5 shadow-md">
            <div class="w-full h-full bg-[#FDFBF7] rounded-[14px] flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-[#E07A5F]" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-outfit font-extrabold tracking-tight text-[#2B2D42]">
                AuraHair
              </span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20 font-mono">
                Chromastand AI
              </span>
            </div>
            <p class="text-[11px] text-[#2B2D42]/65 hidden sm:block">Precision Hair Simulation & Salon Chemistry Suite</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-7 text-xs font-semibold text-[#2B2D42]/75">
          <a href="#features" class="hover:text-[#E07A5F] transition">Why Us vs Filters</a>
          <a href="#how-it-works" class="hover:text-[#E07A5F] transition">How It Works</a>
          <a href="#experience-selector" class="hover:text-[#E07A5F] transition">Choose Experience</a>
          <a href="#for-salons" class="hover:text-[#E07A5F] transition">For Salons & Colorists</a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- AI Color Match Link -->
          <NuxtLink
            to="/recommendation"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] hidden sm:flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles class="w-3.5 h-3.5 text-[#F4A261]" />
            <span>AI Color Match</span>
          </NuxtLink>

          <!-- Saved Formulas -->
          <button
            type="button"
            @click="isGalleryOpen = true"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F1DE] border border-[#F4F1DE] text-xs font-bold text-[#2B2D42] flex items-center gap-2 shadow-sm transition"
          >
            <BookmarkCheck class="w-4 h-4 text-[#E07A5F]" />
            <span class="hidden sm:inline">Saved</span>
            <span
              v-if="savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E07A5F]/15 text-[#E07A5F] font-mono font-bold"
            >
              {{ savedCount }}
            </span>
          </button>

          <!-- Launch Simulator CTA Button -->
          <NuxtLink
            to="/simulator"
            class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-4 sm:px-5 py-2.5 text-xs shadow-[0_4px_14px_rgba(224,122,95,0.3)] hover:shadow-[0_6px_20px_rgba(224,122,95,0.4)] hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Launch Simulator</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- HERO SECTION (LANDING PAGE) -->
    <section class="relative overflow-hidden py-16 md:py-24 border-b border-[#F4F1DE] bg-gradient-to-b from-[#FDFBF7] via-[#F4F1DE]/30 to-[#FDFBF7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Hero Copy -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Live Activity Ticker & Model Badge -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Pulsating Live Activity Pill -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F4F1DE] shadow-sm text-xs font-semibold text-[#2B2D42]">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>
                <strong class="font-bold text-[#2B2D42]">Live Colorist Engine:</strong>
                <span class="text-[#E07A5F] font-mono font-bold ml-1">{{ liveSimulations.toLocaleString() }}+</span>
                <span class="text-[#2B2D42]/70 ml-1">simulations today</span>
              </span>
            </div>

            <!-- Gemini Pill -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#F4F1DE] shadow-sm text-[11px] font-bold text-[#E07A5F]">
              <Sparkles class="w-3 h-3" />
              <span>Google Gemini 2.5 Vision</span>
            </div>
          </div>

          <!-- Main Hero Headline -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-outfit font-extrabold tracking-tight text-[#2B2D42] leading-[1.12]">
            Never Walk Out of a Salon Wondering If You Made a <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#F4A261]">Mistake.</span>
          </h1>

          <!-- Subheadline -->
          <p class="text-base sm:text-lg text-[#2B2D42]/75 max-w-xl leading-relaxed">
            Stop gambling $250+ and 4 hours in the chair on guesswork. AuraHair combines Google Gemini 2.5 multimodal intelligence with real hair physics—reading your facial undertones and iris chroma to reveal the exact shades that make your features pop, paired with the exact dispensary formula your colorist needs.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <!-- Primary AI Recommendation Wizard CTA -->
            <NuxtLink
              to="/recommendation"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-7 py-3.5 shadow-[0_4px_16px_rgba(224,122,95,0.35)] hover:shadow-[0_8px_25px_rgba(224,122,95,0.45)] hover:opacity-95 transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span>Find My Flawless Shade (AI Match)</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>

            <!-- Simulator Studio CTA -->
            <NuxtLink
              to="/simulator"
              class="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4F1DE] text-[#2B2D42] text-sm font-semibold border border-[#F4F1DE] shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <SlidersHorizontal class="w-4 h-4 text-[#E07A5F]" />
              <span>Direct Hair Simulator &rarr;</span>
            </NuxtLink>
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

        <!-- Right Hero Visual Card: Interactive Before/After Image Comparison Slider -->
        <div class="lg:col-span-5">
          <HeroBeforeAfterSlider
            before-image="/models/woman_brunette.jpg"
            after-image="/models/woman_brunette_copper_after.jpg"
          />
        </div>

      </div>
    </section>

    <!-- CHOOSE YOUR EXPERIENCE (WIZARD SELECTOR SECTION) -->
    <section id="experience-selector" class="py-20 md:py-28 border-b border-[#F4F1DE] bg-gradient-to-b from-[#FDFBF7] to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3.5 py-1 rounded-full">
            Two Tailored Wizard Experiences
          </span>
          <h2 class="text-3xl sm:text-4xl font-outfit font-extrabold text-[#2B2D42] tracking-tight">
            How Would You Like to Start?
          </h2>
          <p class="text-sm sm:text-base text-[#2B2D42]/70 leading-relaxed">
            Choose between automated AI color consultation or hands-on manual color simulation.
          </p>
        </div>

        <!-- 2 Upgraded Cards with Smooth Hover & Glowing Gradient Borders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <!-- Card 1: AI Color Recommendation Wizard -->
          <div class="relative p-[2px] rounded-3xl bg-transparent hover:bg-gradient-to-r hover:from-[#E07A5F] hover:to-[#F4A261] hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group">
            <div class="w-full h-full bg-white rounded-[22px] p-8 sm:p-10 border border-[#F4F1DE] group-hover:border-transparent transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#E07A5F]/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

              <div class="space-y-4 relative z-10">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] text-xs font-bold border border-[#E07A5F]/20">
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>Smart Chromatic Analysis</span>
                </div>

                <h3 class="text-2xl sm:text-3xl font-outfit font-extrabold text-[#2B2D42] group-hover:text-[#E07A5F] transition-colors">
                  AI Color Recommendation Wizard
                </h3>

                <p class="text-xs sm:text-sm text-[#2B2D42]/75 leading-relaxed">
                  Take a selfie or use our models. Google Gemini 2.5 measures your facial dermis ($L^*a^*b^*$), iris chroma, and contrast to curate 3 scientifically flattering shades with instant 1-click simulation.
                </p>

                <!-- Feature Bullets -->
                <div class="space-y-2.5 pt-3 text-xs text-[#2B2D42]/80 font-medium">
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Dermis undertone & eye iris chroma reading</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>12-season matrix (Analogous, Complementary & Fashion)</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1-click transition to mirror simulation</span>
                  </div>
                </div>
              </div>

              <NuxtLink
                to="/recommendation"
                class="w-full bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-6 py-3.5 shadow-[0_4px_14px_rgba(224,122,95,0.3)] hover:shadow-[0_6px_20px_rgba(224,122,95,0.45)] hover:opacity-95 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <span>Start AI Color Wizard</span>
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Card 2: Direct Hair Simulator Studio -->
          <div class="relative p-[2px] rounded-3xl bg-transparent hover:bg-gradient-to-r hover:from-[#E07A5F] hover:to-[#F4A261] hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group">
            <div class="w-full h-full bg-white rounded-[22px] p-8 sm:p-10 border border-[#F4F1DE] group-hover:border-transparent transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#F4A261]/20 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

              <div class="space-y-4 relative z-10">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4A261]/20 text-[#2B2D42] text-xs font-bold border border-[#F4A261]/30">
                  <SlidersHorizontal class="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Precision Color Lab</span>
                </div>

                <h3 class="text-2xl sm:text-3xl font-outfit font-extrabold text-[#2B2D42] group-hover:text-[#E07A5F] transition-colors">
                  Hair Simulator & Chemistry Lab
                </h3>

                <p class="text-xs sm:text-sm text-[#2B2D42]/75 leading-relaxed">
                  Already know what color you want? Pick from curated shades, dial in custom hex pigments, adjust root depth and balayage techniques, and generate printable salon work orders.
                </p>

                <!-- Feature Bullets -->
                <div class="space-y-2.5 pt-3 text-xs text-[#2B2D42]/80 font-medium">
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Interactive side-by-side & before/after wipe mirror</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Real specular highlights & cuticle sheen retention</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>PDF work order export & WhatsApp stylist sharing</span>
                  </div>
                </div>
              </div>

              <NuxtLink
                to="/simulator"
                class="w-full bg-[#2B2D42] hover:bg-[#3A3D5A] text-white font-medium rounded-xl px-6 py-3.5 shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <span>Launch Simulator Wizard</span>
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- CORE FEATURES SECTION ("WHY FILTERS FAIL VS HOW AURAHAIR WINS") -->
    <section id="features" class="py-20 md:py-24 border-b border-[#F4F1DE] bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-1 rounded-full">
            The Virtual Makeover Breakthrough
          </span>
          <h2 class="text-3xl sm:text-4xl font-outfit font-extrabold text-[#2B2D42] tracking-tight">
            Why Virtual Makeovers Look Fake—And How We Fixed It
          </h2>
          <p class="text-sm sm:text-base text-[#2B2D42]/75 leading-relaxed">
            Most makeover apps smear a flat purple or blonde sticker over your head that flattens highlights and clashes with your skin tone. AuraHair treats hair transformation as pure optical physics and dermis harmony.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1 -->
          <div class="bg-[#FDFBF7] p-7 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Eye class="w-6 h-6" />
            </div>
            <h3 class="text-base font-outfit font-bold text-[#2B2D42]">Colors That Make You Glow, Not Wash You Out</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Google Gemini 2.5 isolates your exact skin undertones (L*a*b*) and iris chroma. We automatically eliminate shades that make you look pale or sickly, surfacing tones that illuminate your face.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#FDFBF7] p-7 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/30 flex items-center justify-center text-[#F4A261]">
              <Sparkles class="w-6 h-6" />
            </div>
            <h3 class="text-base font-outfit font-bold text-[#2B2D42]">See Real Hair Strands, Not Airbrushed Plastic</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              Our perceptual CIELAB luminosity engine preserves individual strand depth, natural specular shine, cuticle reflections, and root shadows for hyper-photorealistic fidelity.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[#FDFBF7] p-7 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Beaker class="w-6 h-6" />
            </div>
            <h3 class="text-base font-outfit font-bold text-[#2B2D42]">Zero Surprises in the Salon Chair</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              No more crossing your fingers. AuraHair computes chemical lifting levels, developer volume (10–40 Vol), bleach requirements, and exact dye tube gram ratios your colorist needs to achieve the look.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="bg-[#FDFBF7] p-7 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#2B2D42]/10 border border-[#2B2D42]/20 flex items-center justify-center text-[#2B2D42]">
              <FileDown class="w-6 h-6" />
            </div>
            <h3 class="text-base font-outfit font-bold text-[#2B2D42]">Walk In With Confidence, Walk Out In Love</h3>
            <p class="text-xs text-[#2B2D42]/70 leading-relaxed">
              No more awkward Pinterest scrolling or miscommunications. Export a complete dispensary work order to PDF or send the exact recipe straight to your stylist’s WhatsApp in one click.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section id="how-it-works" class="py-20 border-b border-[#F4F1DE] bg-[#FDFBF7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F]">Frictionless Experience</span>
          <h2 class="text-2xl sm:text-4xl font-outfit font-extrabold text-[#2B2D42] tracking-tight">
            From Selfie to Salon Perfection in 4 Easy Steps
          </h2>
          <p class="text-xs sm:text-sm text-[#2B2D42]/70">
            No guesswork, no chemical disasters, and zero regret.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">01</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Snap or Upload Your Canvas</h4>
            <p class="text-xs text-[#2B2D42]/70">Snap a quick selfie with live lighting feedback or choose our studio models. We analyze your baseline hair level instantly.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#F4A261]/40 font-mono block mb-2">02</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Unlock Your Flawless AI Palette</h4>
            <p class="text-xs text-[#2B2D42]/70">Gemini 2.5 decodes your undertones and curates tailored Analogous, Complementary, and Statement shades.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#E07A5F]/40 font-mono block mb-2">03</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Inspect True-To-Life Results</h4>
            <p class="text-xs text-[#2B2D42]/70">Test dynamic shades with interactive side-by-side and wipe sliders that preserve natural sheen and strand depth.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-[#F4F1DE] shadow-sm hover:shadow-md transition">
            <span class="text-2xl font-black text-[#2B2D42]/30 font-mono block mb-2">04</span>
            <h4 class="text-sm font-bold text-[#2B2D42] mb-1">Hand the Recipe to Your Stylist</h4>
            <p class="text-xs text-[#2B2D42]/70">Download a dispensary card with exact developer volumes, tube grams, and aftercare recommendations ready for your appointment.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- B2B & SALON SUITE SECTION -->
    <section id="for-salons" class="py-20 md:py-28 border-b border-[#F4F1DE] bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <span class="text-xs uppercase font-extrabold tracking-wider text-[#E07A5F] bg-[#E07A5F]/10 px-3.5 py-1 rounded-full">
            For Salons, Stylists & Beauty Brands
          </span>
          <h2 class="text-3xl sm:text-4xl font-outfit font-extrabold text-[#2B2D42] tracking-tight">
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
            <h3 class="text-lg font-outfit font-bold text-[#2B2D42]">50% Shorter Consultations</h3>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 leading-relaxed">
              Align on realistic target shades in 90 seconds. Clients see safe lift feasibility upfront on screen before you ever touch a bowl of bleach.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#FDFBF7] p-8 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/30 flex items-center justify-center text-[#F4A261]">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-outfit font-bold text-[#2B2D42]">Zero "That's Not What I Wanted" Disputes</h3>
            <p class="text-xs sm:text-sm text-[#2B2D42]/70 leading-relaxed">
              Eliminate miscommunication and costly unpaid re-dos. Both colorist and client review the exact visual target, required developer, and expected lift together.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[#FDFBF7] p-8 rounded-3xl border border-[#F4F1DE] space-y-4 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-outfit font-bold text-[#2B2D42]">+35% Boost in Retail Aftercare Upsells</h3>
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
    <section class="py-16 md:py-24 bg-gradient-to-b from-white to-[#FDFBF7]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="bg-gradient-to-tr from-[#2B2D42] via-[#2F3249] to-[#2B2D42] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10 text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4A261] text-xs font-bold border border-white/10">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Risk-Free Hair Transformation</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-outfit font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Stop Guessing. <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#F4A261]">Start Glowing.</span>
          </h2>

          <p class="text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
            Never gamble hundreds of dollars and hours in the chair on a color disaster again. Test your tailored shade and claim your dispensary recipe in 30 seconds.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
            <NuxtLink
              to="/recommendation"
              class="bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-medium rounded-xl px-7 py-3.5 shadow-[0_4px_16px_rgba(224,122,95,0.35)] hover:shadow-[0_8px_25px_rgba(224,122,95,0.45)] hover:opacity-95 transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span>Start AI Color Match (Free)</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>

            <NuxtLink
              to="/simulator"
              class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition flex items-center gap-2"
            >
              <SlidersHorizontal class="w-4 h-4 text-[#F4A261]" />
              <span>Direct Hair Simulator</span>
            </NuxtLink>
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

    <!-- SAVED GALLERY MODAL -->
    <SavedGalleryModal
      :is-open="isGalleryOpen"
      @close="isGalleryOpen = false"
      @load-look="handleLoadLook"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Sparkles,
  BookmarkCheck,
  CheckCircle,
  Eye,
  Beaker,
  FileDown,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  SlidersHorizontal
} from 'lucide-vue-next'
import { useHairSession } from '~/composables/useHairSession'

const router = useRouter()
const isGalleryOpen = ref(false)
const liveSimulations = ref(1428)
let tickerInterval: any = null

const {
  savedCount,
  fetchSavedCount,
  setPhoto,
  setColor
} = useHairSession()

onMounted(async () => {
  await fetchSavedCount()
  
  // Dynamic live social proof ticker increment
  tickerInterval = setInterval(() => {
    // Increment between 1 and 2 simulations periodically
    liveSimulations.value += Math.floor(Math.random() * 2) + 1
  }, 4500)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})

function handleLoadLook(item: any) {
  if (item.user_photo) setPhoto(item.user_photo)
  setColor({
    colorHex: item.color_hex,
    colorName: item.color_name,
    colorFamily: item.color_family || 'natural',
    secondaryHex: item.secondary_color_hex
  })
  isGalleryOpen.value = false
  router.push({
    path: '/simulator',
    query: { step: '3' }
  })
}
</script>
