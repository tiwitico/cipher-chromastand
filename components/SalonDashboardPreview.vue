<template>
  <div class="space-y-8">
    <!-- Top Header & Context -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] text-xs font-bold font-mono tracking-wider uppercase mb-2">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Interactive Stylist Portal</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-outfit font-extrabold text-[#2B2D42] tracking-tight">
          The Salon Colorist Operating Suite
        </h3>
        <p class="text-xs sm:text-sm text-[#2B2D42]/70 mt-1 max-w-xl">
          Preview how top colorists and high-volume salons run chairside consultations, dispense precise grams, and triple retail take-home revenue.
        </p>
      </div>

      <!-- Station Status Pill -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#F4F1DE] shadow-sm text-xs font-medium text-[#2B2D42]">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Station 04 &bull; Atelier Chroma</span>
        </div>
        <span class="text-xs font-mono font-bold text-[#E07A5F] bg-[#FDFBF7] px-3 py-1.5 rounded-xl border border-[#F4F1DE]">
          v2.5 Pro Sync
        </span>
      </div>
    </div>

    <!-- MAIN TABLET / DESKTOP MOCKUP CONTAINER -->
    <div class="bg-white rounded-3xl border border-[#F4F1DE] shadow-[0_20px_60px_-15px_rgba(43,45,66,0.08)] overflow-hidden transition-all duration-300">
      
      <!-- Window Chrome / Title Bar -->
      <div class="bg-[#FDFBF7] border-b border-[#F4F1DE] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <!-- Mock OS Traffic Lights & App ID -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-[#EF4444]/80 inline-block shadow-inner"></span>
            <span class="w-3 h-3 rounded-full bg-[#F59E0B]/80 inline-block shadow-inner"></span>
            <span class="w-3 h-3 rounded-full bg-[#10B981]/80 inline-block shadow-inner"></span>
          </div>
          <div class="h-4 w-px bg-[#F4F1DE] hidden sm:block"></div>
          <div class="flex items-center gap-2 text-xs font-semibold text-[#2B2D42]/80">
            <span class="font-outfit font-extrabold text-[#2B2D42]">AuraHair Pro</span>
            <span class="text-[10px] bg-[#E07A5F]/15 text-[#E07A5F] px-2 py-0.5 rounded-md font-mono font-bold">Salon Suite</span>
          </div>
        </div>

        <!-- Interactive Tabs Navigation -->
        <div class="flex items-center p-1 bg-white border border-[#F4F1DE] rounded-2xl shadow-inner text-xs font-medium w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            @click="activeTab = 'queue'"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
            :class="activeTab === 'queue' ? 'bg-[#2B2D42] text-white shadow-sm font-bold' : 'text-[#2B2D42]/70 hover:text-[#2B2D42] hover:bg-[#FDFBF7]'"
          >
            <Users class="w-3.5 h-3.5" :class="activeTab === 'queue' ? 'text-[#F4A261]' : ''" />
            <span>Active Client Queue</span>
            <span class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono" :class="activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-[#F4F1DE] text-[#2B2D42]'">3</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'chemistry'"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
            :class="activeTab === 'chemistry' ? 'bg-[#2B2D42] text-white shadow-sm font-bold' : 'text-[#2B2D42]/70 hover:text-[#2B2D42] hover:bg-[#FDFBF7]'"
          >
            <Beaker class="w-3.5 h-3.5" :class="activeTab === 'chemistry' ? 'text-[#F4A261]' : ''" />
            <span>Color Chemistry Lab</span>
            <span class="w-2 h-2 rounded-full bg-[#E07A5F]"></span>
          </button>

          <button
            type="button"
            @click="activeTab = 'retail'"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
            :class="activeTab === 'retail' ? 'bg-[#2B2D42] text-white shadow-sm font-bold' : 'text-[#2B2D42]/70 hover:text-[#2B2D42] hover:bg-[#FDFBF7]'"
          >
            <ShoppingBag class="w-3.5 h-3.5" :class="activeTab === 'retail' ? 'text-[#F4A261]' : ''" />
            <span>Retail & Aftercare</span>
            <span class="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 rounded font-bold">+35%</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: ACTIVE CLIENT QUEUE -->
      <div v-if="activeTab === 'queue'" class="p-4 sm:p-8 space-y-6 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F1DE]">
          <div>
            <h4 class="text-base font-outfit font-bold text-[#2B2D42]">Today's Chair Consultations</h4>
            <p class="text-xs text-[#2B2D42]/65">Real-time chromatic detection mapped to each client's appointment slot.</p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-[#2B2D42]/60">Sort by:</span>
            <span class="font-bold text-[#2B2D42] bg-[#FDFBF7] px-2.5 py-1 rounded-lg border border-[#F4F1DE]">Appointment Time</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Client Card 1 (Active / Selected) -->
          <div
            @click="selectedClientIndex = 0; activeTab = 'chemistry'"
            class="cursor-pointer group relative p-5 rounded-2xl border-2 transition-all duration-200"
            :class="selectedClientIndex === 0 ? 'border-[#E07A5F] bg-[#FFF8EE] shadow-md' : 'border-[#F4F1DE] bg-white hover:border-[#E07A5F]/40 hover:shadow-sm'"
          >
            <div class="flex items-start gap-4">
              <div class="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#F4F1DE] shadow-sm">
                <img src="/models/woman_brunette.jpg" alt="Elena R." class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span class="absolute bottom-0 inset-x-0 bg-[#E07A5F] text-white text-[9px] font-bold text-center py-0.5">Ready</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-bold text-[#2B2D42] truncate">Elena Rostova</h5>
                  <span class="text-[11px] font-mono text-[#2B2D42]/60 font-semibold">2:00 PM</span>
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] font-bold">
                    Warm Autumn
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#2B2D42]/5 text-[#2B2D42]/80 font-mono">
                    Base L2 &rarr; Tgt L7
                  </span>
                </div>
                <p class="text-xs text-[#2B2D42]/80 font-medium mt-2 flex items-center gap-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#D35400] inline-block shadow-sm"></span>
                  <span class="truncate">Rich Amber Copper Melt</span>
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#F4F1DE] flex items-center justify-between text-xs">
              <span class="text-[#2B2D42]/65 text-[11px]">Developer: <strong>20 Vol (6%)</strong></span>
              <span class="text-[#E07A5F] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View Lab Recipe</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <!-- Client Card 2 -->
          <div
            @click="selectedClientIndex = 1; activeTab = 'chemistry'"
            class="cursor-pointer group relative p-5 rounded-2xl border-2 transition-all duration-200"
            :class="selectedClientIndex === 1 ? 'border-[#E07A5F] bg-[#FFF8EE] shadow-md' : 'border-[#F4F1DE] bg-white hover:border-[#E07A5F]/40 hover:shadow-sm'"
          >
            <div class="flex items-start gap-4">
              <div class="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#F4F1DE] shadow-sm">
                <img src="/models/woman_blonde.jpg" alt="Clara V." class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span class="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-bold text-center py-0.5">Toning</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-bold text-[#2B2D42] truncate">Clara Vance</h5>
                  <span class="text-[11px] font-mono text-[#2B2D42]/60 font-semibold">2:45 PM</span>
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#F4A261]/25 text-[#2B2D42] font-bold">
                    Light Spring
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#2B2D42]/5 text-[#2B2D42]/80 font-mono">
                    Base L8 &rarr; Tgt L10
                  </span>
                </div>
                <p class="text-xs text-[#2B2D42]/80 font-medium mt-2 flex items-center gap-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#E5D3B3] inline-block shadow-sm"></span>
                  <span class="truncate">Scandinavian Butter Blonde</span>
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#F4F1DE] flex items-center justify-between text-xs">
              <span class="text-[#2B2D42]/65 text-[11px]">Developer: <strong>10 Vol (3%)</strong></span>
              <span class="text-[#E07A5F] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View Lab Recipe</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <!-- Client Card 3 -->
          <div
            @click="selectedClientIndex = 2; activeTab = 'chemistry'"
            class="cursor-pointer group relative p-5 rounded-2xl border-2 transition-all duration-200"
            :class="selectedClientIndex === 2 ? 'border-[#E07A5F] bg-[#FFF8EE] shadow-md' : 'border-[#F4F1DE] bg-white hover:border-[#E07A5F]/40 hover:shadow-sm'"
          >
            <div class="flex items-start gap-4">
              <div class="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#F4F1DE] shadow-sm">
                <img src="/models/man_crop.jpg" alt="Marcus S." class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span class="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[9px] font-bold text-center py-0.5">Bleach</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-bold text-[#2B2D42] truncate">Marcus Sterling</h5>
                  <span class="text-[11px] font-mono text-[#2B2D42]/60 font-semibold">3:30 PM</span>
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                    Cool Winter
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#2B2D42]/5 text-[#2B2D42]/80 font-mono">
                    Base L2 &rarr; Tgt L10
                  </span>
                </div>
                <p class="text-xs text-[#2B2D42]/80 font-medium mt-2 flex items-center gap-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#E2E8F0] inline-block shadow-sm"></span>
                  <span class="truncate">Icy Platinum Texture Crop</span>
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#F4F1DE] flex items-center justify-between text-xs">
              <span class="text-[#2B2D42]/65 text-[11px]">Developer: <strong>30 Vol (9%)</strong></span>
              <span class="text-[#E07A5F] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View Lab Recipe</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Summary Footnote -->
        <div class="bg-[#FDFBF7] p-4 rounded-2xl border border-[#F4F1DE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 text-[#2B2D42]/75">
            <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All 3 clients verified with spectrophotometric CIELAB baseline readings &bull; Zero lift surprises.</span>
          </div>
          <button
            type="button"
            @click="activeTab = 'chemistry'"
            class="text-[#E07A5F] font-bold hover:underline shrink-0"
          >
            Open Active Mixing Station &rarr;
          </button>
        </div>
      </div>

      <!-- TAB 2: COLOR CHEMISTRY LAB -->
      <div v-if="activeTab === 'chemistry'" class="p-4 sm:p-8 space-y-6 animate-fadeIn">
        <!-- Client Profile Banner -->
        <div class="bg-gradient-to-r from-[#2B2D42] to-[#3A3D5A] p-5 sm:p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div class="flex items-center gap-4">
            <img :src="currentClient.photo" :alt="currentClient.name" class="w-14 h-14 rounded-2xl object-cover border-2 border-[#E07A5F] shadow-sm" />
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base sm:text-lg font-outfit font-extrabold">{{ currentClient.name }}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#F4A261] font-mono font-bold">Client #0{{ selectedClientIndex + 1 }}</span>
              </div>
              <p class="text-xs text-white/70 mt-0.5">
                Target: <strong>{{ currentClient.targetLook }}</strong> &bull; {{ currentClient.harmonyReason }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start md:self-auto">
            <span class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>100% Lift Feasible</span>
            </span>
            <button
              type="button"
              @click="isRecipeCopied = true; setTimeout(() => isRecipeCopied = false, 2000)"
              class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>{{ isRecipeCopied ? 'Printed!' : 'Print Recipe Card' }}</span>
            </button>
          </div>
        </div>

        <!-- Chemistry Dispensary Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Column A: Decolorizing / Bleach Specs -->
          <div class="p-5 rounded-2xl border border-[#F4F1DE] bg-[#FDFBF7] space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#E07A5F]/15 flex items-center justify-center text-[#E07A5F]">
                  <Scale class="w-4 h-4" />
                </div>
                <h5 class="text-sm font-bold text-[#2B2D42]">Step 1: Decolorizing / Lift Protocol</h5>
              </div>
              <span class="text-[11px] font-mono font-bold text-[#E07A5F]">{{ currentClient.bleach.liftSpan }}</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between py-2 border-b border-[#F4F1DE]">
                <span class="text-[#2B2D42]/70">Lightening Powder</span>
                <span class="font-mono font-bold text-[#2B2D42]">{{ currentClient.bleach.powderGrams }}g Blue Dust-Free Bleach</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-[#F4F1DE]">
                <span class="text-[#2B2D42]/70">Developer Strength & Volume</span>
                <span class="font-mono font-bold text-[#2B2D42]">{{ currentClient.bleach.devVol }} Vol ({{ currentClient.bleach.devGrams }}g)</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-[#F4F1DE]">
                <span class="text-[#2B2D42]/70">Bond Defense Additive</span>
                <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{{ currentClient.bleach.additive }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 text-[#2B2D42]/75">
                <span>Timer / Processing Time:</span>
                <span class="font-mono font-bold text-[#E07A5F]">{{ currentClient.bleach.timeMinutes }} mins (Check lift at 20m)</span>
              </div>
            </div>
          </div>

          <!-- Column B: Target Pigment Formulation -->
          <div class="p-5 rounded-2xl border border-[#F4F1DE] bg-white space-y-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#F4A261]/25 flex items-center justify-center text-[#2B2D42]">
                  <Beaker class="w-4 h-4" />
                </div>
                <h5 class="text-sm font-bold text-[#2B2D42]">Step 2: Micro-Gram Dye Recipe</h5>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full inline-block border border-black/10" :style="{ backgroundColor: currentClient.swatchHex }"></span>
                <span class="text-[11px] font-mono font-bold text-[#2B2D42]">{{ currentClient.swatchHex }}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div
                v-for="(comp, i) in currentClient.dyeComponents"
                :key="i"
                class="flex items-center justify-between py-2 border-b border-[#F4F1DE]"
              >
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-md bg-[#2B2D42]/5 flex items-center justify-center text-[10px] font-bold text-[#2B2D42]">{{ i + 1 }}</span>
                  <span class="text-[#2B2D42]/80 font-medium">{{ comp.name }}</span>
                </div>
                <span class="font-mono font-bold text-[#2B2D42]">{{ comp.grams }}g</span>
              </div>

              <div class="flex items-center justify-between py-2 border-b border-[#F4F1DE]">
                <span class="text-[#2B2D42]/70">Demi Developer</span>
                <span class="font-mono font-bold text-[#2B2D42]">{{ currentClient.dyeDeveloper }}</span>
              </div>

              <div class="flex items-center justify-between pt-2">
                <span class="text-[#2B2D42]/70">Total Bowl Weight:</span>
                <span class="font-mono font-bold text-[#E07A5F]">{{ currentClient.totalBowlWeight }}g</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Pro Colorist Guidance Pill -->
        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p class="leading-relaxed">
            <strong>Colorist Technical Tip:</strong> {{ currentClient.coloristTip }}
          </p>
        </div>
      </div>

      <!-- TAB 3: RETAIL & AFTERCARE UPSELL -->
      <div v-if="activeTab === 'retail'" class="p-4 sm:p-8 space-y-6 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F1DE]">
          <div>
            <h4 class="text-base font-outfit font-bold text-[#2B2D42]">Curated Take-Home Prescription</h4>
            <p class="text-xs text-[#2B2D42]/65">Auto-generated based on {{ currentClient.name }}'s lift level and dye porosity.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Avg. Upsell Success: 78%
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Retail Item 1 -->
          <div
            v-for="(item, idx) in currentClient.retailProducts"
            :key="idx"
            class="p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between"
            :class="item.selected ? 'border-[#E07A5F] bg-[#FFF8EE] shadow-sm' : 'border-[#F4F1DE] bg-white'"
          >
            <div>
              <div class="flex items-start justify-between gap-2 mb-3">
                <span class="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white border border-[#F4F1DE] text-[#2B2D42]">
                  {{ item.category }}
                </span>
                <span class="font-mono font-bold text-[#2B2D42] text-sm">${{ item.price.toFixed(2) }}</span>
              </div>
              <h5 class="text-sm font-bold text-[#2B2D42] mb-1">{{ item.name }}</h5>
              <p class="text-xs text-[#2B2D42]/70 leading-relaxed">{{ item.benefit }}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-[#F4F1DE] flex items-center justify-between">
              <span class="text-[11px] text-emerald-700 font-medium">Stylist Cut: +${{ (item.price * 0.25).toFixed(2) }}</span>
              <button
                type="button"
                @click="item.selected = !item.selected"
                class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
                :class="item.selected ? 'bg-[#E07A5F] text-white' : 'bg-[#F4F1DE] text-[#2B2D42] hover:bg-[#E07A5F]/20'"
              >
                <Check v-if="item.selected" class="w-3.5 h-3.5" />
                <Plus v-else class="w-3.5 h-3.5" />
                <span>{{ item.selected ? 'In Ticket' : 'Add' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- POS Checkout Summary Card -->
        <div class="bg-gradient-to-r from-[#2B2D42] to-[#3A3D5A] p-5 sm:p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div class="space-y-1 text-center sm:text-left">
            <span class="text-xs text-white/60 font-medium uppercase tracking-wider">Client Checkout Summary (Elena Rostova)</span>
            <div class="text-xl sm:text-2xl font-outfit font-extrabold flex items-center justify-center sm:justify-start gap-3">
              <span>Service ($185.00) + Retail (${{ totalRetailPrice.toFixed(2) }})</span>
              <span class="text-[#F4A261] font-mono text-2xl">${{ (185 + totalRetailPrice).toFixed(2) }}</span>
            </div>
            <p class="text-xs text-emerald-400 font-medium">
              Stylist Commission on this session: +${{ (45 + totalRetailPrice * 0.25).toFixed(2) }}
            </p>
          </div>

          <button
            type="button"
            @click="isTicketSent = true; setTimeout(() => isTicketSent = false, 2500)"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#E07A5F] to-[#F4A261] text-white font-bold text-xs shadow-md hover:opacity-95 transition active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <CheckCircle2 v-if="isTicketSent" class="w-4 h-4" />
            <ShoppingBag v-else class="w-4 h-4" />
            <span>{{ isTicketSent ? 'Pushed to Square / Boulevard POS!' : 'Sync to Salon POS Ticket' }}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- METRICS SOCIAL PROOF BAR (BELOW DASHBOARD) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-white border border-[#F4F1DE] shadow-sm text-center space-y-1 hover:border-[#E07A5F]/30 transition">
        <span class="text-2xl font-outfit font-extrabold text-[#E07A5F] font-mono">50%</span>
        <p class="text-xs font-bold text-[#2B2D42]">Faster Consultation</p>
        <p class="text-[11px] text-[#2B2D42]/60">90 seconds vs 25 mins</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-[#F4F1DE] shadow-sm text-center space-y-1 hover:border-[#E07A5F]/30 transition">
        <span class="text-2xl font-outfit font-extrabold text-[#F4A261] font-mono">3.5x</span>
        <p class="text-xs font-bold text-[#2B2D42]">Retail Upsell Rate</p>
        <p class="text-[11px] text-[#2B2D42]/60">Automated aftercare matching</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-[#F4F1DE] shadow-sm text-center space-y-1 hover:border-[#E07A5F]/30 transition">
        <span class="text-2xl font-outfit font-extrabold text-emerald-600 font-mono">0</span>
        <p class="text-xs font-bold text-[#2B2D42]">Color-Correction Redos</p>
        <p class="text-[11px] text-[#2B2D42]/60">100% predictable lift curves</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-[#F4F1DE] shadow-sm text-center space-y-1 hover:border-[#E07A5F]/30 transition">
        <span class="text-2xl font-outfit font-extrabold text-[#2B2D42] font-mono">+$48</span>
        <p class="text-xs font-bold text-[#2B2D42]">Avg. Ticket Expansion</p>
        <p class="text-[11px] text-[#2B2D42]/60">Boost per chair every day</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sparkles,
  Users,
  Beaker,
  ShoppingBag,
  Scale,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check
} from 'lucide-vue-next'

const activeTab = ref<'queue' | 'chemistry' | 'retail'>('queue')
const selectedClientIndex = ref(0)
const isRecipeCopied = ref(false)
const isTicketSent = ref(false)

const clients = [
  {
    name: 'Elena Rostova',
    photo: '/models/woman_brunette.jpg',
    targetLook: 'Rich Amber Copper Melt',
    harmonyReason: 'Warm Autumn palette &bull; Complements golden olive undertone',
    swatchHex: '#D35400',
    bleach: {
      liftSpan: '5 Levels Lift (L2 &rarr; L7)',
      powderGrams: 28,
      devVol: 30,
      devGrams: 56,
      additive: 'Bond Defense 4.0ml (K18 Mist)',
      timeMinutes: 45
    },
    dyeComponents: [
      { name: 'Matrix Socolor 7.4 (Intense Copper)', grams: 32 },
      { name: 'Matrix Socolor 8.43 (Warm Gold Copper)', grams: 16 },
      { name: 'Clear Diluter / High Gloss', grams: 8 }
    ],
    dyeDeveloper: '56g Cream Dev 10 Vol (1:1 Ratio)',
    totalBowlWeight: 112,
    coloristTip: 'Check lift at 25 minutes. Tone when canvas reaches pale yellow-orange. Do not exceed 45 minutes.',
    retailProducts: [
      {
        name: 'ChromaLock Copper Sulfate-Free Wash',
        category: 'Color Deposit Shampoo',
        benefit: 'Infuses direct copper ions on every lather to prevent brassy fade.',
        price: 34.00,
        selected: true
      },
      {
        name: 'Deep Lipid Bonding Butter',
        category: 'Weekly Restorative Mask',
        benefit: 'Seals lifted cuticle scales and restores tensile cortex elasticity.',
        price: 42.00,
        selected: true
      },
      {
        name: 'Bi-Phase UV & Heat Shield Mist',
        category: 'Daily Protection Spray',
        benefit: 'Blocks 450°F thermal styling breakdown and UV melanin oxidization.',
        price: 28.00,
        selected: true
      }
    ]
  },
  {
    name: 'Clara Vance',
    photo: '/models/woman_blonde.jpg',
    targetLook: 'Scandinavian Butter Blonde',
    harmonyReason: 'Light Spring palette &bull; Enhances bright hazel eyes with warm glow',
    swatchHex: '#E5D3B3',
    bleach: {
      liftSpan: '2 Levels Lift (L8 &rarr; L10)',
      powderGrams: 20,
      devVol: 20,
      devGrams: 40,
      additive: 'Olaplex No.1 3.5ml',
      timeMinutes: 25
    },
    dyeComponents: [
      { name: "L'Oréal Majirel 10.13 (Extra Light Butter)", grams: 35 },
      { name: "L'Oréal Majirel 9.02 (Soft Iridescent Pearl)", grams: 15 }
    ],
    dyeDeveloper: '50g 10 Vol Developer (1:1 Ratio)',
    totalBowlWeight: 100,
    coloristTip: 'Very gentle lift needed. Apply toner to damp hair at shampoo bowl for 8-12 minutes max.',
    retailProducts: [
      {
        name: 'Illuminating Butter Blonde Shampoo',
        category: 'Neutralizing Wash',
        benefit: 'Micro-violet balancing pigment that protects luminous warm tones.',
        price: 36.00,
        selected: true
      },
      {
        name: 'Keratin Peptide Leave-In Elixir',
        category: 'Post-Bleach Spray',
        benefit: 'Repairs broken polypeptide chains for virgin-hair bounce.',
        price: 45.00,
        selected: true
      },
      {
        name: 'Silk Gloss Finishing Serum',
        category: 'Styling Glaze',
        benefit: 'Reflects salon studio lighting with diamond glass hair shine.',
        price: 30.00,
        selected: false
      }
    ]
  },
  {
    name: 'Marcus Sterling',
    photo: '/models/man_crop.jpg',
    targetLook: 'Icy Platinum Texture Crop',
    harmonyReason: 'Cool Winter archetype &bull; High-contrast edge with neutral undertone',
    swatchHex: '#E2E8F0',
    bleach: {
      liftSpan: '7 Levels Lift (L2 &rarr; L9+)',
      powderGrams: 35,
      devVol: 30,
      devGrams: 70,
      additive: 'Bond Multiplier 5.0ml',
      timeMinutes: 50
    },
    dyeComponents: [
      { name: 'Wella Koleston 10/16 (Vanilla Frost)', grams: 30 },
      { name: 'Wella Koleston 0/88 (Pearl Intensifier)', grams: 3 }
    ],
    dyeDeveloper: '66g Pastel 1.9% Developer (1:2 Ratio)',
    totalBowlWeight: 99,
    coloristTip: 'Two consecutive low-vol applications recommended over aggressive 40 Vol to preserve scalp integrity.',
    retailProducts: [
      {
        name: 'Silver Ash Charcoal Detox Wash',
        category: 'Anti-Yellow Cleanser',
        benefit: 'Eliminates mineral tap buildup and stubborn yellow undertones.',
        price: 32.00,
        selected: true
      },
      {
        name: 'Scalp Soothing Barrier Cream',
        category: 'Post-Bleach Scalp Balm',
        benefit: 'Calms irritation and replenishes scalp microbiome immediately.',
        price: 26.00,
        selected: true
      },
      {
        name: 'Matte Clay Fiber with UV Shield',
        category: 'Styling Pomade',
        benefit: 'Medium hold texture with zero grease and sunfade protection.',
        price: 24.00,
        selected: true
      }
    ]
  }
]

const currentClient = computed(() => clients[selectedClientIndex.value])

const totalRetailPrice = computed(() => {
  return currentClient.value.retailProducts
    .filter(p => p.selected)
    .reduce((sum, p) => sum + p.price, 0)
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
