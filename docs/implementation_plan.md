# Implementation Plan - Nia's Purple Paws SST App

This document outlines the architectural strategy and phase-wise execution for building the SST version of Nia's app, a modular React 19 application designed for a 10-year-old student based on the CBSE Class V SST curriculum.

## User Review Required

> [!IMPORTANT]
> **React 19 & Tailwind 4**: We are using the latest stable versions. Ensure the environment supports these.
> **Feature-Sliced Design (FSD)**: This requires a strict directory structure. We will implement this from day one to avoid architectural drift.

## Proposed Changes

We will adopt a monorepo-style structure within the workspace to separate UI primitives from domain logic.

### 1. Architecture Scaffolding

- **`docs/sop.md`**: A mandatory standard operating procedure to ensure design consistency and prevent hallucination during content generation.
- **`docs/implementation_plan.md`**: Internal copy of this plan for easy reference.

### 2. Phase-Wise Implementation

#### Phase 1: Foundation & UI Primitives
- Initialize the React 19 project using Vite.
- Setup Tailwind CSS 4 with the "Purple Paws" design tokens.
- Create `/packages/ui` (or a similar shared path) for:
    - **Buttons**: `rounded-3xl`, `bg-purple-600`.
    - **Cards**: `rounded-3xl`, `bg-white`, soft shadows.
    - **Typography**: Inter/Outfit with `text-purple-900`.
    - **Mascot**: Initial `PipThePuppy` component with Happy/Thinking states.

#### Phase 2: State Management (Zustand)
- Implement `useProgressStore` to track:
    - `puppyTreats`: Points earned.
    - `masteredChapters`: Array of chapter IDs.
    - `currentLesson`: Persistence of where Nia left off.

#### Phase 3: Core Features (FSD)
- **feature/chapters**: 
    - Implement the `ChapterDetail` view with a 4-mode tab switcher.
    - Build renderers for "The Essence", "The Chain Reaction", "The Big Picture", and "The Essay Architect".
- **feature/quiz**:
    - Implement `QuizEngine` (one question at a time).
    - Build the "Pip's Explanation" panel logic that triggers after selection.

#### Phase 4: Content Ingestion & Curriculum Modules
- Setup a data layer to parse the 16 chapter text files.
- Map chapters to the four thematic modules:
    - The Explorer
    - The World Tour
    - The Freedom Fighter
    - The Young Citizen

## Open Questions

- **Content Parsing**: Should the text files be pre-processed into JSON for the app, or should we build a dynamic parser/AI-driven loader? 
- **Icons/Images**: For "The Big Picture" (Mind Maps), do we have specific image assets, or should Pip/SVGs represent the nodes?

## Verification Plan

### Automated Tests
- Component testing for UI primitives using Vitest/Playwright.
- State transition tests for the Zustand store.

### Manual Verification
- Walkthrough of the "Revolt of 1857" content to ensure Pip's explanations match the textbook and provide the "WOW" factor via micro-animations.
