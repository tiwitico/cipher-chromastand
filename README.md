# AuraHair Studio 💇‍♀️✨
### Virtual Selfie Hair Styling, Multi-Angle Simulation & Salon Chemistry Mixer
**Built with Nuxt 3, Tailwind CSS, PostgreSQL (Drizzle ORM, Cloud SQL Ready), and Google GenAI SDK (Gemini 2.5 Flash / Pro)**

---

## 🌟 Key Capabilities & Hackathon Pillars

### 1. Database Layer: PostgreSQL with Drizzle ORM (Cloud SQL Ready)
- **Production Connection Pooling**: Built with `pg.Pool` with SSL handling ready for Google Cloud SQL, Cloud Run, Supabase, and Neon.
- **Drizzle ORM Schema**: Fully-typed tables for `simulations`, `color_presets`, and `hair_styles` (`server/database/schema.ts`).
- **Auto-Migration & Seeding**: Auto-verifies schema and seeds initial hairstyles and salon shades (`server/database/index.ts`).
- **Zero-Friction Local Fallback**: Gracefully operates with intelligent fallback so developers can prototype locally before their PostgreSQL/Cloud SQL instance is connected.

### 2. Google GenAI SDK (Gemini 2.5 Flash / Pro Multimodal Vision)
- **Official `@google/genai` Integration**: Powered by the official SDK in `server/utils/gemini.ts`.
- **Multimodal Facial & Hair Canvas Analysis**: Sends the user's selfie portrait and styling preferences to Gemini 2.5 Flash or Pro via the Gemini API or Vertex AI on Google Cloud.
- **Structured Salon Consultation**: Extracts face shape, skin undertone, recommended haircuts with flattery match scores, bespoke color formulations, chemical developer volume guidance, and at-home maintenance tips.
- **One-Click Apply**: Users can click "Apply This Hairstyle" or "Apply This Shade" from the Gemini consultation modal to immediately drive the 360° live simulation.

1. **Selfie Capture & Model Studio**
   - **Live Webcam Mode**: Interactive webcam feed with face-framing alignment oval guide and 3-second countdown capture.
   - **Photo Upload**: Drag-and-drop or file upload supporting PNG, JPG, and WEBP formats.
   - **Studio Demo Models**: Preloaded diverse models (warm brunette, chiseled male crop, fair blonde, deep bronze curls) for instant zero-camera testing.

2. **Hairstyle Simulation Across Multiple Perspectives**
   - Curated catalog of trending haircuts across lengths (short, medium, long) and textures (straight, wavy, layered, coily).
   - Multi-Perspective Viewer:
     - **Front View**: Realistic composite blending over the user's selfie.
     - **Side Profile**: Side silhouette demonstrating head shape, crown volume, temple graduation, and ear drape.
     - **Back View**: Complete back-of-the-head architectural showcase highlighting layers, V-cut or blunt graduation, and neckline fades.
     - **360° Studio View**: Displays all three angles side-by-side in a salon client look sheet.
     - **Interactive Before/After Split Slider**: Compare original selfie vs styled/colored result.
     - **Export Look Sheet**: One-click high-resolution PNG export containing the Front, Side, and Back views.

3. **Hair Color & Finish Simulation**
   - **12 Curated Professional Shades**: Midnight Espresso, Rich Chestnut, Toasted Caramel Honey, Fiery Irish Copper, Bordeaux Cherry Wine, Champagne Honey Blonde, Nordic Ash Blonde, Diamond Ice Platinum, Dusty Rose Quartz, Lilac Smoked Lavender, Midnight Emerald, and Royal Sapphire.
   - **Custom Color Formulator**: Native color picker and HEX input.
   - **Color Techniques**: Solid Shade, Balayage Melt, Ombré Gradient, and Sun-Kissed Highlights.
   - **Custom Controls**: Gloss/Luster slider (Matte to Glass Mirror) and Root Depth / Shadow Root darkening slider.

4. **Professional Salon Chemistry & Substance Mixer Engine**
   - **Natural Starting Base Level (1–10)**: Select starting hair level with visual level swatches.
   - **Lift Calculation & Undertone Detection**: Automatically computes required lift levels and identifies exposed warm/brass undertones.
   - **Pre-Lightening / Bleach Stage Recipe**: Automatically calculates powder bleach in grams, developer volume (20 Vol / 30 Vol), and Bond Protector (Plex) when lift exceeds 3 levels or target level $\ge 8$.
   - **Exact Substances Breakdown Table**:
     - Base dye cream ($g$) for gray coverage and depth anchor.
     - Target reflect nuance ($g$) with specific salon shade codes (e.g., $7.13$, $8.11$, $5.44$).
     - Corrective booster/neutralizer concentrates ($g$) to cancel brassiness.
     - Professional Cream Developer ($g$, Volume: 10V, 20V, or 30V, and 1:1 or 1:2 mixing ratios).
     - Cuticle defense elixir and argan additives.
   - **Acidic Gloss Toner Formula**: Automatic toner specification when hair is bleached.
   - **Step-by-Step Salon Protocol**: Processing time countdowns and application phases (lengths first vs roots first).
   - **Aftercare & Tone Maintenance**: Specific salon guidelines (purple shampoo frequency, wash temperatures, UV protectant).

5. **Integrated SQLite Backend**
   - Local, zero-configuration SQLite database (`./data/hairstudio.db`) powered by `better-sqlite3`.
   - Stores simulation history, customized hair parameters, multi-angle vector snapshots, and chemical formulation JSON.
   - RESTful API endpoints for hairstyles, colors, chemistry calculations, and simulation history.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+`
- `pnpm` (or `npm`)

### Installation & Run

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   pnpm build
   node .output/server/index.mjs
   ```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/presets/hairstyles` | Retrieves catalog of hairstyles with categories and textures |
| `GET` | `/api/presets/colors` | Retrieves curated salon shades and level classifications |
| `POST` | `/api/formula/calculate` | Calculates chemical formula, developer volume, and bleaching steps |
| `GET` | `/api/simulations` | Lists all saved styling simulations |
| `POST` | `/api/simulations` | Saves a new simulation and formulation recipe |
| `GET` | `/api/simulations/:id` | Retrieves a specific simulation by ID |
| `DELETE` | `/api/simulations/:id` | Deletes a simulation |

---

## 🛠️ Tech Stack
- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3, Nitro engine)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom luxury salon palette
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Database**: SQLite with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **Utilities**: [VueUse](https://vueuse.org/)
