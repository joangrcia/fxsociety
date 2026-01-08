# AGENTS.md

## FXSOCIETY – GLOBAL AI AGENT CONTEXT & RULES

This document defines the **permanent global context** for all AI agents working on the **fxsociety** project.
All agents **MUST read and follow** these rules before executing any task.

---

## 1. Brand & Product Overview

**Brand Name:** fxsociety  
**Product Type:** Digital product – trading indicators  
**Core Business:** Selling trading indicators via a website (shop + member area)

fxsociety focuses on **helping beginner traders** trade more simply using easy-to-use indicators.

---

## 2. Target Users

**Primary Target:** Beginner traders

User characteristics:

- New to trading
- Not familiar with complex trading terminology
- Needs clear buy / sell guidance
- Prefers simplicity over advanced analysis

### Language & Tone

- English
- Simple, beginner-friendly
- Non-technical
- Educational and trustworthy

---

## 3. Tech Stack (FIXED – DO NOT CHANGE)

- **Backend:** FastAPI (Python)
- **Database:** SQLite
- **Authentication:** JWT
- **Payment:** Manual payment only (bank transfer + payment proof upload)
- **Product Delivery:** Digital file download (trading indicators)
- **Storage:** Private server-side storage (NOT public)

🚫 **STRICTLY FORBIDDEN:**

- Using payment gateways (Stripe, Midtrans, Xendit, etc.)
- Switching database to PostgreSQL/MySQL
- Changing the tech stack without explicit user instruction

---

## 4. Business Flow (MANDATORY)

1. User registers or logs in
2. User selects a trading indicator product
3. User creates an order
4. Order status = `pending_payment`
5. System shows manual payment instructions
6. User uploads payment proof
7. Admin reviews the payment
8. If approved:
   - Order status becomes `paid`
   - A license is issued
   - User gains download access
9. User downloads the indicator from the member area

⚠️ Indicator files **MUST NOT** be accessible before the order is marked as `paid`.

---

## 5. License & Download Rules

- Each purchase generates a **license**
- Licenses are bound to a user account
- Downloads are allowed only if:
  - User is authenticated
  - License is active
  - Related order status is `paid`
- Indicator files must be stored in **private storage**
- File access must go through secured FastAPI endpoints (no direct public links)

---

## 6. Legal & Compliance Rules (CRITICAL)

AI agents **MUST NOT**:

- Claim guaranteed profits
- Claim fixed win rates
- Present indicators as profit guarantees
- Provide personalized investment advice

AI agents **MUST**:

- Use safe and ethical wording
- Include trading risk disclaimers when relevant

Example disclaimer:

> “Trading involves risk. There is no guarantee of profit. This indicator is a tool, not financial advice.”

---

## 7. Scope Control

Agents **MUST NOT**:

- Add features outside the defined scope
- Implement automated subscription systems
- Automate payments
- Add advanced features (AI signals, machine learning, etc.) unless explicitly requested

If assumptions are required:
➡️ Clearly state them and request user confirmation.

---

## 8. Output & Working Style Rules

All agents must:

- Work step by step
- Provide:
  - A clear plan
  - A TODO list
  - Concrete deliverables
- Produce outputs that are **directly usable**
- Maintain clean, modular, and readable code

API-specific rules:

- Separate routers by module
- Use Pydantic schemas
- User-facing responses must be clear and simple

---

## 9. Admin Concept

Admins are users with the `admin` role who can:

- View `pending_payment` orders
- Approve or reject payments
- Upload new indicator file versions
- Revoke licenses if necessary

No complex admin UI is required (API-first approach is sufficient).

---

## 10. Project Priorities

1. Correct manual payment & order flow
2. Secure indicator downloads
3. Beginner-friendly user experience
4. Clean architecture for future expansion

---

## 11. Final Authority Rule

If there is any conflict between:

- Task prompts
- Agent assumptions
- Other documentation

➡️ **AGENTS.md is the single source of truth.**
