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

Backend: FastAPI  
Database: SQLite  
Frontend: Any framework  
CSS Framework: Tailwind CSS  
Payment: No payment gateway (manual approval / admin confirmation)

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
  - Page background
  - Section surface
  - Card surface

### Accent Color

- Use ONLY ONE primary accent color (e.g. emerald or cyan)
- Accent color usage is LIMITED to:
  - Primary CTA buttons
  - Highlighted keywords
  - Badges or indicators
- Do NOT introduce multiple accent colors

---

## Card-Based Design System

Cards are the primary UI building blocks.

Card requirements:

- Large rounded corners (rounded-xl or rounded-2xl)
- Subtle, low-contrast borders
- Soft shadows for depth
- Hover interactions:
  - Slight upward movement
  - Border highlight or subtle glow

Common card types:

- Product cards
- Feature cards
- Step cards
- Testimonial cards

Product cards MUST be adaptable to different product types.

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
