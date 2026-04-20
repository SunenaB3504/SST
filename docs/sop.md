# Standard Operating Procedure (SOP)
## Purple Paws SST App — Content & Development Standards

> **This SOP MUST be read before executing any command, writing any content, or creating any chapter data file.**
> It ensures consistency, architectural integrity, and exam-readiness across all 16 chapters.

---

## 1. Look and Feel (Visual Uniformity)

- **Primary Color**: `purple-600` for all primary actions, buttons, and active states.
- **Background**: `purple-50` for all page/section backgrounds.
- **Text**: `text-purple-900` as the primary color. `text-purple-500` for labels/subtitles.
- **Corner Radius**: `rounded-3xl` on cards and large buttons; `rounded-2xl` on inner elements.
- **Shadows**: `shadow-soft` (custom token) on all cards. No hard/flat boxes.
- **Micro-animations**: Apply `animate-bounce-subtle` to Pip and key UI moments. Use `transition-all duration-300` on interactive elements.
- **Aesthetics Rule**: No plain red, blue or green defaults. Use curated palette — purple, amber, green, teal, orange — per question type badge.
- **Font**: Outfit / Inter. Never use browser default fonts.

---

## 2. Content Standards (Stick to Textbook)

> **Anti-Hallucination Rule**: Every single fact, date, name, and explanation MUST come from the chapter's source `.txt` file in `/Chapters`. Never invent, assume, or embellish.

### 2.1 How to Read Source Files

- Source files are located at: `c:\Users\Admin\Nia\Std V\SST\Chapters\Ch_XX_<Title>.txt`
- Read the full file before writing any content for that chapter.
- Cross-check all facts against the "Learning Outcomes" and "Words to Know" sections of the chapter.

### 2.2 Language Standard

- Write for a **10-year-old (Class V)** student. Use simple, clear sentences.
- Keep Pip's explanations warm, encouraging, and fact-based.
- Avoid academic jargon unless the textbook uses it (and then explain it via Pip).

---

## 3. Chapter Data File — Content Quota per Mode

Every chapter data file (`src/entities/chapter/data/chapterXX.ts`) MUST include the following minimum content:

### ✨ Mode 1: The Essence (Key Facts)
- **Minimum**: 10 bullet points.
- **Coverage**: Must span the entire chapter — introduction, main events/concepts, subtopics, and conclusion/results.
- **Format**: One sentence per fact. Clear, numbered, and self-contained.

**Template:**
```typescript
essence: [
  { id: 'e1',  text: '[Opening context / background of the chapter]' },
  { id: 'e2',  text: '[Key concept or definition introduced in ch.]' },
  // ... continue for all major points
  { id: 'e10', text: '[Key result, outcome, or takeaway of the chapter]' },
],
```

---

### ⛓️ Mode 2: Chain Reaction (Cause & Effect)
- **Minimum**: 5 pairs.
- **Coverage**: Map every major cause-and-effect relationship in the chapter.
- **Rule**: Cause and Effect must each be in the child's own language — not a direct textbook quote.

**Template:**
```typescript
chainReactions: [
  {
    id: 'cr1',
    cause: '[What happened / the trigger / the problem]',
    effect: '[What resulted from it / the consequence]',
  },
  // ...
],
```

---

### 🗺️ Mode 3: Big Picture (Mind Map)
- **Structure**: Root node → 2–4 level-1 category nodes → leaf nodes for each category.
- **Coverage**: Categories should reflect chapter's main sections (e.g., Causes / Leaders / Results, OR Types / Features / Examples).
- **Minimum**: 3 level-1 category branches, each with at least 3 leaf nodes.
- **Labels**: Keep node labels short (max 3–4 words or 2 lines). Use `\n` for line breaks.
- **Emoji in category nodes**: One relevant emoji per level-1 node label (e.g., `'🔥 Causes'`).

**Template:**
```typescript
bigPicture: {
  id: 'root',
  label: '[Chapter Title]',
  children: [
    {
      id: 'branch1',
      label: '[Emoji] [Category 1 Name]',
      children: [
        { id: 'b1-1', label: '[Leaf node label]' },
        { id: 'b1-2', label: '[Leaf node label]' },
        { id: 'b1-3', label: '[Leaf node label]' },
      ],
    },
    // 2–3 more branches
  ],
},
```

---

### ✍️ Mode 4: Essay Architect (Writing Starters + Model Answers)
- **Minimum**: 4 questions.
- **Coverage**: Include both short (3-mark) and long answer (5-mark) question types, as they appear in CBSE exams.
- **Each entry MUST have**:
  1. `prompt`: The full exam-style question with mark allocation in brackets.
  2. `starter`: A single opening sentence to help Nia start writing.
  3. `fullAnswer`: A complete, exam-ready model answer. Must be thorough enough to earn full marks. Written in simple language.

**Template:**
```typescript
essayStarters: [
  {
    id: 'es1',
    prompt: '[Exam-style question with marks, e.g. "Describe... (5 marks)"]',
    starter: '[First sentence of the answer, ending with "..."]',
    fullAnswer:
      '[Complete model answer in 4–8 sentences. Clear points. Exam-ready.]',
  },
  // 3+ more entries
],
```

---

### 🎯 Mode 5: Quiz (30 Questions — Mandatory)
- **Total**: **30 questions minimum per chapter**.
- **All 6 question types MUST be used** in every chapter. Minimum counts:

| Type | Badge | Min. Count | Notes |
|---|---|---|---|
| `mcq` | 🔘 Multiple Choice | 10 | Cover all major subtopics |
| `matching` | 🔗 Match It! | 4 | Pair terms, people, places, definitions |
| `true-false` | ⚖️ True or False? | 4 | Target common exam misconceptions |
| `fill-blank` | ✏️ Fill in the Blank | 3 | Key dates, technical terms, key names |
| `spelling` | 🔤 Spelling Check | 3 | Difficult chapter-specific words |
| `short-answer` | 📝 Short Answer | 5 | Map to actual CBSE exam questions |

**Template per question type:**
```typescript
// MCQ / Fill-blank / Spelling / Matching
{ id: 'qN', type: 'mcq' as const,       // or 'fill-blank', 'spelling', 'matching'
  question: '[Question text]',
  options: [{ text: '...' }, { text: '...' }, { text: '...' }, { text: '...' }], // 4 options for MCQ
  correctIndex: N,                        // 0-indexed
  pipsExplanation: '[Why the answer is correct. Encouraging + factual. Max 3 sentences.]',
},

// True/False
{ id: 'qN', type: 'true-false' as const,
  question: '[A statement that is clearly True or False]',
  options: [{ text: 'True' }, { text: 'False' }],
  correctIndex: 0,  // 0 = True, 1 = False
  pipsExplanation: '[Explain TRUE/FALSE! + why. Add ✅ or ❌ emoji.]',
},

// Short Answer
{ id: 'qN', type: 'short-answer' as const,
  question: '[Exam-style open-ended question]',
  options: [], correctIndex: -1,
  modelAnswer: '[Complete, point-wise model answer matching CBSE format. Use \n for line breaks between points.]',
  pipsExplanation: '[Pip\'s memory tip for this answer. Highlight the key points to remember.]',
},
```

---

## 4. Architecture Rules (Strictly Follow FSD)

- **New chapter data file**: `src/entities/chapter/data/chapterXX.ts`
- **Register** the new chapter in: `src/entities/chapter/index.ts` → `chaptersRegistry` array.
- **Module assignment**: Assign each chapter to one of the 4 thematic modules:

| Module ID | Label | Chapters |
|---|---|---|
| `explorer` | The Explorer 🌍 | Ch. 1–5 |
| `world-tour` | The World Tour ✈️ | Ch. 6–9 |
| `freedom-fighter` | The Freedom Fighter 🗡️ | Ch. 10–12 |
| `young-citizen` | The Young Citizen 🏛️ | Ch. 14–16 |

- **Global state**: All points (Puppy Treats) and mastery flow through `useProgressStore` only. Never manage progress locally.
- **No leaking**: Quiz logic stays in `feature/quiz`. Chapter rendering stays in `feature/chapters`. No cross-feature imports except through shared entities.

---

## 5. Pip the Puppy — Interaction Standards

| Pip State | When to Use |
|---|---|
| `happy` 🐶 | Correct answers, chapter opened, home screen |
| `thinking` 🤔 | Wrong answers, loading, short-answer submission |
| `eco-warrior` 🌿🐶 | Ch. 16 (Save the Environment) only |
| `excited` 🤩 | Chapter mastered, perfect quiz score |

- **Pip's Explanation rules**: Always factual, never invented. Max 3 sentences. End with a relevant emoji.
- **Memory tips**: For short-answer Pip explanations, always close with a **memorable pattern** (e.g., "Remember: 3 reasons = 3 marks!").

---

## 6. Chapter Addition Checklist

Use this checklist every time a new chapter is added:

- [ ] Read the full source `.txt` file from `/Chapters`
- [ ] Verify the module assignment (`explorer`, `world-tour`, `freedom-fighter`, `young-citizen`)
- [ ] Write **Essence**: min. 10 facts, full chapter coverage
- [ ] Write **Chain Reactions**: min. 5 pairs, factual
- [ ] Write **Mind Map**: 3 branches, 3+ leaves each
- [ ] Write **Essay Architect**: 4 questions (mix of 3-mark and 5-mark), full model answers
- [ ] Write **Quiz**: exactly 30 questions using all 6 types (10 MCQ, 4 Matching, 4 True/False, 3 Fill-blank, 3 Spelling, 5 Short Answer)
- [ ] Add `videoUrl: ''` field (blank — to be filled by teacher later)
- [ ] Register chapter in `src/entities/chapter/index.ts`
- [ ] Verify no content is invented — all facts cross-checked with source `.txt`
