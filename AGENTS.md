# AGENTS.md — fxsociety

## Project Overview

Project Name: fxsociety  
Project Type: Trading-related product marketplace website

Primary Goal: Sell beginner-friendly trading-related products

Product Scope:

- Trading indicators
- Trading robots (EA)
- Digital products (ebooks, guides, PDFs)
- Physical merchandise (apparel, accessories)

Target Audience: Beginner traders (non-technical)  
Primary Language (UI & content): Indonesian (Bahasa Indonesia)

Backend: Django (DRF) in `backend2/` (FastAPI in `backend/` is deprecated/fallback)
Database: SQLite
Frontend: React (Vite) in `frontend/` and `admin-frontend/`
CSS Framework: Tailwind CSS
Payment: No payment gateway (manual approval / admin confirmation)

## Repository Structure & Deployment (MANDATORY)

This repository uses specific branches for environments. NEVER mix them.

- `master`: Local Development ONLY. Contains full source (`backend2/`, `frontend/`, `admin-frontend/`). API defaults to `localhost:8000`.
- `deploy-be`: Production Backend ONLY. Orphan branch containing flattened `backend2/` files for cPanel Passenger hosting. Absolute SQLite path.
- `deploy`: Production Frontend ONLY. Orphan branch containing built static assets (`dist/`) pointing to `api.fxsociety.id`.
---

## Core Principles (MANDATORY)

1. Beginner-First Mindset

- Always assume the user is a beginner
- Use simple, non-technical language
- Avoid advanced trading jargon
- Focus on clarity and ease of use

2. No Profit Guarantee

- NEVER promise guaranteed profits
- NEVER claim certainty or fixed win rates
- Always include a trading disclaimer when relevant
- Avoid misleading financial language

3. Clarity Over Complexity

- UI must be understandable within 5 seconds
- Do not add features, pages, or menus unless explicitly requested
- Simplicity with intention, not minimalism for its own sake

4. Simple but Not Boring

- Clean layout with visual depth
- Use cards, spacing, and hierarchy to create interest
- Design should feel modern, intentional, and premium

---

## Public Navigation (FIXED — DO NOT CHANGE)

The "Shop" menu represents a multi-product store.  
Agents MUST NOT assume the shop contains only indicators.

- Home
- Shop
- How It Works
- About Us
- Support
- Login

Member-only and admin routes are allowed internally but must not appear in public navigation.

---

## Shop & Product Rules

The Shop is a multi-product marketplace.

Possible product types include:

- Trading indicators
- Trading robots (EA)
- Digital downloads (ebooks, PDFs)
- Physical merchandise (e.g. apparel)

Rules:

- Do NOT hardcode the shop UI for indicators only
- Product cards must be generic and reusable
- Product-specific details must live on the product detail page
- Shop layout must support future product categories without redesign

---

## Visual & UI Design Rules

### Theme

- Dark-based UI
- Do NOT use pure black everywhere
- Use layered dark backgrounds to create depth:
  - Page background: `#0a0a0f` / `#050505`
  - Section surface: `#0f0f12` / `#08080a`
  - Card surface: `#14141a` / `#1e1e26`

### Accent Colors

The design uses **silver metallic as dominant** with **blue as secondary accent**.

**Silver (dominant):**
- Primary CTA buttons: `bg-gradient-to-br from-slate-100 via-white to-slate-300 text-black`
- Gradient headings: `bg-gradient-to-r from-slate-100 via-white to-slate-400`
- Borders, badges, bullet dots: `slate-400/20`, `slate-400/10`

**Blue (accent — subtle, never dominant):**
- Ambient background orbs: `bg-blue-500/5` to `bg-blue-500/8`, `blur-[100px–150px]`
- Active nav item border: `border-blue-500/20`
- Input focus ring: `focus:ring-blue-500/30 focus:border-blue-500/30`
- Badge/pill dot indicator: `bg-blue-500 animate-pulse`
- Button hover glow: `hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]`
- Category filter pill active state: `bg-blue-600/80 border-blue-500/30`
- Step number markers: `border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]`
- Scrollbar: `rgba(59, 130, 246, 0.35)`

**Rules:**
- Silver must always dominate visually
- Blue opacity must stay low (4–20%) to remain ambient/subtle
- Do NOT introduce any third accent color

---

## Card-Based Design System

Cards are the primary UI building blocks.

Card requirements:

- Large rounded corners (`rounded-xl` or `rounded-2xl`, hero cards use `rounded-3xl`)
- Subtle, low-contrast borders: `border border-white/5` or `border border-white/10`
- Soft shadows for depth: `shadow-2xl`
- Background: `bg-[#14141a]` or `bg-[#0f0f12]`
- Hover interactions:
  - Slight upward movement: `hover:-translate-y-1`
  - Border highlight: `hover:border-white/20` or `hover:border-blue-500/20`
  - Subtle glow: `hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`

Common card types:

- Product cards
- Feature cards
- Step cards
- Testimonial cards

Product cards MUST be adaptable to different product types.

---

## Component Patterns

### Badge / Pill Label
```jsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-slate-300 text-xs tracking-widest uppercase font-medium">
  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
  Label Text
</div>
```

### Background Ambient Orbs (use on every page)
```jsx
<div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px]" />
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px]" />
</div>
```

### Input Fields
```jsx
<input className="w-full bg-white/5 text-white rounded-xl border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 placeholder:text-zinc-600 transition-all" />
```

### Primary CTA Button (silver + blue hover glow)
```jsx
<button className="bg-gradient-to-br from-slate-100 via-white to-slate-300 text-black font-bold rounded-xl hover:shadow-[0_0_24px_rgba(59,130,246,0.18)] transition-all">
  CTA Text
</button>
```

### Hero Section
- Height: `min-h-screen` (NOT `h-[85vh]` — use full viewport height)
- Layout: `flex items-center justify-center`
- Mobile: hide decorative 3D elements with `hidden lg:flex`
- Text content: `max-w-xl mx-auto lg:mx-0` for proper mobile centering

### Navbar Mobile Menu
- Background: `bg-[#0d0d14]/98 backdrop-blur-xl`
- Menu item text: `text-zinc-200 font-semibold` (NOT `text-zinc-400` — too low contrast)
- Active item border: `border-blue-500/20`

---

## Interaction & Animation Guidelines

- Subtle micro-interactions only
- Allowed:
  - Hover effects
  - Focus states
  - Scroll reveal animations
- Not allowed:
  - Flashy or aggressive animations
  - Distracting transitions
  - Excessive motion

Interactions should feel responsive, premium, and intentional.

---

## Typography Rules

- Headings: modern, clean, high contrast
- Body text: slightly larger than default for readability
- Maintain clear hierarchy (H1 → H2 → body)
- Highlight at most ONE key word per section using accent color

---

## Content & Copywriting Rules

- Language: Indonesian (Bahasa Indonesia)
- Tone:
  - Friendly
  - Clear
  - Trustworthy
  - Calm and professional

Avoid:

- Overpromising results
- Fear-based marketing
- Complex or technical explanations

Focus on:

- Simplicity
- Practical usage
- Building beginner confidence

---

## Technical Constraints

- Tailwind CSS is mandatory
- Prefer utility classes over custom CSS
- Components must be reusable and consistent
- Frontend code should be clean, readable, and structured

---

## Agent Behavior Rules

- Do not assume requirements that are not explicitly stated
- Ask for clarification when unsure
- Treat this document as the single source of truth
- When conflicts arise, prioritize:
  1. Beginner-first principle
  2. Clarity
  3. Design consistency
  4. Business goal (selling products)

---

## Definition of Success

A successful output:

- Feels premium but approachable
- Is easy to understand for beginners
- Looks modern, dark, and interactive
- Uses card-based layouts and subtle interactions effectively
- Does NOT feel overcrowded or overly minimal
