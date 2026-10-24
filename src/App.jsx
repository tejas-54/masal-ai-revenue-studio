import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PhoneCall,
  Plus,
  Send,
  Copy,
  Check,
  Volume2,
  Square,
  ArrowUpRight,
  Search,
  RefreshCw,
  Terminal,
  Sparkles,
  FileSpreadsheet,
  GitCompare,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RotateCcw,
  ChevronRight,
  Calculator,
  Swords,
  CalendarCheck,
  QrCode,
  Wand2,
  Radio,
  MessageSquare
} from 'lucide-react';

// ============================================================================
// NVIDIA NEMOTRON 3.5 SUPER 120B CONFIG
// ============================================================================
const DEFAULT_NVIDIA_KEY =
  import.meta.env.VITE_NVIDIA_API_KEY ||
  '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';

const NEMOTRON_MODEL = 'nvidia/nemotron-3.5-super-vl-120b-a12b';
const NVIDIA_ENDPOINT = '/api/nvidia/v1/chat/completions';

// ============================================================================
// CURATED BENGALURU RERA PROJECTS + COMPETITOR BENCHMARKS
// ============================================================================
const PROJECTS = [
  {
    id: 'sobha-neopolis',
    name: 'Sobha Neopolis',
    corridor: 'Panathur / Whitefield, Bengaluru',
    rera: 'PRM/KA/RERA/1251/446/PR/230914',
    baseRatePerSqft: 11200,
    defaultSqft: 1850,
    config: '3 BHK Luxury + Maid Room',
    possession: 'Ready-to-Move / Dec 2026',
    carpetEfficiency: '74%',
    metroDistance: '800m (Kadugodi Metro Back-Gate)',
    waterSecurity: 'Cauvery Phase-5 + 6L Rainwater Harvester',
    highlight: '800m from Kadugodi Metro corridor (bypasses Hope Farm bottleneck)',
    competitors: [
      {
        name: 'Prestige Park Grove (Whitefield)',
        rate: '₹12,400/sq.ft',
        carpetEfficiency: '68%',
        weakness: 'High density (3,600+ units) & Dec 2027+ possession wait',
        wedgePitch:
          'Prestige Park Grove charges ₹1,200/sq.ft more for 6% lower carpet efficiency and a 14-month longer wait—while Sobha Neopolis gives you immediate Kadugodi Metro back-gate access.'
      },
      {
        name: 'Godrej Woodscapes (Budigere Cross)',
        rate: '₹10,600/sq.ft',
        carpetEfficiency: '69%',
        weakness: 'Heavy OMR/Hoskote toll truck traffic & 6km from nearest Metro',
        wedgePitch:
          'Budigere Cross adds 35 mins of highway truck traffic to ITPL every morning. Sobha Neopolis keeps you inside the ITPL ring with zero toll commute.'
      }
    ]
  },
  {
    id: 'brigade-sanctuary',
    name: 'Brigade Sanctuary',
    corridor: 'Sarjapur Road, Bengaluru',
    rera: 'PRM/KA/RERA/1251/308/PR/231102',
    baseRatePerSqft: 8900,
    defaultSqft: 1520,
    config: '3 BHK Smart Residence',
    possession: 'Q2 2027 (Mivan Fast-Track)',
    carpetEfficiency: '76%',
    metroDistance: '1.2km (UpcomingCarmelaram Red Line)',
    waterSecurity: '48 Recharge Borewells + Miyawaki Retention Forest',
    highlight: '12 mins to Wipro SEZ & RGA Tech Park, Zero-Tanker Rainwater + Dual STP',
    competitors: [
      {
        name: 'The Prestige City (Sarjapur)',
        rate: '₹9,600/sq.ft',
        carpetEfficiency: '67%',
        weakness: '7,000-unit mega township congestion at main Yamare gate',
        wedgePitch:
          'At Prestige City, just exiting the main township gate takes 15 minutes at 9 AM. Brigade Sanctuary is a low-density enclave with 500+ preserved trees and 9% higher carpet area.'
      },
      {
        name: 'Birla Evara (Sarjapur Road)',
        rate: '₹9,350/sq.ft',
        carpetEfficiency: '70%',
        weakness: '2028/2029 possession horizon (3+ years of extra rent)',
        wedgePitch:
          'Waiting until 2029 at Birla Evara means burning ₹19+ Lakhs more in Bellandur rent. Brigade Sanctuary hands over in Q2 2027.'
      }
    ]
  },
  {
    id: 'prestige-camden',
    name: 'Prestige Camden Gardens',
    corridor: 'Thanisandra / Hebbal, North Bengaluru',
    rera: 'PRM/KA/RERA/1251/309/PR/240514',
    baseRatePerSqft: 11800,
    defaultSqft: 2450,
    config: '4 BHK Sky Residence',
    possession: 'Immediate / OC Received',
    carpetEfficiency: '75%',
    metroDistance: '600m (Nagawara Blue Line Airport Metro)',
    waterSecurity: 'Dedicated BWSSB Line + Medical Concierge Tie-up',
    highlight: '20 mins to Kempegowda International Airport, Private Lift Lobby',
    competitors: [
      {
        name: 'L&T Raintree Boulevard (Hebbal)',
        rate: '₹13,100/sq.ft',
        carpetEfficiency: '68%',
        weakness: 'Older phase floorplans & higher per-sq.ft CAM maintenance',
        wedgePitch:
          'Prestige Camden gives you a private elevator lobby and brand-new OC-ready specs at ₹1,300/sq.ft lower entry price than L&T Raintree.'
      },
      {
        name: 'Sobha City (Thanisandra)',
        rate: '₹10,900/sq.ft',
        carpetEfficiency: '69%',
        weakness: 'High-density shared amenities & smaller balcony decks',
        wedgePitch:
          'For parents relocating, Prestige Camden offers wheelchair-friendly single-level sky villas with Manipal Hospital 4 mins away.'
      }
    ]
  },
  {
    id: 'godrej-ananda',
    name: 'Godrej Ananda Phase 3',
    corridor: 'KIADB Aerospace Park, Bagalur',
    rera: 'PRM/KA/RERA/1251/309/PR/240112',
    baseRatePerSqft: 6400,
    defaultSqft: 1280,
    config: '2.5 / Compact 3 BHK',
    possession: 'Dec 2027 (10:90 Subvention)',
    carpetEfficiency: '73%',
    metroDistance: '900m (Bagalur Cross Airport Metro Station)',
    waterSecurity: 'KIADB Industrial Grade Water Grid + Zero Flood Zone',
    highlight: 'Inside 3,000-acre KIADB Hardware & Aerospace Park, 19% YoY Appreciation',
    competitors: [
      {
        name: 'Brigade El Dorado (Aerospace Park)',
        rate: '₹6,900/sq.ft',
        carpetEfficiency: '68%',
        weakness: 'Compact bedroom dimensions (9x10 ft)',
        wedgePitch:
          'Godrej Ananda gives you a 10:90 payment plan (pay 10% now, nothing till possession) and full-sized 11x13 master bedrooms.'
      },
      {
        name: 'Provident Ecopolitan (Bagalur)',
        rate: '₹6,250/sq.ft',
        carpetEfficiency: '66%',
        weakness: 'Lower tier resale liquidity compared to Godrej brand',
        wedgePitch:
          'For virtually the same ticket price, a Tier-1 Godrej badge commands 22% higher rental yield from Boeing/Airbus expats.'
      }
    ]
  }
];

// ============================================================================
// 6 RICH REALISTIC BENGALURU LEADS (With Native Phonetic Scripts + Local Slang)
// ============================================================================
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Arjun & Sneha Kulkarni',
    phone: '+91 98450 71234',
    source: 'Meta Ad → Masal 24s Callback',
    timestamp: '4 mins ago',
    location: 'Whitefield, Bengaluru',
    propertyRequirement: '3 BHK Ready-to-Move (1,800+ sq.ft, East Vastu)',
    budget: '₹2.05 Cr – ₹2.25 Cr',
    numericBudgetCr: 2.15,
    currentRentMonthly: 65000,
    timeline: 'Immediate (Within 30 Days — Indiranagar lease expiring)',
    message:
      'Masal AI 30s Call Summary: Indiranagar lease ends next month; wife works in ITPL Whitefield. Have ₹1.65 Cr HDFC pre-approval + ₹55L liquid downpayment. Worried about Hope Farm traffic jam and hidden builder charges (PLC/clubhouse). Wants Saturday 11:00 AM site visit if all-inclusive box price is sent upfront.',
    callDurationSec: 26,
    callCostInr: 8,
    matchedProjectId: 'sobha-neopolis',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Hi Arjun! Calling from the Masal Property Desk—you just tapped our Whitefield 3BHK listing 20 seconds ago. Caught you at a good time?',
          spokenText:
            'Hi Arjun! Calling from the Masal Property Desk. You just tapped our Whitefield 3 B H K listing twenty seconds ago. Caught you at a good time?'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Whoa, that was super fast! Yeah, my Indiranagar lease ends in 30 days and Sneha works in ITPL. We have 2.15 Crore ready with HDFC pre-approval, but honestly bro, Hope Farm traffic scares us.',
          spokenText:
            'Whoa, that was super fast! Yeah, my Indiranagar lease ends in thirty days and Sneha works in I T P L. We have two point one five Crore ready with H D F C pre-approval, but honestly, Hope Farm traffic scares us.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Zero stress on Hope Farm, Arjun! Sobha Neopolis has a dedicated 800-meter service road straight to Kadugodi Metro and ITPL back-gate—you skip Hope Farm completely. Shall I WhatsApp you the zero-hidden-cost sheet and lock Saturday 11 AM for your visit?',
          spokenText:
            'Zero stress on Hope Farm, Arjun! Sobha Neopolis has a dedicated eight hundred meter service road straight to Kadugodi Metro and I T P L back gate. You skip Hope Farm completely. Shall I WhatsApp you the zero hidden cost sheet and lock Saturday eleven A M for your visit?'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Sorted! Send me the all-inclusive box-price sheet on WhatsApp right now. If there are no hidden shocks, we are 100% coming Saturday 11 AM.',
          spokenText:
            'Sorted! Send me the all inclusive box price sheet on WhatsApp right now. If there are no hidden shocks, we are one hundred percent coming Saturday eleven A M.'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Namaste Arjun bhai! Masal Property Desk se bol rahi hoon—abhi 20 second pehle aapne Whitefield 3BHK dekha tha na? Sahi time pe call kiya?',
          spokenText:
            'नमस्ते अर्जुन भाई! मसाल प्रॉपर्टी डेस्क से बोल रही हूँ, अभी बीस सेकंड पहले आपने व्हाइटफील्ड थ्री बीएचके देखा था ना? सही टाइम पे कॉल किया?'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Arre waah, kya speed hai yaar! Haan, next month Indiranagar ka lease khatam ho raha hai. 2.15 Crore ka budget ekdum ready hai HDFC loan ke saath, bas Hope Farm ke gande traffic aur builder ke chhupe charges ka lafda nahi chahiye.',
          spokenText:
            'अरे वाह, क्या स्पीड है यार! हाँ, अगले महीने इंदिरानगर का लीज़ ख़तम हो रहा है। सवा दो करोड़ का बजट एकदम रेडी है एचडीएफसी लोन के साथ, बस होप फार्म के गंदे ट्रैफिक और बिल्डर के छुपे चार्जेज का लफड़ा नहीं चाहिए।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Arre Arjun bhai, bilkul tension mat lo! Sobha Neopolis se Kadugodi Metro aur ITPL back-gate ka seedha rasta hai—Hope Farm chhoona hi nahi padega! Main abhi WhatsApp pe 100% net box-price bhej rahi hoon. Saturday subah 11 baje ki VIP visit lock kar doon?',
          spokenText:
            'अरे अर्जुन भाई, बिल्कुल टेंशन मत लो! सोभा नियोपोलिस से कडुगोडी मेट्रो और आईटीपीएल बैक-गेट का सीधा रास्ता है, होप फार्म छूना ही नहीं पड़ेगा! मैं अभी व्हाट्सऐप पे सौ प्रतिशत नेट बॉक्स प्राइस भेज रही हूँ। सैटरडे सुबह ग्यारह बजे की वीआईपी विज़िट लॉक कर दूँ?'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Ekdum bindaas! Abhi WhatsApp pe cost-sheet daalo, hum dono Saturday 11 baje pakka pahunch jayenge.',
          spokenText:
            'एकदम बिंदास! अभी व्हाट्सऐप पे कॉस्ट-शीट डालो, हम दोनों सैटरडे ग्यारह बजे पक्का पहुँच जाएंगे।'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Namaskara Arjun avare! Masal Property Desk inda mathadthidini—ega just 20 seconds hinde Whitefield 3BHK nodidralla, pakka time ge call madidini alva?',
          spokenText:
            'ನಮಸ್ಕಾರ ಅರ್ಜುನ್ ಅವರೇ! ಮಸಾಲ್ ಪ್ರಾಪರ್ಟಿ ಡೆಸ್ಕ್ ಇಂದ ಮಾತಾಡ್ತಿದೀನಿ, ಈಗ ಜಸ್ಟ್ ಇಪ್ಪತ್ತು ಸೆಕೆಂಡ್ ಹಿಂದೆ ವೈಟ್‌ಫೀಲ್ಡ್ ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ನೋಡಿದ್ರಲ್ಲ, ಪಕ್ಕಾ ಟೈಮಿಗೆ ಕಾಲ್ ಮಾಡಿದ್ದೀನಿ ಅಲ್ವಾ?'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'abbo, sakkat fast aagi call madidralla! Howdu medam, next month Indiranagar lease mugiyutte. 2.15 Crore budget ready ide, aadre Hope Farm traffic jam mattu builder extra charges Andre ne ತಲೆನೋವು guru.',
          spokenText:
            'ಅಬ್ಬೋ, ಸಕ್ಕತ್ ಫಾಸ್ಟ್ ಆಗಿ ಕಾಲ್ ಮಾಡಿದ್ರಲ್ಲ! ಹೌದು ಮೇಡಂ, ನೆಕ್ಸ್ಟ್ ಮಂತ್ ಇಂದಿರಾನಗರ ಲೀಸ್ ಮುಗಿಯುತ್ತೆ. ಎರಡು ವರೆ ಕೋಟಿ ಬಜೆಟ್ ರೆಡಿ ಇದೆ, ಆದ್ರೆ ಹೋಪ್ ಫಾರ್ಮ್ ಟ್ರಾಫಿಕ್ ಜಾಮ್ ಮತ್ತು ಬಿಲ್ಡರ್ ಎಕ್ಸ್ಟ್ರಾ ಚಾರ್ಜಸ್ ಅಂದ್ರೆನೇ ತಲೆನೋವು ಗುರು.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Scene illa bidi Arjun avare! Sobha Neopolis inda Kadugodi Metro mattu ITPL back-gate ge direct shortcut ide—Hope Farm signal touch aagalla! Fulluku transparent box-price sheet WhatsApp madthini, Saturday beligge 11 gantege site visit fix madona alva?',
          spokenText:
            'ಸೀನ್ ಇಲ್ಲ ಬಿಡಿ ಅರ್ಜುನ್ ಅವರೇ! ಶೋಭಾ ನಿಯೋಪೊಲಿಸ್ ಇಂದ ಕಾಡುಗೋಡಿ ಮೆಟ್ರೋ ಮತ್ತು ಐಟಿಪಿಎಲ್ ಬ್ಯಾಕ್ ಗೇಟ್ ಗೆ ಡೈರೆಕ್ಟ್ ಶಾರ್ಟ್‌ಕಟ್ ಇದೆ, ಹೋಪ್ ಫಾರ್ಮ್ ಸಿಗ್ನಲ್ ಟಚ್ ಆಗಲ್ಲ! ಫುಲ್ಲು ಟ್ರಾನ್ಸ್‌ಪರೆಂಟ್ ಬಾಕ್ಸ್ ಪ್ರೈಸ್ ಶೀಟ್ ವಾಟ್ಸಾಪ್ ಮಾಡ್ತೀನಿ, ಶನಿವಾರ ಬೆಳಿಗ್ಗೆ ಹನ್ನೊಂದು ಗಂಟೆಗೆ ಸೈಟ್ ವಿಸಿಟ್ ಫಿಕ್ಸ್ ಮಾಡೋಣ ಅಲ್ವಾ?'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Super medam! Eega WhatsApp alli cost sheet kalsi, Saturday 11 AM ge pakka barthivi.',
          spokenText:
            'ಸೂಪರ್ ಮೇಡಂ! ಈಗ ವಾಟ್ಸಾಪ್ ಅಲ್ಲಿ ಕಾಸ್ಟ್ ಶೀಟ್ ಕಳಿಸಿ, ಶನಿವಾರ ಹನ್ನೊಂದು ಗಂಟೆಗೆ ಪಕ್ಕಾ ಬರ್ತೀವಿ.'
        }
      ]
    },
    analysis: {
      score: 95,
      priority: 'Hot',
      urgencyTag: 'Lease Expiring in 30d • ₹2.15Cr HDFC Sanctioned',
      summary:
        'Liquid, pre-approved end-user couple relocating from Indiranagar to ITPL corridor within 30 days. Ready for Saturday 11 AM closing inspection.',
      intent: 'Immediate End-User Purchase (Verified Liquidity)',
      keyRequirements: [
        '3 BHK Ready-to-Move (1,800+ sq.ft, East Vastu preferred)',
        'Direct ITPL commute avoiding Hope Farm bottleneck',
        '100% transparent RERA Box-Price sheet (no hidden PLC/Club charges)',
        'Confirmed Saturday 11:00 AM site visit'
      ],
      objections: [
        'Peak-hour congestion at Hope Farm Junction',
        'Skepticism over post-booking builder escalations & hidden charges'
      ],
      recommendedAction:
        'Send RERA all-inclusive cost sheet on WhatsApp immediately and dispatch VIP cab confirmation for Saturday 11:00 AM.',
      suggestedResponse:
        'Hi Arjun & Sneha, wonderful speaking with you! Since your Indiranagar lease wraps up next month, I have reserved our 1,850 sq.ft East-facing 3BHK at Sobha Neopolis for your Saturday 11:00 AM visit. You will love the Kadugodi Metro back-gate access—it gets you to ITPL in 11 minutes without touching Hope Farm junction. Here is our RERA-stamped Box-Price sheet (inclusive of Clubhouse, GST, and Car Park with zero hidden fees). Shall I send the Google Maps pin?'
    }
  },
  {
    id: 'lead-2',
    name: 'Karthik Hegde (NRI - Singapore)',
    phone: '+91 98802 19400',
    source: 'Website NRI Desk → Masal 19s Callback',
    timestamp: '14 mins ago',
    location: 'Hebbal / North Bengaluru',
    propertyRequirement: '4 BHK Sky Villa near Airport for Parents (2,450 sq.ft)',
    budget: '₹3.10 Cr – ₹3.50 Cr (100% NRE Self-Funded)',
    numericBudgetCr: 3.3,
    currentRentMonthly: 85000,
    timeline: 'Flying to Bengaluru for 4 days this Thursday',
    message:
      'Masal AI 30s Call Summary: NRI VP at DBS Singapore flying to Bengaluru this Thursday for only 4 days to finalize an OC-received 4BHK near Hebbal/Airport for aging parents. 100% NRE cash payment (no bank loan delay). Needs private lift access, Manipal/Aster hospital proximity, and clear OC title.',
    callDurationSec: 29,
    callCostInr: 9,
    matchedProjectId: 'prestige-camden',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Hi Karthik! Calling from the Masal NRI Desk in Bengaluru—saw you are looking for an OC-ready 4BHK in Hebbal before your flight.',
          spokenText:
            'Hi Karthik! Calling from the Masal N R I Desk in Bengaluru. Saw you are looking for an O C ready four B H K in Hebbal before your flight.'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Yes, I land at Kempegowda Airport this Thursday morning and fly back to Singapore on Sunday night. I have 3.3 Crore ready in my NRE account, but I only want OC-received properties with senior-citizen friendly access for my parents.',
          spokenText:
            'Yes, I land at Kempegowda Airport this Thursday morning and fly back to Singapore on Sunday night. I have three point three Crore ready in my N R E account, but I only want O C received properties with senior citizen friendly access for my parents.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Prestige Camden Gardens in Hebbal is a 100% match, Karthik—OC is received, it has a private wheelchair-friendly elevator lobby, and Manipal Hospital is 4 minutes away. Can our chauffeur pick you and your parents up Thursday at 3 PM?',
          spokenText:
            'Prestige Camden Gardens in Hebbal is a one hundred percent match, Karthik. O C is received, it has a private wheelchair friendly elevator lobby, and Manipal Hospital is four minutes away. Can our chauffeur pick you and your parents up Thursday at three P M?'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Thursday 3 PM works perfectly. Send the OC certificate and legal title pack to my WhatsApp so my lawyer can verify it before I land.',
          spokenText:
            'Thursday three P M works perfectly. Send the O C certificate and legal title pack to my WhatsApp so my lawyer can verify it before I land.'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Namaste Karthik ji! Bengaluru Masal NRI Desk se bol rahi hoon—Hebbal 4BHK Sky Villa ke liye aapki enquiry aayi thi.',
          spokenText:
            'नमस्ते कार्तिक जी! बेंगलुरु मसाल एनआरआई डेस्क से बोल रही हूँ, हेब्बल फोर बीएचके स्काई विला के लिए आपकी इन्क्वायरी आई थी।'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Haan ji, main Thursday subah Singapore se Bengaluru land kar raha hoon sirf 4 din ke liye. Parents ke liye 3.3 Crore tak NRE account se full payment ready hai, bas OC-ready aur hospital ke paas hona chahiye.',
          spokenText:
            'हाँ जी, मैं थर्सडे सुबह सिंगापुर से बेंगलुरु लैंड कर रहा हूँ सिर्फ चार दिन के लिए। पेरेंट्स के लिए तीन पॉइंट तीन करोड़ तक एनआरई अकाउंट से फुल पेमेंट रेडी है, बस ओसी-रेडी और हॉस्पिटल के पास होना चाहिए।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Karthik ji, Prestige Camden Gardens ekdum sorted option hai—OC mil chuka hai, private lift lobby hai aur Manipal Hospital sirf 4 minute door hai. Thursday dopahar 3 baje aapke parents ke saath VIP preview lock kar dein?',
          spokenText:
            'कार्तिक जी, प्रेस्टीज कैमडेन गार्डन्स एकदम सॉर्टेड ऑप्शन है, ओसी मिल चुका है, प्राइवेट लिफ्ट लॉबी है और मणिपाल हॉस्पिटल सिर्फ चार मिनट दूर है। थर्सडे दोपहर तीन बजे आपके पेरेंट्स के साथ वीआईपी प्रिव्यू लॉक कर दें?'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Done! Mujhe WhatsApp par OC copy aur floorplan bhej dijiye, Thursday 3 baje milte hain.',
          spokenText:
            'डन! मुझे व्हाट्सऐप पर ओसी कॉपी और फ्लोरप्लान भेज दीजिए, थर्सडे तीन बजे मिलते हैं।'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Namaskara Karthik avare! Bengaluru Masal NRI Desk inda mathadthidini—Hebbal 4BHK Sky Villa bagge nimma message bantu.',
          spokenText:
            'ನಮಸ್ಕಾರ ಕಾರ್ತಿಕ್ ಅವರೇ! ಬೆಂಗಳೂರು ಮಸಾಲ್ ಎನ್‌ಆರ್‌ಐ ಡೆಸ್ಕ್ ಇಂದ ಮಾತಾಡ್ತಿದೀನಿ, ಹೆಬ್ಬಾಳ ಫೋರ್ ಬಿಹೆಚ್‌ಕೆ ಸ್ಕೈ ವಿಲ್ಲಾ ಬಗ್ಗೆ ನಿಮ್ಮ ಮೆಸೇಜ್ ಬಂತು.'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Howdu, naanu ee Thursday Singapore inda Bengaluru ge barthidini, bari 4 dina irthini. Appa-Amma ge Hebbal hatra OC iruva 4BHK beku, NRE account inda 3.3 Crore direct transfer madthini.',
          spokenText:
            'ಹೌದು, ನಾನು ಈ ಗುರುವಾರ ಸಿಂಗಾಪುರ್ ಇಂದ ಬೆಂಗಳೂರಿಗೆ ಬರ್ತಿದೀನಿ, ಬರೀ ನಾಲ್ಕು ದಿನ ಇರ್ತೀನಿ. ಅಪ್ಪ ಅಮ್ಮಗೆ ಹೆಬ್ಬಾಳ ಹತ್ರ ಓಸಿ ಇರುವ ಫೋರ್ ಬಿಹೆಚ್‌ಕೆ ಬೇಕು, ಎನ್‌ಆರ್‌ಐ ಅಕೌಂಟ್ ಇಂದ ಮೂರು ಕೋಟಿ ಮೂವತ್ತು ಲಕ್ಷ ಡೈರೆಕ್ಟ್ ಟ್ರಾನ್ಸ್‌ಫರ್ ಮಾಡ್ತೀನಿ.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Karthik avare, Prestige Camden Gardens nimma Appa-Amma ge ಹೇಳಿ ಮಾಡಿಸಿದ ಹಾಗಿದೆ! OC bandide, wheelchair friendly private lift ide mattu Manipal Hospital bari 4 nimisha doora. Thursday madhyahna 3 gantege car ಕಳಿಸಿಕೊಡ್ಲಾ?',
          spokenText:
            'ಕಾರ್ತಿಕ್ ಅವರೇ, ಪ್ರೆಸ್ಟೀಜ್ ಕ್ಯಾಮ್ಡೆನ್ ಗಾರ್ಡನ್ಸ್ ನಿಮ್ಮ ಅಪ್ಪ ಅಮ್ಮಗೆ ಹೇಳಿ ಮಾಡಿಸಿದ ಹಾಗಿದೆ! ಓಸಿ ಬಂದಿದೆ, ವೀಲ್‌ಚೇರ್ ಫ್ರೆಂಡ್ಲಿ ಪ್ರೈವೇಟ್ ಲಿಫ್ಟ್ ಇದೆ ಮತ್ತು ಮಣಿಪಾಲ್ ಹಾಸ್ಪಿಟಲ್ ಬರೀ ನಾಲ್ಕು ನಿಮಿಷ ದೂರ. ಗುರುವಾರ ಮಧ್ಯಾಹ್ನ ಮೂರು ಗಂಟೆಗೆ ಕಾರ್ ಕಳಿಸಿಕೊಡ್ಲಾ?'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Bahala santhosha! OC documents WhatsApp madi, Thursday 3 gantege ಸಿಗೋಣ.',
          spokenText:
            'ಬಹಳ ಸಂತೋಷ! ಓಸಿ ಡಾಕ್ಯುಮೆಂಟ್ಸ್ ವಾಟ್ಸಾಪ್ ಮಾಡಿ, ಗುರುವಾರ ಮೂರು ಗಂಟೆಗೆ ಸಿಗೋಣ.'
        }
      ]
    },
    analysis: {
      score: 98,
      priority: 'Hot',
      urgencyTag: 'Flying from Singapore Thursday • ₹3.3Cr Cash Buyer',
      summary:
        'Ultra-high-intent NRI cash buyer landing in Bengaluru for 4 days to close an OC-received 4BHK in Hebbal for his parents.',
      intent: 'NRI 100% Self-Funded Closing (4-Day Window)',
      keyRequirements: [
        'OC-Received 4 BHK Sky Villa in Hebbal / Airport Corridor',
        'Senior-citizen wheelchair friendly private lift & hospital tie-up',
        'Clean legal title pack for pre-flight lawyer review',
        'Thursday 3:00 PM chauffeur pickup for parents'
      ],
      objections: [
        'Strict 4-day window in Bengaluru—cannot waste time on under-construction sites',
        'Requires zero legal/OC ambiguity for NRE wire transfer'
      ],
      recommendedAction:
        'WhatsApp the Prestige Camden Gardens OC Certificate & FEMA NRE payment schedule now; book VIP Chauffeur for Thursday 3:00 PM.',
      suggestedResponse:
        'Hi Karthik, safe travels from Singapore! I have reserved our 2,450 sq.ft OC-received 4BHK Sky Residence at Prestige Camden Gardens (Hebbal) for you and your parents this Thursday at 3:00 PM. It features a private wheelchair-accessible lift lobby and is just 4 minutes from Manipal Hospital Hebbal. I have attached the Occupancy Certificate (OC) and legal title dossier for your lawyer—shall I arrange airport/home chauffeur pickup for Thursday?'
    }
  },
  {
    id: 'lead-3',
    name: 'Vikramaditya Rao',
    phone: '+91 99001 44821',
    source: 'Google Search → Masal 29s Callback',
    timestamp: '38 mins ago',
    location: 'Sarjapur Road, Bengaluru',
    propertyRequirement: '3 BHK Smart Home near Wipro SEZ (1,500 sq.ft)',
    budget: '₹1.30 Cr – ₹1.45 Cr',
    numericBudgetCr: 1.38,
    currentRentMonthly: 54000,
    timeline: '2 to 4 Months (Comparing 3 builders)',
    message:
      'Masal AI 30s Call Summary: Currently renting in Bellandur at ₹54,000/month. Comparing Brigade, Prestige City, and Birla on Sarjapur Road within ₹1.40 Cr. Primary hesitation is groundwater depletion/water tanker mafia in Sarjapur and fear of construction delays past 2027 while paying both rent and Pre-EMI.',
    callDurationSec: 30,
    callCostInr: 8,
    matchedProjectId: 'brigade-sanctuary',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Hello Vikramaditya! Calling from Masal Property Advisory—saw you were comparing 3BHKs near Sarjapur Road.',
          spokenText:
            'Hello Vikramaditya! Calling from Masal Property Advisory. Saw you were comparing three B H Ks near Sarjapur Road.'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Yeah, I pay 54,000 rent in Bellandur right now. I want to buy within 1.4 Crore, but everyone talks about Sarjapur water tanker dependency and builders delaying past 2027.',
          spokenText:
            'Yeah, I pay fifty four thousand rent in Bellandur right now. I want to buy within one point four Crore, but everyone talks about Sarjapur water tanker dependency and builders delaying past twenty twenty seven.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Totally valid concern! At Brigade Sanctuary, your ₹54k rent covers 65% of your EMI, and we have 48 rainwater recharge borewells plus Mivan fast-track construction for Q2 2027 delivery. Can we do a 20-minute walkthrough this Sunday?',
          spokenText:
            'Totally valid concern! At Brigade Sanctuary, your fifty four thousand rent covers sixty five percent of your E M I, and we have forty eight rainwater recharge borewells plus Mivan fast track construction for Q two twenty twenty seven delivery. Can we do a twenty minute walkthrough this Sunday?'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Namaste Vikramaditya bhai! Sarjapur Road 3BHK enquiry ke silsile mein Masal Desk se call kar rahi hoon.',
          spokenText:
            'नमस्ते विक्रमादित्य भाई! सरजापुर रोड थ्री बीएचके इन्क्वायरी के सिलसिले में मसाल डेस्क से कॉल कर रही हूँ।'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Yaar main abhi Bellandur mein 54,000 kiraya bhar raha hoon. 1.4 Crore tak budget hai par Sarjapur mein paani ke tanker ka panga aur possession delay ka darr lagta hai.',
          spokenText:
            'यार मैं अभी बेलंदूर में चौवन हज़ार किराया भर रहा हूँ। एक पॉइंट चार करोड़ तक बजट है पर सरजापुर में पानी के टैंकर का पंगा और पज़ेशन डिले का डर लगता है।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Vikramaditya bhai, Brigade Sanctuary mein 48 rainwater recharge wells aur Miyawaki forest hai—zero tanker tension! Aur aapka 54k rent hi EMI ka bada hissa nikaal dega. Sunday dopahar 3 baje site par milte hain?',
          spokenText:
            'विक्रमादित्य भाई, ब्रिगेड सैंक्चुअरी में अड़तालीस रेनवॉटर रिचार्ज वेल्स और मियावाकी फॉरेस्ट है, ज़ीरो टैंकर टेंशन! और आपका चौवन हज़ार रेंट ही ईएमआई का बड़ा हिस्सा निकाल देगा। संडे दोपहर तीन बजे साइट पर मिलते हैं?'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Namaskara Vikramaditya avare! Sarjapur Road 3BHK bagge Masal Advisory inda kare madthidini.',
          spokenText:
            'ನಮಸ್ಕಾರ ವಿಕ್ರಮಾದಿತ್ಯ ಅವರೇ! ಸರ್ಜಾಪುರ ರೋಡ್ ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ಬಗ್ಗೆ ಮಸಾಲ್ ಅಡ್ವೈಸರಿ ಇಂದ ಕರೆ ಮಾಡ್ತಿದೀನಿ.'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Medam, naanu Bellandur nalli ತಿಂಗಳಿಗೆ 54,000 rent kodthidini. 1.4 Crore olage 3BHK beku, aadre Sarjapur alli water tanker problem mattu building delay aagutte annode bhaya.',
          spokenText:
            'ಮೇಡಂ, ನಾನು ಬೆಳ್ಳಂದೂರಲ್ಲಿ ತಿಂಗಳಿಗೆ ಐವತ್ತನಾಲ್ಕು ಸಾವಿರ ರೆಂಟ್ ಕೊಡ್ತಿದೀನಿ. ಒಂದೂವರೆ ಕೋಟಿ ಒಳಗೆ ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ಬೇಕು, ಆದ್ರೆ ಸರ್ಜಾಪುರ ಅಲ್ಲಿ ವಾಟರ್ ಟ್ಯಾಂಕರ್ ಪ್ರಾಬ್ಲಮ್ ಮತ್ತು ಬಿಲ್ಡಿಂಗ್ ಡಿಲೇ ಆಗುತ್ತೆ ಅನ್ನೋದೇ ಭಯ.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Bedi sir, Brigade Sanctuary nalli 48 borewell recharge pits mattu Miyawaki forest ide, neerina samasye ಬರಲ್ಲ! Nimma ₹54k badige ne EMI ge doddadu support agutte. Ee Sunday madhyahna 3 gantege site visit madona alva?',
          spokenText:
            'ಬೇಡಿ ಸರ್, ಬ್ರಿಗೇಡ್ ಸ್ಯಾಂಕ್ಚುರಿ ನಲ್ಲಿ ನಲವತ್ತೆಂಟು ಬೋರ್‌ವೆಲ್ ರೀಚಾರ್ಜ್ ಪಿಟ್ಸ್ ಮತ್ತು ಮಿಯಾವಾಕಿ ಫಾರೆಸ್ಟ್ ಇದೆ, ನೀರಿನ ಸಮಸ್ಯೆ ಬರಲ್ಲ! ನಿಮ್ಮ ಐವತ್ತನಾಲ್ಕು ಸಾವಿರ ಬಾಡಿಗೆನೇ ಇಎಂಐ ಗೆ ದೊಡ್ಡ ಸಪೋರ್ಟ್ ಆಗುತ್ತೆ. ಈ ಭಾನುವಾರ ಮಧ್ಯಾಹ್ನ ಮೂರು ಗಂಟೆಗೆ ಸೈಟ್ ವಿಸಿಟ್ ಮಾಡೋಣ ಅಲ್ವಾ?'
        }
      ]
    },
    analysis: {
      score: 81,
      priority: 'Warm',
      urgencyTag: 'Paying ₹54k/mo Rent • Comparing 3 Builders',
      summary:
        'High-rent Bellandur tenant evaluating Tier-1 developers on Sarjapur Road; needs financial proof of Rent-to-EMI math and water infrastructure assurance.',
      intent: 'Rent-to-Ownership Upgrader (Mid-Funnel)',
      keyRequirements: [
        '3 BHK near Wipro SEZ / RGA Tech Park (~1,520 sq.ft)',
        'All-in budget ceiling of ₹1.38 Cr – ₹1.45 Cr',
        'Guaranteed Q2 2027 RERA possession with Mivan construction',
        'Zero-tanker water sustainability audit'
      ],
      objections: [
        'Fear of summer water-tanker mafia on Sarjapur Road',
        'Double burden of paying ₹54k rent + Pre-EMI if delayed'
      ],
      recommendedAction:
        'Use the Deal Desk tab to generate a Rent-vs-EMI comparison showing his ₹54k/mo rent offsets 62% of his own-home EMI, paired with the Hydrogeology Water Report.',
      suggestedResponse:
        'Hi Vikramaditya! Since you are already paying ₹54,000/month rent in Bellandur, transitioning to Brigade Sanctuary (12 mins from Wipro SEZ) means your effective net additional EMI outflow is just ~₹31k/month toward your own appreciating asset. I have attached our third-party Water Sustainability Audit (48 recharge wells + dual STP) and RERA Q2-2027 timeline commitment. Would Sunday at 3:00 PM work for a site tour?'
    }
  },
  {
    id: 'lead-4',
    name: 'Ananya Deshmukh (Founder - FinTech)',
    phone: '+91 98455 33102',
    source: 'LinkedIn Executive Ad → Masal 22s Callback',
    timestamp: '52 mins ago',
    location: 'Whitefield / Panathur ORR Corridor',
    propertyRequirement: '3 BHK + Home Office with High Acoustic Privacy',
    budget: '₹2.10 Cr – ₹2.40 Cr',
    numericBudgetCr: 2.25,
    currentRentMonthly: 72000,
    timeline: 'Within 45 Days (Tax Capital Gains Reinvestment)',
    message:
      'Masal AI 30s Call Summary: FinTech co-founder who sold ESOPs and needs to reinvest capital gains under Section 54F within 45 days. Wants a low-density 3BHK + Study with double-glazed acoustic windows for late-night US investor Zoom calls.',
    callDurationSec: 25,
    callCostInr: 8,
    matchedProjectId: 'sobha-neopolis',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Hi Ananya! Calling from Masal Advisory—saw your enquiry for a 3BHK with a dedicated home office.',
          spokenText:
            'Hi Ananya! Calling from Masal Advisory. Saw your enquiry for a three B H K with a dedicated home office.'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Hi! Yes, I have a 45-day deadline to deploy my ESOP capital gains under Section 54F. I need a quiet, low-density tower with double-glazed soundproof windows because I take US VC calls at midnight.',
          spokenText:
            'Hi! Yes, I have a forty five day deadline to deploy my E S O P capital gains under Section fifty four F. I need a quiet, low density tower with double glazed soundproof windows because I take U S V C calls at midnight.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Sobha Neopolis Tower-4 faces our internal 3-acre Greek garden with German double-glazed UPVC acoustic glass and a dedicated 11x10 study room. We can execute the RERA Agreement to Sell within 7 days for your CA!',
          spokenText:
            'Sobha Neopolis Tower four faces our internal three acre Greek garden with German double glazed U P V C acoustic glass and a dedicated study room. We can execute the RERA Agreement to Sell within seven days for your Chartered Accountant!'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Namaste Ananya! Masal Executive Desk se bol rahi hoon—aapke 3BHK + Home Office requirement ke liye call kiya.',
          spokenText:
            'नमस्ते अनन्या! मसाल एग्जीक्यूटिव डेस्क से बोल रही हूँ, आपके थ्री बीएचके और होम ऑफिस रिक्वायरमेंट के लिए कॉल किया।'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Haan, mujhe Section 54F capital gains tax bachane ke liye 45 days mein booking aur agreement complete karna hai. Raat ko US calls hoti hain toh ekdum peaceful aur soundproof ghar chahiye.',
          spokenText:
            'हाँ, मुझे सेक्शन चौवन एफ कैपिटल गेन्स टैक्स बचाने के लिए पैंतालीस दिन में बुकिंग और एग्रीमेंट कंप्लीट करना है। रात को यूएस कॉल्स होती हैं तो एकदम पीसफुल और साउंडप्रूफ घर चाहिए।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Ananya, Sobha Neopolis mein German double-glazed soundproof windows hain aur aapke CA ke liye hum 5 din mein Section 54F compliant Agreement register karwa denge!',
          spokenText:
            'अनन्या, सोभा नियोपोलिस में जर्मन डबल-ग्लेज़्ड साउंडप्रूफ विंडोज़ हैं और आपके सीए के लिए हम पाँच दिन में सेक्शन चौवन एफ कंप्लायंट एग्रीमेंट रजिस्टर करवा देंगे!'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Namaskara Ananya avare! Masal Executive Desk inda mathadthidini—3BHK with Home Office bagge kare madide.',
          spokenText:
            'ನಮಸ್ಕಾರ ಅನನ್ಯ ಅವರೇ! ಮಸಾಲ್ ಎಕ್ಸಿಕ್ಯೂಟಿವ್ ಡೆಸ್ಕ್ ಇಂದ ಮಾತಾಡ್ತಿದೀನಿ, ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ವಿತ್ ಹೋಮ್ ಆಫೀಸ್ ಬಗ್ಗೆ ಕರೆ ಮಾಡಿದೆ.'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Howdu, ESOP capital gains tax save madoke 45 days olage registration aagbeku. Raatri US client calls irutte, so full soundproof mattu peaceful flat beku.',
          spokenText:
            'ಹೌದು, ಇಸಾಪ್ ಕ್ಯಾಪಿಟಲ್ ಗೇನ್ಸ್ ಟ್ಯಾಕ್ಸ್ ಸೇವ್ ಮಾಡೋಕೆ ನಲವತ್ತೈದು ದಿನದ ಒಳಗೆ ರಿಜಿಸ್ಟ್ರೇಷನ್ ಆಗ್ಬೇಕು. ರಾತ್ರಿ ಯುಎಸ್ ಕ್ಲೈಂಟ್ ಕಾಲ್ಸ್ ಇರುತ್ತೆ, ಸೋ ಫುಲ್ ಸೌಂಡ್‌ಪ್ರೂಫ್ ಮತ್ತು ಪೀಸ್‌ಫುಲ್ ಫ್ಲಾಟ್ ಬೇಕು.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Ananya avare, Sobha Neopolis alli German double-glazed soundproof glass ide, mattu nimma CA ge bekagiruva Section 54F agreement na 5 dinadalli ready madikodthivi!',
          spokenText:
            'ಅನನ್ಯ ಅವರೇ, ಶೋಭಾ ನಿಯೋಪೊಲಿಸ್ ಅಲ್ಲಿ ಜರ್ಮನ್ ಡಬಲ್ ಗ್ಲೇಜ್ಡ್ ಸೌಂಡ್‌ಪ್ರೂಫ್ ಗ್ಲಾಸ್ ಇದೆ, ಮತ್ತು ನಿಮ್ಮ ಸಿಎ ಗೆ ಬೇಕಾಗಿರುವ ಸೆಕ್ಷನ್ ಐವತ್ತನಾಲ್ಕು ಎಫ್ ಅಗ್ರಿಮೆಂಟ್ ನ ಐದು ದಿನದಲ್ಲಿ ರೆಡಿ ಮಾಡಿಕೊಡ್ತೀವಿ!'
        }
      ]
    },
    analysis: {
      score: 91,
      priority: 'Hot',
      urgencyTag: 'Section 54F Tax Deadline (45d) • ESOP Liquidity',
      summary:
        'FinTech founder with liquid ESOP proceeds facing a hard 45-day Section 54F capital gains reinvestment deadline.',
      intent: 'Tax-Driven Immediate Purchase (Section 54F)',
      keyRequirements: [
        '3 BHK + Dedicated Acoustic Study Room for midnight US Zoom calls',
        'Fast-track Agreement to Sell execution within 7–10 days for CA tax filing',
        'Low-density internal garden-facing unit away from main road noise'
      ],
      objections: [
        'Cannot afford slow builder legal paperwork due to Section 54F tax window',
        'Sensitive to construction or road noise during work calls'
      ],
      recommendedAction:
        'Connect her CA directly with our Legal Desk for a 5-day Section 54F Agreement turnaround and schedule a quiet weekday morning visit.',
      suggestedResponse:
        'Hi Ananya! Congratulations on your ESOP liquidity event. To meet your 45-day Section 54F capital gains timeline, our legal desk at Sobha Neopolis can execute and stamp your registered Agreement to Sell within 5 business days. Even better, our internal garden-facing 3BHK+Study comes fitted with German double-glazed acoustic windows (42 dB noise reduction) for your midnight US calls. Can we do a private walkthrough tomorrow morning?'
    }
  },
  {
    id: 'lead-5',
    name: 'Suresh & Kavitha Gowda',
    phone: '+91 94480 61129',
    source: 'Property Portal → Masal 27s Callback',
    timestamp: '1 hour ago',
    location: 'Bagalur / KIADB Aerospace Park, North Bengaluru',
    propertyRequirement: 'Compact 3 BHK Investment Unit (High Rental Yield)',
    budget: '₹85 Lakhs – ₹98 Lakhs',
    numericBudgetCr: 0.92,
    currentRentMonthly: 35000,
    timeline: '1 to 3 Months (Seeking 10:90 Subvention)',
    message:
      'Masal AI 30s Call Summary: Senior PSU engineer couple in Malleshwaram looking to invest ₹90 Lakhs in North Bengaluru Aerospace Park for rental income from Boeing/Airbus engineers. Interested in 10:90 payment scheme so they only pay 10% now.',
    callDurationSec: 27,
    callCostInr: 8,
    matchedProjectId: 'godrej-ananda',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Namaskara Suresh sir! Calling from Masal Desk regarding your North Bengaluru Aerospace Park investment inquiry.',
          spokenText:
            'Namaskara Suresh sir! Calling from Masal Desk regarding your North Bengaluru Aerospace Park investment inquiry.'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Yes, we live in Malleshwaram and want to invest around 90 Lakhs near the Boeing and Airbus campus for rental yield, ideally with a 10:90 payment plan.',
          spokenText:
            'Yes, we live in Malleshwaram and want to invest around ninety Lakhs near the Boeing and Airbus campus for rental yield, ideally with a ten ninety payment plan.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Godrej Ananda Phase-3 is right inside the 3,000-acre KIADB Aerospace Park, Suresh sir! You pay just ₹9 Lakhs now (10%) and nothing until possession, with 19% annual appreciation.',
          spokenText:
            'Godrej Ananda Phase three is right inside the three thousand acre K I A D B Aerospace Park, Suresh sir! You pay just nine Lakhs now and nothing until possession, with nineteen percent annual appreciation.'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Namaste Suresh sir! North Bengaluru Aerospace Park investment ke liye Masal Desk se call kar rahi hoon.',
          spokenText:
            'नमस्ते सुरेश सर! नॉर्थ बेंगलुरु एयरोस्पेस पार्क इन्वेस्टमेंट के लिए मसाल डेस्क से कॉल कर रही हूँ।'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Haan, hum Malleshwaram mein rehte hain aur 90 Lakhs ke andar Boeing campus ke paas 10:90 scheme mein flat dekh rahe hain.',
          spokenText:
            'हाँ, हम मल्लेश्वरम में रहते हैं और नब्बे लाख के अंदर बोइंग कैंपस के पास दस नब्बे स्कीम में फ्लैट देख रहे हैं।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Suresh sir, Godrej Ananda Phase-3 mein abhi sirf 10% yaani 9 Lakhs dena hai, baaki सीधा possession pe! Boeing engineers se ₹42,000/month rent mil raha hai.',
          spokenText:
            'सुरेश सर, गोदरेज आनंदा फेज थ्री में अभी सिर्फ दस प्रतिशत यानी नौ लाख देना है, बाकी सीधा पज़ेशन पे! बोइंग इंजीनियर्स से बयालीस हज़ार महीना रेंट मिल रहा है।'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Namaskara Suresh sir! Malleshwaram inda North Bengaluru Aerospace Park investment bagge enquiry madidralla?',
          spokenText:
            'ನಮಸ್ಕಾರ ಸುರೇಶ್ ಸರ್! ಮಲ್ಲೇಶ್ವರಂ ಇಂದ ನಾರ್ತ್ ಬೆಂಗಳೂರು ಏರೋಸ್ಪೇಸ್ ಪಾರ್ಕ್ ಇನ್ವೆಸ್ಟ್‌ಮೆಂಟ್ ಬಗ್ಗೆ ಎನ್ಕ್ವೈರಿ ಮಾಡಿದ್ರಲ್ಲ?'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Howdu amma, Boeing mattu Airbus company hatra ₹90 Lakhs olage ondu 3BHK investment madona antha iddivi. 10:90 payment scheme idre olledu.',
          spokenText:
            'ಹೌದು ಅಮ್ಮ, ಬೋಯಿಂಗ್ ಮತ್ತು ಏರ್‌ಬಸ್ ಕಂಪನಿ ಹತ್ರ ತೊಂಬತ್ತು ಲಕ್ಷ ಒಳಗೆ ಒಂದು ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ಇನ್ವೆಸ್ಟ್‌ಮೆಂಟ್ ಮಾಡೋಣ ಅಂತ ಇದ್ದೀವಿ. ಟೆನ್ ನೈಂಟಿ ಪೇಮೆಂಟ್ ಸ್ಕೀಮ್ ಇದ್ರೆ ಒಳ್ಳೇದು.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Suresh sir, Godrej Ananda Phase-3 ನೇರವಾಗಿ KIADB Aerospace Park ಒಳಗೇ ಇದೆ! Eega bari 10% (₹9 Lakhs) kodi, ulididdu possession time alli. Boeing engineers inda ₹42,000 rent pakka sigutte!',
          spokenText:
            'ಸುರೇಶ್ ಸರ್, ಗೋದ್ರೇಜ್ ಆನಂದ ಫೇಸ್ ತ್ರೀ ನೇರವಾಗಿ ಕೆಐಎಡಿಬಿ ಏರೋಸ್ಪೇಸ್ ಪಾರ್ಕ್ ಒಳಗೇ ಇದೆ! ಈಗ ಬರೀ ಹತ್ತು ಪರ್ಸೆಂಟ್ ಅಂದ್ರೆ ಒಂಬತ್ತು ಲಕ್ಷ ಕೊಡಿ, ಉಳಿದಿದ್ದು ಪಸೆಷನ್ ಟೈಮ್ ಅಲ್ಲಿ. ಬೋಯಿಂಗ್ ಇಂಜಿನಿಯರ್ಸ್ ಇಂದ ನಲವತ್ತೆರಡು ಸಾವಿರ ರೆಂಟ್ ಪಕ್ಕಾ ಸಿಗುತ್ತೆ!'
        }
      ]
    },
    analysis: {
      score: 74,
      priority: 'Warm',
      urgencyTag: '10:90 Subvention Investor • ₹90L KIADB Aerospace',
      summary:
        'Malleshwaram investor couple seeking a ₹90L 10:90 subvention apartment inside KIADB Aerospace Park for high corporate rental yield.',
      intent: 'Yield & Capital Appreciation Investor',
      keyRequirements: [
        'Compact 3 BHK within ₹88L – ₹95L all-inclusive',
        '10:90 developer subvention payment plan (No Pre-EMI burden)',
        'Walking distance to Boeing / Airbus / Shell tech campuses'
      ],
      objections: [
        'Wants assurance that tenant demand in Bagalur will absorb supply in 2027',
        'Prefers not to travel from Malleshwaram in heavy weekday traffic'
      ],
      recommendedAction:
        'Share the 10:90 Subvention Cashflow Sheet and arrange a Sunday morning pickup from Malleshwaram via Hebbal flyover (30 mins).',
      suggestedResponse:
        'Namaskara Suresh Sir & Kavitha Madam! For your ₹90 Lakhs investment goal, Godrej Ananda Phase-3 inside KIADB Aerospace Park offers our 10:90 Subvention Plan—you invest just ₹8.9 Lakhs (10%) today with zero EMI until possession. With Boeing and Airbus employing 15,000+ engineers right across the road, current 3BHK rentals are clocking ₹40k–₹44k/month. Shall I send a car to Malleshwaram this Sunday morning at 10:00 AM?'
    }
  },
  {
    id: 'lead-6',
    name: 'Rohan Mehra',
    phone: '+91 97312 00918',
    source: 'Instagram Reel → Masal 24s Callback',
    timestamp: '3 hours ago',
    location: 'Indiranagar / Central Bengaluru',
    propertyRequirement: '4 BHK Independent Villa with Private Lawn',
    budget: '₹80 Lakhs – ₹85 Lakhs Max',
    numericBudgetCr: 0.85,
    currentRentMonthly: 28000,
    timeline: 'Late 2027 (Just checking market prices)',
    message:
      'Masal AI 30s Call Summary: Clicked Instagram Reel. Wants a 4BHK luxury villa in Indiranagar or Koramangala under ₹85 Lakhs total budget. No loan sanction yet, browsing casually for late 2027.',
    callDurationSec: 24,
    callCostInr: 8,
    matchedProjectId: 'godrej-ananda',
    diffHistory: [],
    voiceDialogue: {
      english: [
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Hi Rohan! Following up on your Instagram enquiry for a property in Bengaluru.',
          spokenText:
            'Hi Rohan! Following up on your Instagram enquiry for a property in Bengaluru.'
        },
        {
          speaker: 'buyer',
          lang: 'en-IN',
          displayText:
            'Yeah, I want a 4BHK villa in Indiranagar with a lawn. My max budget is 85 Lakhs and I might buy late next year.',
          spokenText:
            'Yeah, I want a four B H K villa in Indiranagar with a lawn. My max budget is eighty five Lakhs and I might buy late next year.'
        },
        {
          speaker: 'agent',
          lang: 'en-IN',
          displayText:
            'Thanks for sharing, Rohan! Just to give you transparent market data: Indiranagar villas start above 8 Crore today, but within your 85 Lakh budget, Godrej Ananda in North Bengaluru Aerospace Park offers 19% annual growth. I will WhatsApp you the investment deck!',
          spokenText:
            'Thanks for sharing, Rohan! Just to give you transparent market data: Indiranagar villas start above eight Crore today, but within your eighty five Lakh budget, Godrej Ananda in North Bengaluru Aerospace Park offers nineteen percent annual growth. I will WhatsApp you the investment deck!'
        }
      ],
      hindi: [
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Hi Rohan! Instagram enquiry ke liye Masal Desk se call kar rahi hoon.',
          spokenText:
            'हाय रोहन! इंस्टाग्राम इन्क्वायरी के लिए मसाल डेस्क से कॉल कर रही हूँ।'
        },
        {
          speaker: 'buyer',
          lang: 'hi-IN',
          displayText:
            'Mujhe Indiranagar mein 85 Lakhs ke andar 4BHK villa chahiye, next year end tak dekhenge.',
          spokenText:
            'मुझे इंदिरानगर में पचासी लाख के अंदर फोर बीएचके विला चाहिए, नेक्स्ट ईयर एंड तक देखेंगे।'
        },
        {
          speaker: 'agent',
          lang: 'hi-IN',
          displayText:
            'Rohan bhai, Indiranagar mein villas 8 Crore se upar hain, lekin 85 Lakhs mein North Bengaluru Aerospace Park mein Godrej ka शानदार 3BHK mil raha hai. Main WhatsApp par details bhej rahi hoon!',
          spokenText:
            'रोहन भाई, इंदिरानगर में विलाज़ आठ करोड़ से ऊपर हैं, लेकिन पचासी लाख में नॉर्थ बेंगलुरु एयरोस्पेस पार्क में गोदरेज का शानदार थ्री बीएचके मिल रहा है। मैं व्हाट्सऐप पर डिटेल्स भेज रही हूँ!'
        }
      ],
      kannada: [
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Hello Rohan! Instagram reel enquiry bagge Masal Desk inda kare madthidini.',
          spokenText:
            'ಹಲೋ ರೋಹನ್! ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ರೀಲ್ ಎನ್ಕ್ವೈರಿ ಬಗ್ಗೆ ಮಸಾಲ್ ಡೆಸ್ಕ್ ಇಂದ ಕರೆ ಮಾಡ್ತಿದೀನಿ.'
        },
        {
          speaker: 'buyer',
          lang: 'kn-IN',
          displayText:
            'Indiranagar nalli 85 Lakhs olage 4BHK villa beku, next year end ge plan.',
          spokenText:
            'ಇಂದಿರಾನಗರ ನಲ್ಲಿ ಎಂಬತ್ತೈದು ಲಕ್ಷ ಒಳಗೆ ಫೋರ್ ಬಿಹೆಚ್‌ಕೆ ವಿಲ್ಲಾ ಬೇಕು, ನೆಕ್ಸ್ಟ್ ಇಯರ್ ಎಂಡ್ ಗೆ ಪ್ಲಾನ್.'
        },
        {
          speaker: 'agent',
          lang: 'kn-IN',
          displayText:
            'Rohan avare, Indiranagar villa 8 Crore mele ide. Aadre 85 Lakhs budget ge North Bengaluru Aerospace Park nalli Godrej 3BHK sigutte. WhatsApp alli brochure kalsidini!',
          spokenText:
            'ರೋಹನ್ ಅವರೇ, ಇಂದಿರಾನಗರ ವಿಲ್ಲಾ ಎಂಟು ಕೋಟಿ ಮೇಲೆ ಇದೆ. ಆದ್ರೆ ಎಂಬತ್ತೈದು ಲಕ್ಷ ಬಜೆಟ್ ಗೆ ನಾರ್ತ್ ಬೆಂಗಳೂರು ಏರೋಸ್ಪೇಸ್ ಪಾರ್ಕ್ ನಲ್ಲಿ ಗೋದ್ರೇಜ್ ತ್ರೀ ಬಿಹೆಚ್‌ಕೆ ಸಿಗುತ್ತೆ. ವಾಟ್ಸಾಪ್ ಅಲ್ಲಿ ಬ್ರೋಷರ್ ಕಳಿಸಿದೀನಿ!'
        }
      ]
    },
    analysis: {
      score: 22,
      priority: 'Cold',
      urgencyTag: 'Severe Price-to-Location Mismatch • Do Not Dispatch Closer',
      summary:
        'Unrealistic price anchor (expecting an ₹8+ Cr Central Bengaluru villa for ₹85 Lakhs) with a 12+ month browsing horizon.',
      intent: 'Casual Window Shopper / Unrealistic Anchor',
      keyRequirements: [
        'Hard budget ceiling of ₹85 Lakhs',
        'Aspirational 4 BHK requirement',
        'Late 2027 timeline'
      ],
      objections: [
        'Unaware of Central Bengaluru per-sq.ft land prices (₹22,000+/sq.ft)',
        'No near-term buying readiness'
      ],
      recommendedAction:
        'Do not allocate human closer time or cab pickup. Pivot automatically via WhatsApp to North Bengaluru (Bagalur Aerospace Park) ₹85L apartment inventory.',
      suggestedResponse:
        'Hi Rohan, thanks for connecting on Instagram! For transparent market context, independent villas in Indiranagar currently trade above ₹8.0 Cr. However, your ₹85 Lakhs budget is right in the sweet spot for Godrej Ananda inside North Bengaluru’s KIADB Aerospace Park—which is delivering 19% YoY capital appreciation. I have shared the Aerospace Park investment brochure on WhatsApp for your review!'
    }
  }
];

// ============================================================================
// UTILITY: CLEAN JSON PARSER FOR NEMOTRON 120B
// ============================================================================
function parseNemotronJSON(rawText) {
  if (!rawText) return null;
  const stripped = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(stripped.slice(start, end + 1));
  }
  return JSON.parse(stripped);
}

// ============================================================================
// UTILITY: WEB AUDIO TELEPHONY RING SYNTHESIZER
// ============================================================================
function playTelephonyRingTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.value = 400;
    osc2.frequency.value = 450;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio context restrictions
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================
export default function App() {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('masal_editorial_leads_v3');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [selectedLeadId, setSelectedLeadId] = useState(() => leads[0]?.id || 'lead-1');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Distinct Workspace Modes
  // 'brief' | 'voiceSim' | 'semanticDiff' | 'dealDesk' | 'battleMatrix' | 'cadencePass'
  const [activeMode, setActiveMode] = useState('brief');

  // API Key & FDE Telemetry State
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('masal_nvidia_key_v3') || DEFAULT_NVIDIA_KEY
  );
  const [showFdeDrawer, setShowFdeDrawer] = useState(false);
  const [telemetryLog, setTelemetryLog] = useState({
    model: NEMOTRON_MODEL,
    latencyMs: 440,
    status: '200 OK (NVIDIA NIM Proxy Ready)',
    reasoningPreview:
      'Evaluated HDFC pre-approval liquidity (₹1.65Cr + ₹55L downpayment) + 30-day Indiranagar lease expiry deadline → Scored 95/100 (Hot).',
    lastPayload: null
  });

  // New Lead Modal State
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [intakeForm, setIntakeForm] = useState({
    name: '',
    location: '',
    propertyRequirement: '',
    budget: '',
    timeline: '',
    message: ''
  });

  // Custom Feature #1: Live 30s Voice Call Simulator + Live Roleplay State
  const [callLang, setCallLang] = useState('english'); // 'english' | 'hindi' | 'kannada'
  const [isPlayingCall, setIsPlayingCall] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState(-1);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isGeneratingFreshCall, setIsGeneratingFreshCall] = useState(false);
  const [liveAgentInput, setLiveAgentInput] = useState('');
  const [isBuyerResponding, setIsBuyerResponding] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const callAbortRef = useRef(false);
  const recognitionRef = useRef(null);

  // Custom Feature #2: Post-Call Semantic Diff & Live Re-Scoring State
  const [rawBrokerNote, setRawBrokerNote] = useState('');
  const [isApplyingDiff, setIsApplyingDiff] = useState(false);

  // Custom Feature #3: Interactive Financial Deal Desk State
  const [carpetSqft, setCarpetSqft] = useState(1850);
  const [floorLevel, setFloorLevel] = useState(12);
  const [downpaymentPct, setDownpaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.55);

  // Conversational Copilot Drawer / Section State
  const [chatByLead, setChatByLead] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [isChatBusy, setIsChatBusy] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const chatBottomRef = useRef(null);

  // Save leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('masal_editorial_leads_v3', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Load high-quality neural voices from browser
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setAvailableVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Stop voice playback when changing lead or language
  useEffect(() => {
    callAbortRef.current = true;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingCall(false);
    setActiveTurnIndex(-1);
  }, [selectedLeadId, callLang]);

  // Ranked & Filtered Leads (Requirement #4)
  const rankedLeads = useMemo(() => {
    return [...leads]
      .filter((l) => {
        if (priorityFilter !== 'ALL' && l.analysis?.priority?.toUpperCase() !== priorityFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            l.name.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q) ||
            l.propertyRequirement.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0));
  }, [leads, priorityFilter, searchQuery]);

  const activeLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || rankedLeads[0] || leads[0],
    [leads, selectedLeadId, rankedLeads]
  );

  const matchedProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === activeLead?.matchedProjectId) || PROJECTS[0];
  }, [activeLead]);

  // Auto-generate context-aware Post-Call Note from the LAST conversation turn!
  const dynamicLastConvoSummaryNote = useMemo(() => {
    if (!activeLead) return '';
    const turns =
      activeLead.voiceDialogue?.[callLang] || activeLead.voiceDialogue?.english || [];
    const lastBuyerTurn = [...turns].reverse().find((t) => t.speaker === 'buyer');
    const lastAgentTurn = [...turns].reverse().find((t) => t.speaker === 'agent');
    if (!lastBuyerTurn) return '';
    return `Post-Call Sync (${callLang.toUpperCase()} Call): Buyer stated "${
      lastBuyerTurn.displayText || lastBuyerTurn.text
    }" following Agent pitch "${(lastAgentTurn?.displayText || '').slice(
      0,
      70
    )}...". Ready to advance stage & lock site visit.`;
  }, [activeLead, callLang]);

  // Sync Deal Desk sliders when switching leads
  useEffect(() => {
    if (matchedProject) {
      setCarpetSqft(matchedProject.defaultSqft);
      setFloorLevel(10);
      setDownpaymentPct(20);
    }
  }, [matchedProject?.id, selectedLeadId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatByLead, selectedLeadId, activeMode]);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1800);
  };

  // ==========================================================================
  // NATIVE PHONETIC VOICE SELECTION & SPEAKING ENGINE (Fixes Pronunciation!)
  // ==========================================================================
  const selectBestVoice = (langCode, speakerRole) => {
    if (!availableVoices.length) return null;
    const prefix = langCode.split('-')[0].toLowerCase(); // 'en', 'hi', 'kn'

    // 1. Exact language match (e.g., kn-IN or hi-IN)
    let matchingLang = availableVoices.filter((v) =>
      v.lang.toLowerCase().startsWith(prefix)
    );

    // 2. If browser lacks a dedicated Kannada pack, fall back to Hindi/Indian English neural voice
    if (matchingLang.length === 0) {
      matchingLang = availableVoices.filter(
        (v) =>
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('heera')
      );
    }

    const pool = matchingLang.length > 0 ? matchingLang : availableVoices;

    const naturalVoices = pool.filter(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Neural') ||
        v.name.includes('Online') ||
        v.name.includes('Google') ||
        v.name.includes('Swara') ||
        v.name.includes('Sapna') ||
        v.name.includes('Neerja') ||
        v.name.includes('Heera') ||
        v.name.includes('Prabhat') ||
        v.name.includes('Madhur')
    );

    const bestPool = naturalVoices.length > 0 ? naturalVoices : pool;
    if (speakerRole === 'buyer' && bestPool.length > 1) {
      return bestPool[1];
    }
    return bestPool[0];
  };

  const speakSingleTurn = (turn) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      // CRITICAL FIX: Speak `spokenText` (Native Kannada/Devanagari script) so pronunciation is 100% authentic!
      const textToSpeak = turn.spokenText || turn.displayText || turn.text;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      const chosenVoice = selectBestVoice(turn.lang || 'en-IN', turn.speaker);
      if (chosenVoice) utter.voice = chosenVoice;
      utter.lang = turn.lang || 'en-IN';

      if (turn.speaker === 'agent') {
        utter.rate = 1.03;
        utter.pitch = 1.08;
      } else {
        utter.rate = 0.96;
        utter.pitch = 0.88;
      }

      utter.onend = () => setTimeout(resolve, 260);
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  };

  const handlePlaySimulatedCall = async () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingCall) {
      callAbortRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlayingCall(false);
      setActiveTurnIndex(-1);
      return;
    }

    const turns =
      activeLead?.voiceDialogue?.[callLang] || activeLead?.voiceDialogue?.english || [];
    if (!turns.length) return;

    callAbortRef.current = false;
    setIsPlayingCall(true);

    playTelephonyRingTone();
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < turns.length; i++) {
      if (callAbortRef.current) break;
      setActiveTurnIndex(i);
      await speakSingleTurn(turns[i]);
    }

    setIsPlayingCall(false);
    setActiveTurnIndex(-1);
  };

  // ==========================================================================
  // LIVE DYNAMIC CALL GENERATOR: EVERY TIME GENERATES A DIFFERENT CONVO!
  // ==========================================================================
  const handleGenerateFreshCallScenario = async () => {
    if (!activeLead) return;
    setIsGeneratingFreshCall(true);
    const t0 = performance.now();

    const angles = [
      'Angle A: Buyer is at the airport/office, super pressed for time, tests the agent on hidden charges and floor-rise PLC before agreeing to a weekend visit.',
      'Angle B: Buyer’s spouse jumps on the call asking tough questions about East-facing Vastu, water supply, and commute time during monsoon.',
      'Angle C: Buyer is actively sitting at a competing builder’s experience center right now and asks why they shouldn’t book the competitor today.',
      'Angle D: Buyer wants to negotiate an immediate spot-booking discount if they bring a cheque tomorrow morning at 10:30 AM.'
    ];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];

    const langSpec =
      callLang === 'kannada'
        ? `Language: Authentic Bengaluru Kanglish / Kannada.
CRITICAL: For each turn, provide:
- "displayText": Natural Bengaluru Kanglish in Latin script using authentic local expressions ("Namaskara", "Scene illa bidi", "Sakkat", "Fulluku transparent", "Pakka", "Guru/Sir", "ಮೇಡಂ").
- "spokenText": The EXACT same dialogue written in pure Kannada script (ಕನ್ನಡ ಲಿಪಿ) so the kn-IN neural voice pronounces every word natively!`
        : callLang === 'hindi'
        ? `Language: Authentic Urban Hinglish / Hindi.
CRITICAL: For each turn, provide:
- "displayText": Natural conversational Hinglish in Latin script using real slang ("Arre bhai", "Ekdum sorted hai", "Lafda nahi chahiye", "Bindaas", "Pakka").
- "spokenText": The EXACT same dialogue written in pure Devanagari Hindi script (देवनागरी हिंदी) so the hi-IN neural voice pronounces every word with native Indian intonation!`
        : `Language: Crisp Bengaluru Urban Indian English (en-IN).
For each turn, provide "displayText" and "spokenText" (spell out abbreviations like "3 B H K", "I T P L", "H D F C" in spokenText for natural TTS).`;

    const prompt = `You are Masal AI's Live Voice Call Simulator. Generate a brand-new, realistic 4-turn 30-second phone dialogue between the Masal AI Voice Agent ("agent") and the Buyer ("buyer": ${activeLead.name}).
Scenario Twist (Make it fresh and different!): ${randomAngle}
Buyer Context: Seeking ${activeLead.propertyRequirement} in ${activeLead.location}, Budget ${activeLead.budget}, Timeline ${activeLead.timeline}. Matched Project: ${matchedProject.name} (${matchedProject.highlight}).
${langSpec}

Return ONLY valid JSON matching this schema:
{
  "turns": [
    {
      "speaker": "agent",
      "lang": "${callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN'}",
      "displayText": "<text shown in UI>",
      "spokenText": "<native script text for TTS audio engine>"
    },
    {
      "speaker": "buyer",
      "lang": "${callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN'}",
      "displayText": "<text shown in UI>",
      "spokenText": "<native script text for TTS audio engine>"
    },
    {
      "speaker": "agent",
      "lang": "${callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN'}",
      "displayText": "<text shown in UI>",
      "spokenText": "<native script text for TTS audio engine>"
    },
    {
      "speaker": "buyer",
      "lang": "${callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN'}",
      "displayText": "<text shown in UI>",
      "spokenText": "<native script text for TTS audio engine>"
    }
  ]
}`;

    let generatedTurns = null;

    try {
      const res = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: NEMOTRON_MODEL,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          temperature: 0.85,
          top_p: 0.95,
          max_tokens: 1800,
          chat_template_kwargs: { enable_thinking: true },
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        const msg = data.choices?.[0]?.message || {};
        const parsed = parseNemotronJSON(msg.content || '');
        if (parsed?.turns?.length) {
          generatedTurns = parsed.turns;
          setTelemetryLog({
            model: NEMOTRON_MODEL,
            latencyMs: Math.round(performance.now() - t0),
            status: `200 OK (Fresh ${callLang.toUpperCase()} Call Generated)`,
            reasoningPreview:
              msg.reasoning_content?.slice(0, 300) ||
              `Synthesized dynamic ${randomAngle.slice(0, 60)}...`,
            lastPayload: parsed
          });
        }
      }
    } catch (e) {
      console.warn('Dynamic call fallback:', e);
    }

    if (generatedTurns) {
      setLeads((prev) =>
        prev.map((l) => {
          if (l.id !== activeLead.id) return l;
          return {
            ...l,
            voiceDialogue: {
              ...l.voiceDialogue,
              [callLang]: generatedTurns
            }
          };
        })
      );
    }

    setIsGeneratingFreshCall(false);
  };

  // ==========================================================================
  // LIVE INTERACTIVE BUYER ROLEPLAY: SPEAK OR TYPE TO BUYER ON THE SPOT!
  // ==========================================================================
  const handleLiveAgentSpeakTurn = async (overrideText) => {
    const pitchText = (overrideText ?? liveAgentInput).trim();
    if (!pitchText || !activeLead) return;

    const langCode =
      callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN';
    const currentTurns =
      activeLead.voiceDialogue?.[callLang] || activeLead.voiceDialogue?.english || [];

    const newAgentTurn = {
      speaker: 'agent',
      lang: langCode,
      displayText: pitchText,
      spokenText: pitchText
    };

    const updatedTurnsWithAgent = [...currentTurns, newAgentTurn];

    setLeads((prev) =>
      prev.map((l) =>
        l.id === activeLead.id
          ? {
              ...l,
              voiceDialogue: {
                ...l.voiceDialogue,
                [callLang]: updatedTurnsWithAgent
              }
            }
          : l
      )
    );
    setLiveAgentInput('');
    setIsBuyerResponding(true);

    const prompt = `You are roleplaying LIVE on a phone call as the real estate buyer "${activeLead.name}" in Bengaluru.
Your Profile: Looking for ${activeLead.propertyRequirement} in ${activeLead.location}, Budget: ${activeLead.budget}, Timeline: ${activeLead.timeline}.
Your Objections: ${activeLead.analysis.objections.join('; ')}.

Conversation so far:
${updatedTurnsWithAgent.map((t) => `${t.speaker.toUpperCase()}: ${t.displayText || t.text}`).join('\n')}

Respond naturally in 1–2 spoken sentences as the buyer reacting to what the agent just said!
${
  callLang === 'kannada'
    ? 'Use authentic Bengaluru Kanglish in "displayText" (e.g. "Howdu sir, aadre...", "Pakka", "Sari bidi") and pure Kannada script (ಕನ್ನಡ) in "spokenText".'
    : callLang === 'hindi'
    ? 'Use authentic Hinglish in "displayText" (e.g. "Arre sahi hai yaar, par...", "Bindaas", "Pakka") and pure Devanagari Hindi script (देवनागरी) in "spokenText".'
    : 'Use natural Indian English in both "displayText" and "spokenText".'
}

Return ONLY valid JSON:
{
  "displayText": "<buyer response in UI>",
  "spokenText": "<buyer response in native script for TTS>"
}`;

    let buyerReply = {
      displayText:
        callLang === 'kannada'
          ? 'Sari bidi! Aa point clear aaytu. WhatsApp alli final cost-sheet kalsi, naale beligge site visit madona.'
          : callLang === 'hindi'
          ? 'Chalo yeh baat toh ekdum sahi boli aapne! WhatsApp pe final sheet bhejo, hum kal subah site visit pe milte hain.'
          : 'That actually clears up my doubt! Send that across on WhatsApp right away and let us lock the site visit.',
      spokenText:
        callLang === 'kannada'
          ? 'ಸರಿ ಬಿಡಿ! ಆ ಪಾಯಿಂಟ್ ಕ್ಲಿಯರ್ ಆಯ್ತು. ವಾಟ್ಸಾಪ್ ಅಲ್ಲಿ ಫೈನಲ್ ಕಾಸ್ಟ್ ಶೀಟ್ ಕಳಿಸಿ, ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಸೈಟ್ ವಿಸಿಟ್ ಮಾಡೋಣ.'
          : callLang === 'hindi'
          ? 'चलो यह बात तो एकदम सही बोली आपने! व्हाट्सऐप पे फाइनल शीट भेजो, हम कल सुबह साइट विज़िट पे मिलते हैं।'
          : 'That actually clears up my doubt! Send that across on WhatsApp right away and let us lock the site visit.'
    };

    try {
      const res = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: NEMOTRON_MODEL,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          temperature: 0.7,
          max_tokens: 600,
          chat_template_kwargs: { enable_thinking: true },
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = parseNemotronJSON(data.choices?.[0]?.message?.content || '');
        if (parsed?.displayText) {
          buyerReply = parsed;
        }
      }
    } catch (e) {
      console.warn('Live buyer roleplay fallback:', e);
    }

    const buyerTurnObj = {
      speaker: 'buyer',
      lang: langCode,
      displayText: buyerReply.displayText,
      spokenText: buyerReply.spokenText || buyerReply.displayText
    };

    const finalTurns = [...updatedTurnsWithAgent, buyerTurnObj];

    setLeads((prev) =>
      prev.map((l) =>
        l.id === activeLead.id
          ? {
              ...l,
              voiceDialogue: {
                ...l.voiceDialogue,
                [callLang]: finalTurns
              }
            }
          : l
      )
    );

    setIsBuyerResponding(false);
    // Automatically speak the buyer's live response out loud!
    setActiveTurnIndex(finalTurns.length - 1);
    await speakSingleTurn(buyerTurnObj);
    setActiveTurnIndex(-1);
  };

  // Web Speech Recognition (Microphone Input for Live Call)
  const handleToggleMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition requires Chrome or Edge.');
      return;
    }

    if (isListeningMic) {
      recognitionRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    const rec = new SpeechRec();
    rec.lang = callLang === 'kannada' ? 'kn-IN' : callLang === 'hindi' ? 'hi-IN' : 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setIsListeningMic(true);
    rec.onend = () => setIsListeningMic(false);
    rec.onerror = () => setIsListeningMic(false);
    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript.trim()) {
        setLiveAgentInput(transcript);
        handleLiveAgentSpeakTurn(transcript);
      }
    };
    recognitionRef.current = rec;
    rec.start();
  };

  // ==========================================================================
  // AI CALL #1: NEW LEAD INTAKE ANALYSIS VIA NVIDIA NEMOTRON 120B
  // ==========================================================================
  const handleCreateNewLead = async (e) => {
    e.preventDefault();
    if (!intakeForm.name.trim() || !intakeForm.message.trim()) return;

    setIsSubmittingLead(true);
    const t0 = performance.now();

    const prompt = `You are Masal AI's Lead Qualification & Revenue Intelligence Engine for Bengaluru Real Estate.
Analyze this inbound lead and return ONLY a valid JSON object.

Available RERA Projects:
${JSON.stringify(PROJECTS.map((p) => ({ id: p.id, name: p.name, corridor: p.corridor })), null, 2)}

Inbound Lead:
- Name: ${intakeForm.name}
- Location: ${intakeForm.location}
- Requirement: ${intakeForm.propertyRequirement}
- Budget: ${intakeForm.budget}
- Timeline: ${intakeForm.timeline}
- Inquiry / Call Transcript: "${intakeForm.message}"

Return ONLY valid JSON matching this schema:
{
  "score": <number 1-99>,
  "priority": <"Hot" | "Warm" | "Cold">,
  "urgencyTag": <concise 5-8 word urgency tag>,
  "summary": <1-2 crisp sentences summarizing buyer readiness and core need>,
  "intent": <short buyer intent classification>,
  "keyRequirements": [<3-4 specific bullet points>],
  "objections": [<2-3 specific objections or risks>],
  "recommendedAction": <1 concrete next step for the salesperson>,
  "suggestedResponse": <ready-to-send WhatsApp message addressing their objections>,
  "matchedProjectId": <"sobha-neopolis" | "brigade-sanctuary" | "prestige-camden" | "godrej-ananda">,
  "numericBudgetCr": <estimated budget in Crores as a number, e.g. 1.85>
}`;

    let parsed = null;

    try {
      const res = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: NEMOTRON_MODEL,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          temperature: 0.4,
          top_p: 0.95,
          max_tokens: 2048,
          chat_template_kwargs: { enable_thinking: true },
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        const msg = data.choices?.[0]?.message || {};
        parsed = parseNemotronJSON(msg.content || '');
        setTelemetryLog({
          model: NEMOTRON_MODEL,
          latencyMs: Math.round(performance.now() - t0),
          status: '200 OK (NVIDIA NIM Live)',
          reasoningPreview:
            msg.reasoning_content?.slice(0, 320) ||
            'Analyzed buyer liquidity, timeline urgency, and RERA corridor match.',
          lastPayload: parsed
        });
      }
    } catch (err) {
      console.warn('Fallback used:', err);
    }

    if (!parsed) {
      const textLower = `${intakeForm.budget} ${intakeForm.timeline} ${intakeForm.message}`.toLowerCase();
      const isHot =
        textLower.includes('immediate') ||
        textLower.includes('30 days') ||
        textLower.includes('approved') ||
        textLower.includes('saturday') ||
        textLower.includes('this week');
      parsed = {
        score: isHot ? 92 : 74,
        priority: isHot ? 'Hot' : 'Warm',
        urgencyTag: `${intakeForm.timeline} • ${intakeForm.budget}`,
        summary: `${intakeForm.name} is looking for ${intakeForm.propertyRequirement} in ${intakeForm.location} within ${intakeForm.budget} (${intakeForm.timeline}).`,
        intent: isHot ? 'High-Intent Immediate Buyer' : 'Active Evaluative Buyer',
        keyRequirements: [
          `${intakeForm.propertyRequirement} in ${intakeForm.location}`,
          `Budget bracket: ${intakeForm.budget}`,
          `Target timeline: ${intakeForm.timeline}`
        ],
        objections: [
          'Needs transparent all-inclusive RERA cost sheet',
          'Wants clarity on possession timeline and commute access'
        ],
        recommendedAction: `Schedule weekend site inspection and WhatsApp the all-inclusive cost sheet for ${intakeForm.location}.`,
        suggestedResponse: `Hi ${intakeForm.name}, thanks for speaking with us! Based on your requirement for ${intakeForm.propertyRequirement} in ${intakeForm.location} (${intakeForm.budget}), I have shortlisted our top RERA-verified units and prepared a transparent all-inclusive cost sheet. Would Saturday at 11 AM work for a site visit?`,
        matchedProjectId: 'sobha-neopolis',
        numericBudgetCr: 1.85
      };
    }

    const firstName = intakeForm.name.trim().split(' ')[0];
    const createdLead = {
      id: `lead-${Date.now()}`,
      name: intakeForm.name.trim(),
      phone: '+91 9845' + Math.floor(100000 + Math.random() * 899999),
      source: 'Direct Intake → Masal 25s Callback',
      timestamp: 'Just now',
      location: intakeForm.location.trim(),
      propertyRequirement: intakeForm.propertyRequirement.trim(),
      budget: intakeForm.budget.trim(),
      numericBudgetCr: Number(parsed.numericBudgetCr) || 1.8,
      currentRentMonthly: 55000,
      timeline: intakeForm.timeline.trim(),
      message: intakeForm.message.trim(),
      callDurationSec: 25,
      callCostInr: 8,
      matchedProjectId: parsed.matchedProjectId || 'sobha-neopolis',
      diffHistory: [],
      voiceDialogue: {
        english: [
          {
            speaker: 'agent',
            lang: 'en-IN',
            displayText: `Hi ${firstName}! Calling from Masal Property Desk within 30 seconds of your ${intakeForm.location} enquiry.`,
            spokenText: `Hi ${firstName}! Calling from Masal Property Desk within thirty seconds of your ${intakeForm.location} enquiry.`
          },
          {
            speaker: 'buyer',
            lang: 'en-IN',
            displayText: intakeForm.message.trim(),
            spokenText: intakeForm.message.trim()
          },
          {
            speaker: 'agent',
            lang: 'en-IN',
            displayText: `Got it, ${firstName}! I have prepared the 100% transparent RERA cost sheet within ${intakeForm.budget} and blocked a VIP site visit slot for you.`,
            spokenText: `Got it, ${firstName}! I have prepared the one hundred percent transparent RERA cost sheet within ${intakeForm.budget} and blocked a V I P site visit slot for you.`
          }
        ],
        hindi: INITIAL_LEADS[0].voiceDialogue.hindi,
        kannada: INITIAL_LEADS[0].voiceDialogue.kannada
      },
      analysis: {
        score: parsed.score,
        priority: parsed.priority,
        urgencyTag: parsed.urgencyTag,
        summary: parsed.summary,
        intent: parsed.intent,
        keyRequirements: parsed.keyRequirements,
        objections: parsed.objections,
        recommendedAction: parsed.recommendedAction,
        suggestedResponse: parsed.suggestedResponse
      }
    };

    setLeads((prev) => [createdLead, ...prev]);
    setSelectedLeadId(createdLead.id);
    setIsSubmittingLead(false);
    setShowIntakeModal(false);
    setIntakeForm({
      name: '',
      location: '',
      propertyRequirement: '',
      budget: '',
      timeline: '',
      message: ''
    });
  };

  // ==========================================================================
  // CUSTOM FEATURE #2: LIVE POST-CALL SEMANTIC DIFF & RE-SCORING ENGINE
  // ==========================================================================
  const handleApplySemanticDiff = async (presetNote) => {
    const noteText = (presetNote ?? rawBrokerNote).trim();
    if (!noteText || !activeLead) return;

    setIsApplyingDiff(true);
    const t0 = performance.now();

    const lastTurns = (
      activeLead.voiceDialogue?.[callLang] ||
      activeLead.voiceDialogue?.english ||
      []
    )
      .slice(-2)
      .map((t) => `${t.speaker.toUpperCase()}: ${t.displayText || t.text}`)
      .join(' | ');

    const prompt = `You are Masal AI's Semantic Diff & Dynamic Lead Re-Scoring Engine.
Compare the CURRENT LEAD STATE and LAST CALL TRANSCRIPT with the NEW POST-CALL BROKER NOTE, extract exact field mutations, and recalculate the AI Lead Score and Priority.

CURRENT LEAD STATE:
- Name: ${activeLead.name}
- Location: ${activeLead.location}
- Requirement: ${activeLead.propertyRequirement}
- Budget: ${activeLead.budget}
- Timeline: ${activeLead.timeline}
- Current Score: ${activeLead.analysis.score} (${activeLead.analysis.priority})
- Last Call Turns: "${lastTurns}"

NEW BROKER POST-CALL NOTE:
"${noteText}"

Return ONLY valid JSON with this exact schema:
{
  "updatedLocation": <updated location string or existing if unchanged>,
  "updatedRequirement": <updated requirement string or existing if unchanged>,
  "updatedBudget": <updated budget string or existing if unchanged>,
  "updatedTimeline": <updated timeline string or existing if unchanged>,
  "newScore": <recalculated score 1-99>,
  "newPriority": <"Hot" | "Warm" | "Cold">,
  "newUrgencyTag": <updated 5-8 word urgency tag>,
  "newSummary": <updated 1-2 sentence executive summary reflecting the latest call>,
  "newRecommendedAction": <updated immediate next step>,
  "newSuggestedResponse": <updated WhatsApp follow-up referencing what was just agreed on the call>,
  "mutations": [
    {
      "field": <"Budget" | "Timeline" | "Location" | "Requirement" | "Lead Score">,
      "before": <previous value>,
      "after": <new value>
    }
  ]
}`;

    let diffResult = null;

    try {
      const res = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: NEMOTRON_MODEL,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          temperature: 0.3,
          max_tokens: 1500,
          chat_template_kwargs: { enable_thinking: true },
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        const msg = data.choices?.[0]?.message || {};
        diffResult = parseNemotronJSON(msg.content || '');
        setTelemetryLog({
          model: NEMOTRON_MODEL,
          latencyMs: Math.round(performance.now() - t0),
          status: '200 OK (Semantic Diff Executed)',
          reasoningPreview:
            msg.reasoning_content?.slice(0, 300) ||
            'Computed semantic state delta from post-call transcript & notes.',
          lastPayload: diffResult
        });
      }
    } catch (e) {
      console.warn('Semantic diff fallback:', e);
    }

    if (!diffResult) {
      await new Promise((r) => setTimeout(r, 600));
      const nLower = noteText.toLowerCase();
      const scoreBoost =
        nLower.includes('cheque') ||
        nLower.includes('booking') ||
        nLower.includes('confirmed') ||
        nLower.includes('advance') ||
        nLower.includes('lock')
          ? 97
          : nLower.includes('dropped') || nLower.includes('pause')
          ? 56
          : Math.min(99, activeLead.analysis.score + 4);
      const newPrio = scoreBoost >= 85 ? 'Hot' : scoreBoost >= 55 ? 'Warm' : 'Cold';

      diffResult = {
        updatedLocation: activeLead.location,
        updatedRequirement: activeLead.propertyRequirement,
        updatedBudget: nLower.includes('2.35')
          ? '₹2.35 Cr (Upgraded for Higher Floor)'
          : nLower.includes('1.65')
          ? '₹1.65 Cr (Revised Cap)'
          : activeLead.budget,
        updatedTimeline: nLower.includes('sunday')
          ? 'Confirmed Site Visit: Sunday 11:00 AM'
          : nLower.includes('saturday')
          ? 'Locked VIP Visit: Saturday 11:00 AM'
          : activeLead.timeline,
        newScore: scoreBoost,
        newPriority: newPrio,
        newUrgencyTag: `Post-Call Synced • Score ${scoreBoost}/100`,
        newSummary: `${activeLead.analysis.summary} [Latest Call Sync: ${noteText.slice(0, 90)}...]`,
        newRecommendedAction: `Execute commitment from latest call and dispatch VIP Gate Pass on WhatsApp.`,
        newSuggestedResponse: `Hi ${activeLead.name.split(' ')[0]}, thank you for our conversation just now! I have updated your dossier (${noteText.slice(0, 70)}...) and attached your VIP Site-Visit Gate Pass along with the final RERA box-price sheet.`,
        mutations: [
          {
            field: 'Last Call Status',
            before: activeLead.timeline,
            after: noteText.slice(0, 52)
          },
          {
            field: 'AI Lead Score',
            before: `${activeLead.analysis.score} (${activeLead.analysis.priority})`,
            after: `${scoreBoost} (${newPrio})`
          }
        ]
      };
    }

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== activeLead.id) return l;
        return {
          ...l,
          location: diffResult.updatedLocation || l.location,
          propertyRequirement: diffResult.updatedRequirement || l.propertyRequirement,
          budget: diffResult.updatedBudget || l.budget,
          timeline: diffResult.updatedTimeline || l.timeline,
          diffHistory: [
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              rawNote: noteText,
              mutations: diffResult.mutations || []
            },
            ...(l.diffHistory || [])
          ],
          analysis: {
            ...l.analysis,
            score: diffResult.newScore ?? l.analysis.score,
            priority: diffResult.newPriority || l.analysis.priority,
            urgencyTag: diffResult.newUrgencyTag || l.analysis.urgencyTag,
            summary: diffResult.newSummary || l.analysis.summary,
            recommendedAction: diffResult.newRecommendedAction || l.analysis.recommendedAction,
            suggestedResponse: diffResult.newSuggestedResponse || l.analysis.suggestedResponse
          }
        };
      })
    );

    setRawBrokerNote('');
    setIsApplyingDiff(false);
  };

  // ==========================================================================
  // CUSTOM FEATURE #3: FINANCIAL DEAL DESK CALCULATIONS
  // ==========================================================================
  const dealCalculations = useMemo(() => {
    const baseCost = carpetSqft * matchedProject.baseRatePerSqft;
    const floorRiseRate = floorLevel > 5 ? (floorLevel - 5) * 35 : 0;
    const floorRiseTotal = carpetSqft * floorRiseRate;
    const clubhouseAndInfra = 450000;
    const gstAndStamp = (baseCost + floorRiseTotal) * 0.06;
    const allInclusiveBoxPrice = baseCost + floorRiseTotal + clubhouseAndInfra + gstAndStamp;

    const downpaymentAmount = allInclusiveBoxPrice * (downpaymentPct / 100);
    const loanPrincipal = allInclusiveBoxPrice - downpaymentAmount;

    const monthlyRate = interestRate / 12 / 100;
    const months = 240;
    const emi =
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const currentRent = activeLead?.currentRentMonthly || 50000;
    const netMonthlyDelta = Math.max(0, Math.round(emi - currentRent));

    return {
      allInclusiveCr: (allInclusiveBoxPrice / 10000000).toFixed(2),
      downpaymentLakhs: (downpaymentAmount / 100000).toFixed(1),
      loanPrincipalCr: (loanPrincipal / 10000000).toFixed(2),
      monthlyEmiInr: Math.round(emi),
      currentRentInr: currentRent,
      netDeltaInr: netMonthlyDelta,
      floorRiseLakhs: (floorRiseTotal / 100000).toFixed(2)
    };
  }, [carpetSqft, floorLevel, downpaymentPct, interestRate, matchedProject, activeLead]);

  // ==========================================================================
  // CONTEXT-GROUNDED CONVERSATIONAL COPILOT (Requirement #3)
  // ==========================================================================
  const handleSendCopilot = async (quickQuestion) => {
    const q = (quickQuestion ?? chatInput).trim();
    if (!q || !activeLead) return;

    const leadId = activeLead.id;
    const history = chatByLead[leadId] || [];
    const nextHistory = [...history, { role: 'user', content: q }];

    setChatByLead((prev) => ({ ...prev, [leadId]: nextHistory }));
    if (!quickQuestion) setChatInput('');
    setIsChatBusy(true);

    let reply = '';
    try {
      const sysPrompt = `You are Masal AI's Senior Real Estate Closing Strategist in Bengaluru.
Answer the salesperson's question strictly using this specific buyer's live context:
- Buyer: ${activeLead.name} (${activeLead.analysis.priority}, Score: ${activeLead.analysis.score}/100)
- Location & Unit: ${activeLead.location} | ${activeLead.propertyRequirement}
- Budget & Timeline: ${activeLead.budget} | ${activeLead.timeline}
- Transcript: "${activeLead.message}"
- Objections: ${activeLead.analysis.objections.join('; ')}
- Matched RERA Project: ${matchedProject.name} (${matchedProject.corridor}, ${matchedProject.highlight})
- Calculated All-In Price: ₹${dealCalculations.allInclusiveCr} Cr (Est. EMI: ₹${dealCalculations.monthlyEmiInr.toLocaleString('en-IN')}/mo)

Keep your response sharp, tactical, and ready to speak or WhatsApp on a live call.`;

      const res = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: NEMOTRON_MODEL,
          messages: [
            { role: 'system', content: sysPrompt },
            ...nextHistory.map((m) => ({
              role: m.role,
              content: [{ type: 'text', text: m.content }]
            }))
          ],
          temperature: 0.55,
          max_tokens: 900,
          chat_template_kwargs: { enable_thinking: true },
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content || '';
        reply = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      }
    } catch (e) {
      console.warn('Copilot fallback:', e);
    }

    if (!reply) {
      await new Promise((r) => setTimeout(r, 450));
      reply = `For **${activeLead.name}** (${activeLead.budget}, ${activeLead.timeline}):\n\n1. **Lead with ${matchedProject.name}:** Emphasize *"${matchedProject.highlight}"* which directly neutralizes their concern around *${activeLead.analysis.objections[0]}*.\n2. **Anchor on Net Outflow:** Show them the ₹${dealCalculations.allInclusiveCr} Cr all-inclusive box price where their ₹${dealCalculations.currentRentInr.toLocaleString('en-IN')}/mo rent already covers the majority of the EMI.\n3. **Close for the Slot:** Lock a firm weekend 11:00 AM walkthrough before releasing the East-facing inventory hold.`;
    }

    setChatByLead((prev) => ({
      ...prev,
      [leadId]: [...nextHistory, { role: 'assistant', content: reply }]
    }));
    setIsChatBusy(false);
  };

  const getPriorityBadgeStyle = (priority) => {
    if (priority === 'Hot') {
      return 'bg-[#D94E28]/10 text-[#B83918] border-[#D94E28]/30';
    }
    if (priority === 'Warm') {
      return 'bg-[#B45309]/10 text-[#92400E] border-[#B45309]/30';
    }
    return 'bg-[#78756E]/10 text-[#57544E] border-[#78756E]/30';
  };

  const activeChatMessages = chatByLead[activeLead?.id] || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141413]">
      {/* =================================================================== */}
      {/* TOP EDITORIAL HEADER BAR                                            */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E2D8] px-6 py-3.5">
        <div className="max-w-[1580px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#141413] text-[#FAF8F5] flex items-center justify-center font-serif-display text-xl tracking-tight shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-base tracking-tight text-[#141413]">
                  MASAL AI
                </span>
                <span className="text-[11px] font-mono-code uppercase tracking-widest px-2 py-0.5 rounded bg-[#EAE6DC] text-[#4A4843]">
                  Revenue & Voice Studio
                </span>
              </div>
              <p className="text-xs text-[#6E6A63] hidden sm:block">
                30-Second Multilingual Voice Qualification → Human Closer Command Desk
              </p>
            </div>
          </div>

          {/* Live Masal Telemetry Strip */}
          <div className="hidden xl:flex items-center gap-6 text-xs border border-[#E6E2D8] bg-white px-4 py-2 rounded-lg shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D94E28] animate-pulse" />
              <span className="text-[#6E6A63]">Callback SLA:</span>
              <span className="font-mono-code font-semibold text-[#141413]">24.8s avg</span>
            </div>
            <div className="h-3.5 w-[1px] bg-[#E6E2D8]" />
            <div className="flex items-center gap-2">
              <span className="text-[#6E6A63]">Native Neural TTS:</span>
              <span className="font-semibold text-[#141413]">EN • हिंदी • ಕನ್ನಡ</span>
            </div>
            <div className="h-3.5 w-[1px] bg-[#E6E2D8]" />
            <div className="flex items-center gap-2">
              <span className="text-[#6E6A63]">Active Pipeline:</span>
              <span className="font-mono-code font-semibold text-[#D94E28]">
                {leads.filter((l) => l.analysis?.priority === 'Hot').length} Hot
              </span>
              <span className="text-[#9E9A90]">/ {leads.length} Leads</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowFdeDrawer(!showFdeDrawer)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                showFdeDrawer
                  ? 'bg-[#141413] text-white border-[#141413]'
                  : 'bg-white text-[#3D3B37] border-[#DCD7CC] hover:border-[#141413]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>FDE Telemetry</span>
            </button>

            <button
              onClick={() => setShowIntakeModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D94E28] hover:bg-[#B83918] text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ingest New Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* FDE LIVE TELEMETRY DRAWER                                           */}
      {/* =================================================================== */}
      {showFdeDrawer && (
        <div className="bg-[#141413] text-[#FAF8F5] border-b border-[#2E2D2A] px-6 py-4">
          <div className="max-w-[1580px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-center text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                Active Model & Reverse Proxy
              </div>
              <div className="font-mono-code text-sm font-semibold">
                {telemetryLog.model} ({telemetryLog.latencyMs}ms)
              </div>
              <div className="text-[#9E9A90] text-[11px]">
                Endpoint: <code>/api/nvidia/v1/chat/completions</code> • Status:{' '}
                <span className="text-[#E6A15C]">{telemetryLog.status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#9E9A90]">
                Nemotron Chain-of-Thought Trace
              </div>
              <p className="text-[11px] text-[#D6D2C8] line-clamp-2 font-mono-code">
                {telemetryLog.reasoningPreview}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem('masal_nvidia_key_v3', e.target.value);
                }}
                placeholder="nvapi-..."
                className="bg-[#242320] border border-[#3D3B37] rounded-lg px-3 py-1.5 text-xs font-mono-code text-white w-64 focus:outline-none focus:border-[#D94E28]"
              />
              <button
                onClick={() => setShowFdeDrawer(false)}
                className="px-3 py-1.5 rounded-lg bg-[#2E2D2A] hover:bg-[#3D3B37] text-xs cursor-pointer"
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SPACIOUS 2-PANE EDITORIAL WORKSPACE                                 */}
      {/* =================================================================== */}
      <main className="flex-1 max-w-[1580px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* ----------------------------------------------------------------- */}
        {/* LEFT PANE (4 COLS): 6-LEAD PRIORITIZED INBOX                      */}
        {/* ----------------------------------------------------------------- */}
        <aside className="lg:col-span-4 border-r border-[#E6E2D8] bg-[#F5F2EB]/60 flex flex-col">
          <div className="p-5 border-b border-[#E6E2D8] space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#57544E]">
                AI-Prioritized Lead Queue ({rankedLeads.length})
              </h2>
              <button
                onClick={() => {
                  localStorage.removeItem('masal_editorial_leads_v3');
                  setLeads(INITIAL_LEADS);
                  setSelectedLeadId(INITIAL_LEADS[0].id);
                }}
                className="text-[11px] text-[#6E6A63] hover:text-[#141413] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset 6 Demo Leads
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by buyer, locality, NRI, BHK..."
                className="w-full bg-white border border-[#DCD7CC] rounded-lg pl-8 pr-3 py-2 text-xs text-[#141413] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#141413]"
              />
            </div>

            <div className="grid grid-cols-4 gap-1 bg-[#EAE6DC] p-1 rounded-lg text-xs font-semibold">
              {['ALL', 'HOT', 'WARM', 'COLD'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPriorityFilter(tab)}
                  className={`py-1.5 rounded-md transition cursor-pointer ${
                    priorityFilter === tab
                      ? 'bg-white text-[#141413] shadow-2xs'
                      : 'text-[#6E6A63] hover:text-[#141413]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E6E2D8] overflow-y-auto max-h-[calc(100vh-210px)]">
            {rankedLeads.map((lead, idx) => {
              const selected = lead.id === activeLead?.id;
              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full text-left p-5 transition relative cursor-pointer ${
                    selected
                      ? 'bg-white shadow-xs border-l-4 border-l-[#D94E28]'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-[11px] text-[#8C877E]">
                          0{idx + 1}
                        </span>
                        <h3 className="font-bold text-sm text-[#141413]">{lead.name}</h3>
                      </div>
                      <p className="text-xs text-[#57544E] mt-1 line-clamp-1">
                        {lead.propertyRequirement}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadgeStyle(
                            lead.analysis?.priority
                          )}`}
                        >
                          {lead.analysis?.priority}
                        </span>
                        <span className="font-serif-display text-2xl leading-none text-[#141413]">
                          {lead.analysis?.score}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-code text-[#8C877E]">
                        {lead.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#57544E] mt-3 pt-2.5 border-t border-[#EFECE6]">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#8C877E]" />
                      {lead.location}
                    </span>
                    <span className="font-mono-code font-semibold text-[#141413]">
                      {lead.budget.split('(')[0]}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] font-medium text-[#B83918] flex items-center gap-1">
                    <span>→</span>
                    <span className="truncate">{lead.analysis?.urgencyTag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT PANE (8 COLS): SPACIOUS EDITORIAL LEAD CANVAS               */}
        {/* ----------------------------------------------------------------- */}
        {activeLead && (
          <section className="lg:col-span-8 p-6 lg:p-10 space-y-7 overflow-y-auto">
            {/* 1. LEAD EXECUTIVE HEADER */}
            <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 lg:p-8 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getPriorityBadgeStyle(
                        activeLead.analysis?.priority
                      )}`}
                    >
                      {activeLead.analysis?.priority} Priority
                    </span>
                    <span className="text-xs font-mono-code text-[#6E6A63]">
                      {activeLead.source} • ₹{activeLead.callCostInr} Connected Call (
                      {activeLead.callDurationSec}s)
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#141413]">
                    {activeLead.name}
                  </h1>
                  <p className="text-xs font-mono-code text-[#6E6A63]">
                    {activeLead.phone} • Buyer Intent:{' '}
                    <strong className="text-[#141413]">{activeLead.analysis?.intent}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl px-5 py-3">
                  <div>
                    <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#6E6A63]">
                      AI Lead Score
                    </div>
                    <div className="text-xs font-medium text-[#D94E28]">
                      {activeLead.analysis?.urgencyTag}
                    </div>
                  </div>
                  <div className="font-serif-display text-5xl leading-none text-[#141413]">
                    {activeLead.analysis?.score}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EFECE6]">
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                    Preferred Locality
                  </span>
                  <p className="text-sm font-semibold text-[#141413] mt-0.5">
                    {activeLead.location}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                    Configuration
                  </span>
                  <p className="text-sm font-semibold text-[#141413] mt-0.5">
                    {activeLead.propertyRequirement}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                    Stated Budget
                  </span>
                  <p className="text-sm font-mono-code font-bold text-[#D94E28] mt-0.5">
                    {activeLead.budget}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                    Buying Horizon
                  </span>
                  <p className="text-sm font-semibold text-[#141413] mt-0.5">
                    {activeLead.timeline}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 6-MODULE WORKSPACE NAVIGATION BAR */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E6E2D8] pb-3">
              {[
                { id: 'brief', label: '1. AI Brief & Copilot', icon: Sparkles },
                { id: 'voiceSim', label: '2. Live Voice Studio (EN/HI/KN)', icon: PhoneCall },
                { id: 'semanticDiff', label: '3. Post-Call Semantic Diff', icon: GitCompare },
                { id: 'dealDesk', label: '4. Financial Deal Desk', icon: Calculator },
                { id: 'battleMatrix', label: '5. Competitor Battlematrix', icon: Swords },
                { id: 'cadencePass', label: '6. VIP Pass & Drip Cadence', icon: QrCode }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMode(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? 'bg-[#141413] text-white shadow-xs'
                        : 'bg-white text-[#57544E] border border-[#E6E2D8] hover:border-[#141413] hover:text-[#141413]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ============================================================= */}
            {/* MODULE 1: 3-SECOND AI BRIEF + CONTEXT-GROUNDED COPILOT        */}
            {/* ============================================================= */}
            {activeMode === 'brief' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 bg-white border border-[#E6E2D8] rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                      AI Executive Summary
                    </span>
                    <p className="text-base text-[#141413] leading-relaxed font-medium">
                      {activeLead.analysis?.summary}
                    </p>
                    <div className="pt-3 border-t border-[#EFECE6]">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E] block mb-1">
                        Raw Inquiry / Masal 30s Call Transcript Summary
                      </span>
                      <p className="text-xs text-[#57544E] italic leading-relaxed">
                        "{activeLead.message}"
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-[#141413] text-[#FAF8F5] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                        Recommended Next Action
                      </span>
                      <p className="text-base font-semibold leading-snug text-white">
                        {activeLead.analysis?.recommendedAction}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#2E2D2A] flex items-center justify-between text-xs">
                      <span className="text-[#9E9A90]">Matched RERA Project:</span>
                      <button
                        onClick={() => setActiveMode('dealDesk')}
                        className="font-semibold text-[#E6A15C] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{matchedProject.name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Requirements & Objections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#141413] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#141413]" />
                      <span>Verified Buyer Requirements</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {activeLead.analysis?.keyRequirements?.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-[#3D3B37] flex items-start gap-2.5 leading-snug"
                        >
                          <span className="font-mono-code text-xs text-[#8C877E] mt-0.5">
                            0{i + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#B83918] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#D94E28]" />
                      <span>Objections & Friction Points</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {activeLead.analysis?.objections?.map((obj, i) => (
                        <li
                          key={i}
                          className="text-sm text-[#3D3B37] flex items-start gap-2.5 leading-snug"
                        >
                          <span className="font-mono-code text-xs text-[#D94E28] mt-0.5">!</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggested Customer Response */}
                <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                      Suggested Customer Response (Ready for WhatsApp / Email)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyText(activeLead.analysis?.suggestedResponse, 'suggested')
                        }
                        className="px-3 py-1.5 rounded-lg border border-[#DCD7CC] hover:border-[#141413] text-xs font-semibold text-[#141413] flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedId === 'suggested' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#D94E28]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          activeLead.analysis?.suggestedResponse || ''
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-[#141413] hover:bg-[#2E2D2A] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <span>Dispatch on WhatsApp</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-[#242320] leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#EFECE6]">
                    {activeLead.analysis?.suggestedResponse}
                  </p>
                </div>

                {/* Integrated Context-Grounded Copilot right inside the Brief view */}
                <div className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-[#EFECE6] bg-[#FAF8F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                          Interactive Lead-Grounded Copilot
                        </span>
                        <h3 className="text-sm font-bold text-[#141413]">
                          Ask Nemotron 120B about closing {activeLead.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'What should I emphasize on the call?',
                        'Make my reply more assertive and urgent',
                        'How do I counter their primary objection?',
                        'Draft a Saturday 11 AM VIP cab pickup message'
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSendCopilot(chip)}
                          className="text-xs px-3 py-1 rounded-full bg-white border border-[#DCD7CC] hover:border-[#141413] text-[#141413] transition cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeChatMessages.length > 0 && (
                    <div className="p-5 max-h-[320px] overflow-y-auto space-y-3">
                      {activeChatMessages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                              m.role === 'user'
                                ? 'bg-[#141413] text-white'
                                : 'bg-[#FAF8F5] border border-[#E6E2D8] text-[#141413]'
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {isChatBusy && (
                        <div className="text-xs font-mono-code text-[#6E6A63] flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D94E28]" />
                          <span>Nemotron 120B reasoning over {activeLead.name}'s context...</span>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendCopilot();
                    }}
                    className="p-4 border-t border-[#EFECE6] bg-[#FAF8F5] flex items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ask a follow-up question about ${activeLead.name}...`}
                      className="flex-1 bg-white border border-[#DCD7CC] rounded-xl px-4 py-2.5 text-sm text-[#141413] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#141413]"
                    />
                    <button
                      type="submit"
                      disabled={isChatBusy || !chatInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                      <span>Ask Copilot</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* MODULE 2: LIVE MULTILINGUAL VOICE STUDIO & BUYER ROLEPLAY     */}
            {/* ============================================================= */}
            {activeMode === 'voiceSim' && (
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 lg:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EFECE6] pb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                      Native Script Phonetic TTS + Live Buyer Roleplay
                    </span>
                    <h3 className="text-xl font-bold text-[#141413]">
                      30-Second Inbound Voice Call Studio ({activeLead.name})
                    </h3>
                    <p className="text-xs text-[#6E6A63]">
                      Uses native Devanagari (`hi-IN`) & Kannada (`kn-IN`) phonetic scripts for
                      authentic pronunciation + local Bengaluru/Hindi slang. Click{' '}
                      <strong>Regenerate Fresh Scenario</strong> for a brand-new conversation on
                      the spot!
                    </p>
                  </div>

                  {/* Language Switcher */}
                  <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E6E2D8]">
                    {[
                      { id: 'english', label: 'English (en-IN)' },
                      { id: 'hindi', label: 'हिंदी / Hinglish (hi-IN)' },
                      { id: 'kannada', label: 'ಕನ್ನಡ / Kanglish (kn-IN)' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setCallLang(l.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          callLang === l.id
                            ? 'bg-[#141413] text-white'
                            : 'text-[#57544E] hover:text-[#141413]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Player Bar + Dynamic Scenario Regenerator */}
                <div className="bg-[#141413] text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlaySimulatedCall}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition cursor-pointer ${
                        isPlayingCall
                          ? 'bg-[#D94E28] text-white'
                          : 'bg-white text-[#141413] hover:bg-[#EAE6DC]'
                      }`}
                    >
                      {isPlayingCall ? (
                        <Square className="w-5 h-5 fill-current" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="text-sm font-bold">
                        {isPlayingCall
                          ? 'Playing Native Neural Dual-Speaker Call...'
                          : 'Play Full Qualification Call'}
                      </div>
                      <div className="text-xs font-mono-code text-[#9E9A90]">
                        Phonetic Engine: {callLang.toUpperCase()} Native Script • Click any turn
                        below to hear it solo
                      </div>
                    </div>
                  </div>

                  {/* Regenerate Unscripted Call Button */}
                  <button
                    onClick={handleGenerateFreshCallScenario}
                    disabled={isGeneratingFreshCall}
                    className="px-4 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingFreshCall ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing New Call Twist...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>⚡ Regenerate Fresh Live Call Scenario (Nemotron 120B)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Synchronized Multi-Turn Dialogue Transcript */}
                <div className="space-y-3">
                  {(
                    activeLead.voiceDialogue?.[callLang] ||
                    activeLead.voiceDialogue?.english ||
                    []
                  ).map((turn, idx) => {
                    const isCurrent = activeTurnIndex === idx;
                    const isAgent = turn.speaker === 'agent';
                    return (
                      <div
                        key={idx}
                        onClick={() => speakSingleTurn(turn)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FAF8F5] border-[#D94E28] shadow-xs'
                            : 'bg-white border-[#EFECE6] hover:border-[#DCD7CC]'
                        }`}
                        title="Click to play this turn with native phonetic voice"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-mono-code uppercase tracking-widest font-bold ${
                              isAgent ? 'text-[#D94E28]' : 'text-[#141413]'
                            }`}
                          >
                            {isAgent
                              ? 'Masal AI Voice Agent (Neural TTS)'
                              : `${activeLead.name} (Buyer)`}
                          </span>
                          <span className="text-[10px] font-mono-code text-[#8C877E] flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            {isCurrent ? 'Speaking now...' : 'Tap to play'}
                          </span>
                        </div>

                        {/* Slang / Romanized Display Text */}
                        <p className="text-sm text-[#141413] font-medium leading-relaxed">
                          {turn.displayText || turn.text}
                        </p>

                        {/* Native Script Subtitle (Shows why pronunciation is authentic) */}
                        {turn.spokenText && turn.spokenText !== turn.displayText && (
                          <p className="text-xs text-[#6E6A63] mt-1.5 font-mono-code">
                            🔊 Phonetic TTS Script: {turn.spokenText}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* LIVE INTERACTIVE VOICE ROLEPLAY BAR (Talk to Buyer on the Spot!) */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DCD7CC] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28] font-bold">
                        Live Two-Way Roleplay (Jump Into This Call!)
                      </span>
                      <h4 className="text-sm font-bold text-[#141413]">
                        Speak or Type as the Closer — {activeLead.name} Will Reply Live via
                        Nemotron 120B
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleMic}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isListeningMic
                          ? 'bg-[#D94E28] text-white animate-pulse'
                          : 'bg-[#141413] text-white hover:bg-[#2E2D2A]'
                      }`}
                    >
                      {isListeningMic ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" /> Listening ({callLang.toUpperCase()})...
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" /> 🎙️ Speak Into Mic
                        </>
                      )}
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLiveAgentSpeakTurn();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={liveAgentInput}
                      onChange={(e) => setLiveAgentInput(e.target.value)}
                      placeholder={`Say something to ${activeLead.name.split(' ')[0]} in ${callLang} (e.g., "If I waive floor-rise PLC, can we book Saturday 11 AM?")...`}
                      className="flex-1 bg-white border border-[#DCD7CC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#141413]"
                    />
                    <button
                      type="submit"
                      disabled={isBuyerResponding || !liveAgentInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      {isBuyerResponding ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Buyer Replying...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Pitch Live</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* MODULE 3: POST-CALL SEMANTIC DIFF (Synced to Last Convo!)     */}
            {/* ============================================================= */}
            {activeMode === 'semanticDiff' && (
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 lg:p-8 space-y-6">
                <div className="space-y-1 border-b border-[#EFECE6] pb-5">
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                    Synced to Last Live Conversation
                  </span>
                  <h3 className="text-xl font-bold text-[#141413]">
                    Post-Call Note → Semantic Diff & Priority Re-Ranking
                  </h3>
                  <p className="text-xs text-[#6E6A63]">
                    Auto-extracts insights from the last turns of your live voice call, or type any
                    custom post-call update to mutate the lead record and re-rank the inbox queue.
                  </p>
                </div>

                {/* Auto-Extracted Note from Last Live Voice Convo */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28] font-bold">
                      Auto-Extracted from Latest {callLang.toUpperCase()} Voice Call
                    </span>
                    <p className="text-xs text-[#242320] leading-relaxed">
                      {dynamicLastConvoSummaryNote}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setRawBrokerNote(dynamicLastConvoSummaryNote);
                      handleApplySemanticDiff(dynamicLastConvoSummaryNote);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#141413] hover:bg-[#2E2D2A] text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Sync Last Call to CRM Now
                  </button>
                </div>

                {/* Additional 1-Click Scenario Notes */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono-code text-[#6E6A63]">
                    Or test another post-call mutation:
                  </span>
                  {[
                    `Spoke to ${activeLead.name.split(' ')[0]} — increased budget to ₹2.35 Cr for 14th floor East unit, bringing booking cheque this Sunday 11 AM!`,
                    `${activeLead.name.split(' ')[0]} said budget dropped to ₹1.55 Cr max and wants to pause search for 4 months.`
                  ].map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => setRawBrokerNote(sample)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE6DC] border border-[#DCD7CC] text-[#141413] transition cursor-pointer text-left"
                    >
                      "{sample.slice(0, 62)}..."
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={rawBrokerNote}
                    onChange={(e) => setRawBrokerNote(e.target.value)}
                    placeholder="Type raw call notes here..."
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl p-4 text-sm text-[#141413] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#141413]"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApplySemanticDiff()}
                      disabled={isApplyingDiff || !rawBrokerNote.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-40"
                    >
                      {isApplyingDiff ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Running Semantic Diff via Nemotron 120B...</span>
                        </>
                      ) : (
                        <>
                          <GitCompare className="w-4 h-4" />
                          <span>Execute Semantic Diff & Recalculate Priority</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {activeLead.diffHistory?.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-[#EFECE6]">
                    <h4 className="text-xs font-mono-code uppercase tracking-widest text-[#6E6A63]">
                      Semantic Diff Audit Changelog
                    </h4>
                    {activeLead.diffHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#141413]">
                            Note: "{entry.rawNote}"
                          </span>
                          <span className="font-mono-code text-[#8C877E]">{entry.time}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {entry.mutations.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-2.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-mono-code"
                            >
                              <span className="text-[#8C877E] block text-[10px] uppercase">
                                {m.field}
                              </span>
                              <span className="line-through text-[#9E9A90] mr-2">{m.before}</span>
                              <span className="text-[#D94E28] font-semibold">→ {m.after}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* MODULE 4: INTERACTIVE FINANCIAL DEAL DESK                     */}
            {/* ============================================================= */}
            {activeMode === 'dealDesk' && (
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 lg:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EFECE6] pb-5">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                      Live Call Financial Structuring • Anti No-Show Engine
                    </span>
                    <h3 className="text-xl font-bold text-[#141413] mt-0.5">
                      {matchedProject.name} — All-Inclusive Cost & Rent-to-EMI Desk
                    </h3>
                    <p className="text-xs text-[#6E6A63]">
                      RERA ID: {matchedProject.rera} • {matchedProject.highlight}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] font-mono-code text-xs font-semibold">
                    Base Rate: ₹{matchedProject.baseRatePerSqft.toLocaleString('en-IN')}/sq.ft
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-6 space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span>Super Built-Up / Carpet Area</span>
                        <span className="font-mono-code text-[#D94E28]">{carpetSqft} sq.ft</span>
                      </div>
                      <input
                        type="range"
                        min={1100}
                        max={2800}
                        step={50}
                        value={carpetSqft}
                        onChange={(e) => setCarpetSqft(Number(e.target.value))}
                        className="w-full accent-[#D94E28] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span>Tower Floor Level (Floor-Rise PLC above 5th)</span>
                        <span className="font-mono-code text-[#D94E28]">Floor {floorLevel}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={28}
                        step={1}
                        value={floorLevel}
                        onChange={(e) => setFloorLevel(Number(e.target.value))}
                        className="w-full accent-[#D94E28] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span>Downpayment Contribution</span>
                        <span className="font-mono-code text-[#D94E28]">
                          {downpaymentPct}% (₹{dealCalculations.downpaymentLakhs} Lakhs)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={50}
                        step={5}
                        value={downpaymentPct}
                        onChange={(e) => setDownpaymentPct(Number(e.target.value))}
                        className="w-full accent-[#D94E28] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span>Bank Home Loan Rate (20-Yr Tenure)</span>
                        <span className="font-mono-code text-[#D94E28]">{interestRate}% p.a.</span>
                      </div>
                      <input
                        type="range"
                        min={8.1}
                        max={9.5}
                        step={0.05}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-[#D94E28] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between border-b border-[#E6E2D8] pb-3">
                        <span className="text-xs font-semibold text-[#57544E]">
                          All-Inclusive RERA Box Price
                        </span>
                        <span className="font-serif-display text-4xl text-[#141413]">
                          ₹{dealCalculations.allInclusiveCr} Cr
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono-code text-[#57544E]">
                        <div className="flex justify-between">
                          <span>Floor-Rise PLC (Floor {floorLevel}):</span>
                          <span>+ ₹{dealCalculations.floorRiseLakhs} Lakhs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loan Principal ({100 - downpaymentPct}%):</span>
                          <span>₹{dealCalculations.loanPrincipalCr} Cr</span>
                        </div>
                        <div className="flex justify-between text-[#141413] font-semibold pt-1">
                          <span>Estimated Monthly EMI:</span>
                          <span>₹{dealCalculations.monthlyEmiInr.toLocaleString('en-IN')}/mo</span>
                        </div>
                        <div className="flex justify-between text-[#D94E28] font-semibold">
                          <span>Buyer's Current Monthly Rent Offset:</span>
                          <span>
                            - ₹{dealCalculations.currentRentInr.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#E6E2D8]">
                        <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#8C877E]">
                          Net Extra Monthly Outflow to Own vs Rent
                        </div>
                        <div className="text-lg font-bold text-[#141413] mt-0.5">
                          Just ₹{dealCalculations.netDeltaInr.toLocaleString('en-IN')}/month extra
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyText(
                          `Hi ${activeLead.name.split(' ')[0]}, here is your custom RERA Box-Price Sheet for ${matchedProject.name} (${carpetSqft} sq.ft, Floor ${floorLevel}):\n• All-Inclusive Price: ₹${dealCalculations.allInclusiveCr} Cr (Zero hidden charges)\n• Downpayment (${downpaymentPct}%): ₹${dealCalculations.downpaymentLakhs}L\n• Est. Monthly EMI: ₹${dealCalculations.monthlyEmiInr.toLocaleString('en-IN')}/mo (Only ₹${dealCalculations.netDeltaInr.toLocaleString('en-IN')}/mo over your current rent!)\n• RERA ID: ${matchedProject.rera}`,
                          'costsheet'
                        )
                      }
                      className="w-full py-3 rounded-xl bg-[#141413] hover:bg-[#2E2D2A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {copiedId === 'costsheet' ? (
                        <>
                          <Check className="w-4 h-4 text-[#D94E28]" />
                          <span>RERA Cost Sheet Copied for WhatsApp!</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Copy 1-Click All-Inclusive Cost Sheet for WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* MODULE 5: COMPETITOR BATTLEMATRIX & WEDGE ENGINE (NEW WOW!)   */}
            {/* ============================================================= */}
            {activeMode === 'battleMatrix' && (
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 lg:p-8 space-y-6">
                <div className="space-y-1 border-b border-[#EFECE6] pb-5">
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                    Corridor Competitive Intelligence • {matchedProject.corridor}
                  </span>
                  <h3 className="text-xl font-bold text-[#141413]">
                    Head-to-Head Competitor Battlematrix for {activeLead.name}
                  </h3>
                  <p className="text-xs text-[#6E6A63]">
                    Buyers in {activeLead.location} always compare 2–3 Tier-1 builders before
                    visiting. Use these exact data wedges on the call to win the site visit:
                  </p>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E6E2D8] text-[10px] font-mono-code uppercase text-[#8C877E]">
                        <th className="py-3 px-4">Project Name</th>
                        <th className="py-3 px-4">Base Rate</th>
                        <th className="py-3 px-4">Carpet Efficiency</th>
                        <th className="py-3 px-4">Key Advantage / Bottleneck</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      <tr className="bg-[#FAF8F5] font-semibold text-[#141413]">
                        <td className="py-3.5 px-4 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#D94E28] text-white text-[10px]">
                            OUR PICK
                          </span>
                          <span>{matchedProject.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono-code">
                          ₹{matchedProject.baseRatePerSqft.toLocaleString('en-IN')}/sq.ft
                        </td>
                        <td className="py-3.5 px-4 font-mono-code text-[#D94E28]">
                          {matchedProject.carpetEfficiency} (Best in Class)
                        </td>
                        <td className="py-3.5 px-4">{matchedProject.highlight}</td>
                      </tr>

                      {matchedProject.competitors?.map((comp, idx) => (
                        <tr key={idx} className="text-[#57544E]">
                          <td className="py-3.5 px-4 font-medium text-[#141413]">{comp.name}</td>
                          <td className="py-3.5 px-4 font-mono-code">{comp.rate}</td>
                          <td className="py-3.5 px-4 font-mono-code">{comp.carpetEfficiency}</td>
                          <td className="py-3.5 px-4 text-[#B83918]">⚠️ {comp.weakness}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ready-to-Speak Wedge Rebuttals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {matchedProject.competitors?.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28] font-bold">
                          If {activeLead.name.split(' ')[0]} Mentions {comp.name}:
                        </span>
                        <p className="text-sm text-[#141413] font-medium leading-relaxed">
                          "{comp.wedgePitch}"
                        </p>
                      </div>
                      <button
                        onClick={() => copyText(comp.wedgePitch, `wedge-${idx}`)}
                        className="self-start px-3 py-1.5 rounded-lg bg-white border border-[#DCD7CC] hover:border-[#141413] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === `wedge-${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#D94E28]" /> Copied Wedge Script
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Wedge Script
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* MODULE 6: VIP SITE-VISIT PASS & 5-DAY WHATSAPP DRIP CADENCE   */}
            {/* ============================================================= */}
            {activeMode === 'cadencePass' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: VIP Gate Pass Generator */}
                <div className="lg:col-span-5 bg-[#141413] text-[#FAF8F5] rounded-2xl p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2E2D2A] pb-4">
                      <div>
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                          Masal VIP Fast-Track Pass
                        </span>
                        <h3 className="text-lg font-bold text-white mt-0.5">
                          {matchedProject.name}
                        </h3>
                      </div>
                      <QrCode className="w-10 h-10 text-[#D94E28]" />
                    </div>

                    <div className="space-y-2.5 text-xs font-mono-code">
                      <div className="flex justify-between">
                        <span className="text-[#9E9A90]">VIP Guest:</span>
                        <span className="text-white font-semibold">{activeLead.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E9A90]">Shortlisted Unit:</span>
                        <span className="text-[#E6A15C]">
                          {matchedProject.config} ({carpetSqft} sq.ft)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E9A90]">Locked Box Quote:</span>
                        <span className="text-white font-semibold">
                          ₹{dealCalculations.allInclusiveCr} Cr (All-In)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9E9A90]">Chauffeur / Gate Code:</span>
                        <span className="text-[#D94E28] font-bold">
                          MSL-{activeLead.id.slice(-3).toUpperCase()}-VIP
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      copyText(
                        `🎟️ *MASAL VIP SITE-VISIT PASS*\n• Guest: ${activeLead.name}\n• Project: ${matchedProject.name} (${matchedProject.corridor})\n• Reserved Unit: ${matchedProject.config} (${carpetSqft} sq.ft, Floor ${floorLevel})\n• Guaranteed Box Price: ₹${dealCalculations.allInclusiveCr} Cr\n• Gate Express Token: MSL-${activeLead.id.slice(-3).toUpperCase()}-VIP`,
                        'vip-pass'
                      )
                    }
                    className="w-full py-3 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {copiedId === 'vip-pass' ? (
                      <>
                        <Check className="w-4 h-4" /> VIP Pass Copied for WhatsApp!
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-4 h-4" /> Copy VIP Gate Pass for WhatsApp
                      </>
                    )}
                  </button>
                </div>

                {/* Right: Automated 5-Day Multi-Channel Drip Sequence */}
                <div className="lg:col-span-7 bg-white border border-[#E6E2D8] rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                      Automated Follow-Up Orchestration
                    </span>
                    <h3 className="text-base font-bold text-[#141413]">
                      5-Day Multi-Touch Conversion Cadence for {activeLead.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        day: 'Day 0 (T+30s)',
                        channel: 'Masal AI Voice Bot + Instant WhatsApp',
                        msg: `Completed ${activeLead.callDurationSec}s multilingual voice qualification & dispatched ${matchedProject.name} RERA Box-Price Sheet (₹${dealCalculations.allInclusiveCr} Cr).`
                      },
                      {
                        day: 'Day 1 (10:30 AM)',
                        channel: 'WhatsApp Objection Neutralizer',
                        msg: `Send proof addressing "${activeLead.analysis?.objections?.[0] || 'commute & water security'}" — specifically highlighting: ${matchedProject.highlight}.`
                      },
                      {
                        day: 'Day 3 (6:00 PM)',
                        channel: 'Financial Rent-vs-EMI Hook',
                        msg: `Share personalized calculation showing their ₹${dealCalculations.currentRentInr.toLocaleString('en-IN')}/mo rent covers the majority of the EMI (Net extra: ₹${dealCalculations.netDeltaInr.toLocaleString('en-IN')}/mo).`
                      },
                      {
                        day: 'Day 5 (Friday 4 PM)',
                        channel: 'VIP Chauffeur & Gate Pass Lock',
                        msg: `Send Express Gate Token (MSL-${activeLead.id.slice(-3).toUpperCase()}-VIP) and confirm Saturday 11:00 AM cab pickup location.`
                      }
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono-code font-bold text-[#D94E28]">
                            {step.day}
                          </span>
                          <span className="font-semibold text-[#141413]">{step.channel}</span>
                        </div>
                        <p className="text-xs text-[#57544E] leading-relaxed">{step.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODAL: NEW INBOUND LEAD INTAKE (Requirement #1)                     */}
      {/* =================================================================== */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E2D8] rounded-2xl max-w-xl w-full p-6 lg:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#D94E28]">
                  Inbound Lead Intake
                </span>
                <h2 className="text-lg font-bold text-[#141413]">
                  Ingest New Lead & Run Live Nemotron 120B Qualification
                </h2>
              </div>
              <button
                onClick={() => setShowIntakeModal(false)}
                className="text-xs font-semibold text-[#6E6A63] hover:text-[#141413] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-code text-[#6E6A63]">1-Click Demo Presets:</span>
              <button
                type="button"
                onClick={() =>
                  setIntakeForm({
                    name: 'Siddharth & Meera Pai',
                    location: 'Whitefield / ITPL, Bengaluru',
                    propertyRequirement: '3 BHK Ready-to-Move near Metro (1,850 sq.ft)',
                    budget: '₹2.10 Cr – ₹2.30 Cr (SBI Pre-Approved)',
                    timeline: 'Immediate (Within 21 Days)',
                    message:
                      'Both of us work at SAP Labs Whitefield. We have an SBI pre-approved loan of 1.7 Cr and 55L downpayment ready. Need a 3BHK close to Kadugodi Metro with zero hidden builder charges. Can visit this Saturday morning.'
                  })
                }
                className="text-xs px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE6DC] border border-[#DCD7CC] font-medium cursor-pointer"
              >
                + SAP Labs Couple (Whitefield ₹2.2Cr)
              </button>
            </div>

            <form onSubmit={handleCreateNewLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                    Buyer Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={intakeForm.name}
                    onChange={(e) => setIntakeForm({ ...intakeForm, name: e.target.value })}
                    placeholder="e.g., Siddharth Pai"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                    Location *
                  </label>
                  <input
                    required
                    type="text"
                    value={intakeForm.location}
                    onChange={(e) => setIntakeForm({ ...intakeForm, location: e.target.value })}
                    placeholder="e.g., Whitefield / Hebbal"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                    Property Requirement *
                  </label>
                  <input
                    required
                    type="text"
                    value={intakeForm.propertyRequirement}
                    onChange={(e) =>
                      setIntakeForm({ ...intakeForm, propertyRequirement: e.target.value })
                    }
                    placeholder="e.g., 3 BHK Ready to Move"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                    Budget *
                  </label>
                  <input
                    required
                    type="text"
                    value={intakeForm.budget}
                    onChange={(e) => setIntakeForm({ ...intakeForm, budget: e.target.value })}
                    placeholder="e.g., ₹2.10 Cr"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                    Buying Timeline *
                  </label>
                  <input
                    required
                    type="text"
                    value={intakeForm.timeline}
                    onChange={(e) => setIntakeForm({ ...intakeForm, timeline: e.target.value })}
                    placeholder="e.g., Within 30 Days"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3B37] mb-1">
                  Customer Message / 30-Second Call Transcript *
                </label>
                <textarea
                  required
                  rows={4}
                  value={intakeForm.message}
                  onChange={(e) => setIntakeForm({ ...intakeForm, message: e.target.value })}
                  placeholder="Paste the buyer's inquiry or Masal AI voice qualification transcript..."
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD7CC] text-xs font-semibold text-[#57544E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-5 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#B83918] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {isSubmittingLead ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scoring via Nemotron 120B...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Qualify & Prioritize Lead</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}