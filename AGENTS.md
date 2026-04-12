# AGENTS.md

## 🌳 Project Overview

Whitewood is a blogging platform generator that enables anyone to quickly create and deploy a blog.

Core principles:
- Everything is editable
- Structure is managed via blocks (Puck)
- Content is managed via rich text (Lexical)

The system separates **layout (blocks)** from **content (text)** while allowing both to be fully customizable.

---

## 🧱 Tech Stack

- RedwoodSDK (RSC architecture)
- Cloudflare (edge deployment, one-click)
- Puck (block-based editor)
- Lexical (rich text editor)
- Zod (schema validation)

---

## 🎯 Objectives

- Enable fast blog creation with minimal setup
- Maintain strict separation of concerns (blocks vs content)
- Ensure strong data validation everywhere
- Keep the system modular, composable, and extensible
- Ensure compatibility with Cloudflare Workers

---

## 🧠 Core Architecture

### Blocks vs Content

- Puck handles **layout and structure**
- Lexical handles **rich text content inside blocks**
- Blocks must NOT implement their own rich text system
- Do NOT mix responsibilities between Puck and Lexical

---

## 🧩 Block Contract (MANDATORY)

Each block MUST:

- Define a Zod schema
- Define editable fields
- Support serialization and deserialization
- Be independent from specific data sources
- Be reusable and composable

Blocks live in:

/blocks

---

## 🧬 Data Validation

- ALL schemas MUST be defined using Zod
- NEVER trust unvalidated input
- Schemas must live in:

/schemas

- Reuse schemas across client and server whenever possible
- Schema naming convention:

SomethingSchema

---

## 🔄 RedwoodSDK: Queries vs Actions

The system strictly uses `serverQuery` and `serverAction`.

---

### 📖 serverQuery (Read + No UI Update)

Use `serverQuery` when:
- Fetching data
- Reading from the database
- Returning existing state

Behavior:
- Returns data only
- Does NOT trigger UI re-render
- Optimized for performance (no full RSC hydration)

Rules:
- MUST NOT modify data
- MUST be idempotent
- MUST be safe to call multiple times

Default method:
- GET

Examples:
- getPost
- listPosts

---

### ✍️ serverAction (Write + UI Update)

Use `serverAction` when:
- Creating data
- Updating data
- Deleting data
- Triggering side effects

Behavior:
- Triggers UI re-render / rehydration
- Updates server state and reflects it in the UI

Rules:
- MUST validate input using Zod
- MUST handle side effects explicitly
- MUST be deterministic

Default method:
- POST (can be customized)

Examples:
- createPost
- updatePost
- deletePost

---

### 🚫 Critical Rules

- NEVER perform writes inside a `serverQuery`
- NEVER use `serverAction` for simple data fetching
- NEVER mix read and write logic in the same function

---

### 🧠 Decision Rule (MANDATORY)

Before writing any server logic, the agent MUST decide:

1. Does this modify state?
   → YES → use `serverAction`

2. Does this only fetch data?
   → YES → use `serverQuery`

3. Does the UI need to update after this?
   → YES → use `serverAction`
   → NO → use `serverQuery`

---

## 🛠️ Server Logic Rules

When creating server-side logic:

- Use RedwoodSDK conventions (`serverQuery`, `serverAction`)
- Place logic in dedicated files:

- Queries → `/queries`
- Actions → `/actions`

- Files MUST start with `"use server"`

---

## 📂 Project Structure

/app → application entry and routing  
/app/api → API endpoints (query/action exposure)  
/blocks → Puck block definitions  
/components → reusable UI components  
/schemas → Zod schemas  
/queries → serverQuery implementations  
/actions → serverAction implementations  
/lib → shared utilities  

---

## 🧪 Code Quality Rules

- Use TypeScript everywhere
- Prefer small, composable functions
- Keep functions under ~50 lines when possible
- Avoid large monolithic files
- Prefer explicit code over abstraction
- Optimize for readability and maintainability

---

## 🏷️ Naming Conventions

- Queries: `getSomething`, `listSomething`
- Actions: `createSomething`, `updateSomething`, `deleteSomething`
- Schemas: `SomethingSchema`
- API routes mirror function names

---

## 🚫 Guardrails

- Do NOT introduce new frameworks without justification
- Do NOT bypass Zod validation
- Do NOT tightly couple blocks to data sources
- Do NOT duplicate business logic
- Do NOT use Node.js-only APIs incompatible with Cloudflare
- Do NOT introduce unnecessary abstractions

---

## ☁️ Deployment Constraints

- Must run on Cloudflare Workers
- Prefer edge-compatible APIs
- Avoid Node.js-specific modules unless supported

---

## 🧠 Agent Expectations

When generating code, the agent MUST:

- Follow the project structure strictly
- Reuse existing schemas before creating new ones
- Validate ALL inputs with Zod
- Choose correctly between query vs action BEFORE coding
- Expose all server logic via `/app/api`
- Keep code simple, readable, and composable

---

---

## Route declaration
All routes MUST be declared in src/worker.tsx

---

## ✨ Philosophy

Whitewood is:

- Modular
- Fully editable (structure + content)
- Edge-native
- Predictable
- Developer-first

Agents must optimize for:
- Simplicity
- Clarity
- Correctness
- Extensibility