<div align="center">

# 🎙️ Masal AI — Revenue Desk & Voice Qualification Studio


*Bridging Masal AI's 30-Second Multilingual Voice Qualification Bot with Human Closer Workflows.*

[![Live URL](https://img.shields.io/badge/Live-URL-success?style=for-the-badge&logo=vercel)](https://masal-ai-rust.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/tejas-54/masal-ai-revenue-studio)
[![NVIDIA NIM](https://img.shields.io/badge/AI-Nemotron_120B-76B900?style=for-the-badge&logo=nvidia)](https://build.nvidia.com)
[![Vite + React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)

</div>

---

## 🌟 Executive Overview

Real estate sales teams receive hundreds of inbound leads daily across Meta Ads, Google Search, and AI voice bots. Salespeople lose deals due to queue blindness, context cliffs during handoffs, and high site-visit no-show rates. 

**Masal AI Revenue Studio** is an editorial-grade AI command center built to solve these bottlenecks. Powered by **NVIDIA Nemotron-3.5-Super-VL-120B-A12B**, it automates lead prioritization, multi-turn voice qualification playback, real-time semantic CRM diffs, and financial deal structuring.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide Icons.
- **AI Engine:** **NVIDIA Nemotron-3.5-Super-VL-120B-A12B** via NVIDIA NIM API (`/v1/chat/completions`) with Chain-of-Thought reasoning (`enable_thinking: true`).
- **Voice / Audio DSP:** Web Speech Neural TTS Synthesis (with Native Devanagari/Kannada phonetic script mapping) + WebAudio Telephony Ringback Synthesizer + Web Speech Recognition Microphone Input.
- **Edge Proxy:** Zero-CORS architecture via Vite local proxy and Vercel Edge Rewrites (`vercel.json`).

---

## 📋 Core Assignment Requirements Implemented

| Requirement | Implementation Details | Status |
| :--- | :--- | :--- |
| **1. Lead Intake Form** | Ingests Name, Location, Requirement, Budget, Timeline, and Call Transcripts with 1-click demo presets. | ✅ Complete |
| **2. AI Analysis & Scannable Brief** | Extracts Executive Summary, Buyer Intent, Verified Requirements, Objections, Next Actions, and WhatsApp Replies. | ✅ Complete |
| **3. Conversational Copilot** | Context-grounded sales strategist per lead, answering closing questions strictly using buyer financials & inventory. | ✅ Complete |
| **4. Prioritized Lead Queue** | Sorts leads dynamically by AI Lead Score (`1–99`) with `Hot`, `Warm`, and `Cold` segmentation. | ✅ Complete |
| **5. Editorial Scannability** | Warm Alabaster aesthetic (`#FAF8F5`) with typographic hierarchy designed for fast reading during live calls. | ✅ Complete |

---

## ✨ The 6 "Wow Factor" Custom Features

Beyond the core requirements, this workspace includes 6 custom modules designed specifically for Masal AI's real-estate SaaS ecosystem:

### 1. 🎙️ 30-Second Multilingual Voice Studio (`en-IN`, `hi-IN`, `kn-IN`) + Live Two-Way Roleplay
* **Problem Solved:** Traditional TTS reads Romanized Kanglish/Hinglish with a robotic American accent. 
* **Our Solution:** Dual-layer phonetic TTS separating **`displayText`** (authentic Bengaluru/Delhi slang) from **`spokenText`** (native Kannada `ಕನ್ನಡ` and Devanagari `देवनागरी` script). Includes **⚡ Nemotron Dynamic Scenario Generation** (writes a new conversation twist on the spot) and **🎙️ Live Microphone Roleplay** where you talk to the buyer and Nemotron replies live!

### 2. 🔄 Post-Call Semantic Diff & Dynamic Re-Scoring Engine
* **Problem Solved:** Salespeople hate filling out 12 CRM dropdowns after every phone call.
* **Our Solution:** Automatically reads the final turns of your live voice call (or raw broker notes), computes field-by-field `Before → After` mutations, updates the lead record, and recalculates the Lead Score & Priority tier instantly.

### 3. 🧮 Interactive Financial Deal Desk (Anti No-Show Calculator)
* **Problem Solved:** Site-visit no-shows happen when buyers aren't given concrete financial proof before Saturday morning.
* **Our Solution:** Live sliders for Carpet Area, Floor-Rise PLC, Downpayment %, and Bank Interest Rates. Computes **All-Inclusive RERA Box Price** and **Rent-vs-EMI Net Outflow** with a 1-click WhatsApp copy button.

### 4. ⚔️ Corridor Competitor Battlematrix & Wedge Rebuttals
* **Problem Solved:** Buyers always compare 2–3 competing builders before booking a site visit.
* **Our Solution:** Side-by-side comparison tables benchmarking our matched project against competing corridor developments (Carpet Efficiency %, Metro access, Water security) with 1-click rebuttal scripts.

### 5. 🎟️ VIP Site-Visit Pass & 5-Day WhatsApp Drip Cadence
* **Problem Solved:** Lack of structured post-qualification follow-up.
* **Our Solution:** Generates a QR-style Express Gate Pass token (`MSL-VIP-CODE`) and a 5-day multi-channel conversion cadence (Day 0 Instant Callback → Day 1 Cost Sheet → Day 3 Water Proof → Day 5 Cab Pass).

### 6. 🛡️ FDE Live Telemetry & Chain-of-Thought Inspector
* **Problem Solved:** Proving that real AI models power the application during technical interviews.
* **Our Solution:** A toggleable FDE Drawer revealing model latency (`ms`), status codes, and raw Nemotron Chain-of-Thought reasoning traces.

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone [https://github.com/tejas-54/masal-ai-revenue-studio.git](https://github.com/tejas-54/masal-ai-revenue-studio.git)
cd masal-ai-revenue-studio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
