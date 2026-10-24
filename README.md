# Masal AI — Inbound Lead Intelligence & Voice Handoff Copilot

An AI-powered command center built for real estate sales teams to prioritize high-volume inbound leads, extract structured buyer intent in seconds, and bridge the handoff between **Masal AI's 30-second voice qualification agent** and human sales closers.

---

## 1. AI Model & Architecture (`nvidia/nemotron-3.5-super-vl-120b-a12b`)

- **Model Used:** **NVIDIA Nemotron-3.5-Super-VL-120B-A12B** via NVIDIA NIM (`https://integrate.api.nvidia.com/v1/chat/completions`).
- **Why Nemotron-3.5-Super-VL-120B-A12B?**
  1. **Chain-of-Thought (`enable_thinking: true`):** Surfaces a transparent reasoning trace (`reasoning_content`) explaining *why* a lead was scored Hot/Warm/Cold based on liquidity, loan pre-approval, and lease expiry urgency.
  2. **Vision-Language (VL) Multimodal Capability:** Supports optional floorplan/brochure image URLs alongside text transcripts.
  3. **Zero-CORS Reverse Proxy Architecture:** Browser calls to `integrate.api.nvidia.com` normally fail due to CORS preflight restrictions. I solved this cleanly using a Vite proxy (`vite.config.js`) for local development and a Vercel Edge rewrite (`vercel.json`) in production (`/api/nvidia/v1/chat/completions`).

---

## 2. Core & Custom Features Built for Masal AI

### Core Requirements
1. **Multi-Lead Intake & Dynamic Prioritization:** Ranks all leads by AI Lead Score (`1–99`) with `Hot`, `Warm`, and `Cold` filters and an instant urgency flag.
2. **3-Second Scannable AI Output:** Displays Lead Summary, Customer Intent, Key Requirements, Objections/Risks, Recommended Next Action, and 1-Click WhatsApp/Email Suggested Response.
3. **Context-Grounded Sales Copilot:** Per-lead interactive chat grounded strictly in that buyer's budget, objections, and matched property inventory.

### 3 Custom "Wow Factor" Features
1. **Multilingual Voice Pitch & Audio Rehearsal (English, Hinglish, Kanglish) + Battlecard:** Bridges the handoff from Masal AI's 30-second multilingual voice bot to the human closer.
2. **Smart RERA Inventory Matcher & Anti-No-Show Packet:** Automatically matches leads against curated Bengaluru RERA projects (Sobha, Brigade, Prestige, Godrej) with EMI & appreciation hooks.
3. **Masal AutoCampaign Ad-Signal Feedback Loop:** Audits lead authenticity and lets the closer push a 1-click conversion signal back to Meta CAPI / Google Ads.

---

## 3. How to Run Locally

```bash
npm install
npm run dev