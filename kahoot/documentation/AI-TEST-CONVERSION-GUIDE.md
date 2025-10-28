# AI Guide: Converting Test Text to Quiz JSON

**Purpose:** This guide helps AI assistants convert plain text tests/exams into the JSON format required by this quiz application.

**Target Audience:** AI Language Models (GPT, Claude, Gemini, etc.)

**Last Updated:** October 24, 2025

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [JSON Schema Overview](#json-schema-overview)
3. [**IMPORTANT: Multi-Section Test Handling**](#important-multi-section-test-handling)
4. [Question Type Conversion Rules](#question-type-conversion-rules)
5. [Step-by-Step Conversion Process](#step-by-step-conversion-process)
6. [Common Text Patterns](#common-text-patterns)
7. [Validation Checklist](#validation-checklist)
8. [Complete Examples](#complete-examples)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Input Format (Plain Text Test)
```
Quiz Title: Introduction to Programming
Description: Basic programming concepts

1. What is a variable?
   a) A container for storing data
   b) A type of loop
   c) A function
   d) A class
   Answer: a

2. Select all programming languages: (multiple answers)
   a) Python
   b) HTML
   c) JavaScript
   d) CSS
   Answer: a, c
```

### Output Format (JSON)
```json
{
  "title": "Introduction to Programming",
  "description": "Basic programming concepts",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is a variable?",
      "options": [
        "A container for storing data",
        "A type of loop",
        "A function",
        "A class"
      ],
      "answer": "A container for storing data",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-select",
      "question": "Select all programming languages:",
      "options": [
        "Python",
        "HTML",
        "JavaScript",
        "CSS"
      ],
      "answer": ["Python", "JavaScript"],
      "timer": 30,
      "points": 10
    }
  ]
}
```

---

## JSON Schema Overview

### Top-Level Structure

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "passage": { ... } (optional),
  "questions": [ ... ] (required, array)
}
```

### Common Question Fields

All question types share these fields:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | ✅ Yes | - | Question type identifier |
| `question` | string | ✅ Yes | - | The question text |
| `timer` | number | ❌ No | 30 | Time limit in seconds |
| `points` | number | ❌ No | 10 | Points awarded for correct answer |

---

## IMPORTANT: Multi-Section Test Handling

### 🚨 CRITICAL RULE: One Quiz Object Per File

**The upload system accepts ONLY a single quiz object, NOT an array of quizzes.**

When you receive a full test with multiple sections (e.g., IELTS Reading with 3 passages, TOEFL Listening with multiple conversations), you MUST follow these principles:

---

### Decision Framework

#### Scenario 1: Multiple Independent Sections (e.g., IELTS Reading Test 1)

**Input Example:**
```
IELTS Cambridge 20 - Test 1 - Reading

Passage 1: The kākāpō
[Long passage text...]
Questions 1-13

Passage 2: Return of the elm
[Long passage text...]
Questions 14-26

Passage 3: How stress affects our judgement
[Long passage text...]
Questions 27-40
```

**❌ WRONG APPROACH - Creating Array:**
```json
[
  {
    "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 1",
    "passage": {...},
    "questions": [...]
  },
  {
    "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 2",
    "passage": {...},
    "questions": [...]
  },
  {
    "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 3",
    "passage": {...},
    "questions": [...]
  }
]
```
**Why it fails:** The validator expects an object with `title` and `questions`, not an array.

**✅ CORRECT APPROACH - Merge into Single Quiz:**
```json
{
  "title": "IELTS Cambridge 20 - Test 1 - Reading (Complete)",
  "description": "Full reading test with 3 passages: The kākāpō, Return of the elm, and How stress affects our judgement",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "[Passage 1] There are other parrots that share the kakapo's inability to fly.",
      "passage": {
        "type": "text",
        "content": "The kākāpō is a nocturnal, flightless parrot..."
      },
      "options": ["True", "False", "Not Given"],
      "answer": "False",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "[Passage 1] Adult kakapo produce chicks every year.",
      "passage": {
        "type": "text",
        "content": "The kākāpō is a nocturnal, flightless parrot..."
      },
      "options": ["True", "False", "Not Given"],
      "answer": "False",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "[Passage 2] Which section contains reference to how Dutch elm disease was brought into Britain?",
      "passage": {
        "type": "text",
        "content": "Mark Rowe investigates attempts to reintroduce elms to Britain..."
      },
      "options": ["Section A", "Section B", "Section C"],
      "answer": "Section B",
      "timer": 45,
      "points": 10
    }
  ]
}
```

**Key Principles for Merging:**
1. ✅ **Combine all questions** into a single `questions` array
2. ✅ **Add passage context** to each question using the per-question `passage` field
3. ✅ **Prefix questions** with `[Passage 1]`, `[Passage 2]`, etc. to indicate source
4. ✅ **Create descriptive title** that mentions it's a complete test
5. ✅ **Add description** listing all passages/sections included

---

### Scenario 2: User Requests Separate Files

**If the user explicitly asks for separate files:**

```
User: "Please convert this IELTS test and create separate files for each passage."
```

**✅ CORRECT APPROACH - Create 3 Separate Files:**

**File 1: `IC20T1R-Passage1-Kakapo.json`**
```json
{
  "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 1: The kākāpō",
  "description": "Questions based on 'The kākāpō'",
  "passage": {
    "type": "text",
    "content": "The kākāpō is a nocturnal, flightless parrot..."
  },
  "questions": [...]
}
```

**File 2: `IC20T1R-Passage2-Elm.json`**
```json
{
  "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 2: Return of the elm",
  "description": "Questions based on 'Return of the elm: scheme to reintroduce elms to Britain'",
  "passage": {
    "type": "text",
    "content": "Mark Rowe investigates attempts to reintroduce elms to Britain..."
  },
  "questions": [...]
}
```

**File 3: `IC20T1R-Passage3-Stress.json`**
```json
{
  "title": "IELTS Cambridge 20 - Test 1 - Reading Passage 3: How stress affects our judgement",
  "description": "Questions based on 'How stress affects our judgement'",
  "passage": {
    "type": "text",
    "content": "Some of the most important decisions of our lives occur while we're feeling stressed..."
  },
  "questions": [...]
}
```

**Important:** Clearly tell the user you've created 3 separate files and they need to upload each one individually.

---

### Scenario 3: Listening Tests with Multiple Parts

**Input Example:**
```
TOEFL Listening - Practice Test 5

Part 1: Campus Conversation
[Audio transcript...]
Questions 1-5

Part 2: Biology Lecture
[Audio transcript...]
Questions 6-11

Part 3: Student Discussion
[Audio transcript...]
Questions 12-17
```

**✅ RECOMMENDED APPROACH - Merge with Clear Labels:**
```json
{
  "title": "TOEFL Listening - Practice Test 5 (Complete)",
  "description": "Full listening test with 3 parts: Campus Conversation, Biology Lecture, and Student Discussion",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "[Part 1: Campus Conversation] What is the main topic of the conversation?",
      "passage": {
        "type": "text",
        "content": "[Transcript] Student: Hi, I'm here to ask about..."
      },
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "timer": 30,
      "points": 10
    }
  ]
}
```

---

### When to Merge vs. When to Split

| Situation | Action | Reason |
|-----------|--------|--------|
| User provides full test without specific instructions | **MERGE** into one quiz | Easier for user to upload once |
| User explicitly asks for separate files | **SPLIT** into multiple files | User preference |
| Sections are very different topics (e.g., Reading + Listening) | **ASK USER** or **SPLIT** | Different skill sets |
| Sections share same skill (e.g., 3 reading passages) | **MERGE** | Cohesive test experience |
| Total questions > 50 | **CONSIDER SPLITTING** | Very long quiz sessions |
| Each section has its own passage | **MERGE** with per-question passages | Maintains context |

---

### Technical Implementation

#### Per-Question Passage (Recommended for Multi-Section Tests)

Instead of a single top-level `passage`, attach passage to each question:

```json
{
  "title": "Complete Reading Test",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Question about passage 1...",
      "passage": {
        "type": "text",
        "content": "Passage 1 content here..."
      },
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-choice",
      "question": "Question about passage 2...",
      "passage": {
        "type": "text",
        "content": "Passage 2 content here..."
      },
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "timer": 30,
      "points": 10
    }
  ]
}
```

**Benefits:**
- ✅ Each question shows its relevant passage
- ✅ Students don't need to scroll back to find passage
- ✅ Works perfectly for multi-passage tests
- ✅ Single file upload

---

### Communication Template

When you convert a multi-section test, use this template to inform the user:

```
I've converted your [TEST NAME] into a single quiz file that can be uploaded directly.

**Structure:**
- Title: [TITLE]
- Total Questions: [COUNT]
- Sections Included:
  1. [Section 1 name] - Questions 1-X
  2. [Section 2 name] - Questions X-Y
  3. [Section 3 name] - Questions Y-Z

**Key Features:**
- Each question includes its relevant passage context
- Questions are prefixed with [Section Name] for clarity
- Ready to upload as a single file

**Alternative:** If you prefer separate files for each section, let me know and I'll split them for you.
```

---

### Common Mistakes to Avoid

❌ **Mistake 1: Creating Array at Top Level**
```json
[
  { "title": "Quiz 1", "questions": [...] },
  { "title": "Quiz 2", "questions": [...] }
]
```
**Error:** "Invalid JSON file: Missing or invalid title"

❌ **Mistake 2: Forgetting to Include Passage Context**
```json
{
  "title": "Multi-passage test",
  "questions": [
    { "question": "What does passage 2 say?", ... }
  ]
}
```
**Problem:** Students can't see passage 2 when answering

❌ **Mistake 3: Not Labeling Question Sources**
```json
{
  "question": "What is the main idea?"
}
```
**Problem:** Unclear which passage the question refers to

✅ **Correct:**
```json
{
  "question": "[Passage 2: Climate Change] What is the main idea?"
}
```

---

### Summary Checklist

Before finalizing a multi-section test conversion:

- [ ] Is the output a **single object** (not an array)?
- [ ] Does it have a **title** at the top level?
- [ ] Does it have a **questions array** at the top level?
- [ ] Are passages attached to **individual questions** (not just top-level)?
- [ ] Are questions **labeled** with their section/passage source?
- [ ] Is the **description** clear about what's included?
- [ ] Have you **informed the user** about the structure?
- [ ] If splitting was needed, did you create **separate valid files**?

---

## Question Type Conversion Rules

### 1. Multiple Choice (Single Answer)

**Indicators in Text:**
- "Choose one", "Select the correct answer"
- Options labeled a), b), c), d) or 1), 2), 3), 4)
- Single answer indicated

**JSON Structure:**
```json
{
  "type": "multiple-choice",
  "question": "Question text?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "Option 1",
  "timer": 30,
  "points": 10
}
```

**Conversion Rules:**
- ✅ Remove option labels (a, b, c, d) from option text
- ✅ Match answer letter to actual option text
- ✅ Minimum 2 options, maximum 8 recommended
- ✅ Answer must exactly match one option

---

### 2. Multiple Select (Multiple Answers)

**Indicators in Text:**
- "Select all that apply", "Choose all correct answers"
- "Multiple answers", "(multiple)"
- Answer shows multiple letters: "a, c, d"

**JSON Structure:**
```json
{
  "type": "multiple-select",
  "question": "Question text?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": ["Option 1", "Option 3"],
  "timer": 30,
  "points": 10
}
```

**Conversion Rules:**
- ✅ Answer is an **array** of strings
- ✅ Each answer must exactly match an option
- ✅ Partial credit awarded automatically
- ✅ Add "Select all that apply" to question if not present

---

### 3. Completion (Fill in the Blank)

**Indicators in Text:**
- Blanks shown as "____" or "[blank]"
- "Fill in the blank", "Complete the sentence"
- May include word bank

**JSON Structure (With Word Bank):**
```json
{
  "type": "completion",
  "question": "The _____ is the powerhouse of the cell.",
  "wordBank": ["nucleus", "mitochondria", "ribosome", "chloroplast"],
  "answer": "mitochondria",
  "timer": 30,
  "points": 10
}
```

**JSON Structure (Typed Answer):**
```json
{
  "type": "completion",
  "question": "The _____ is the powerhouse of the cell.",
  "answer": "mitochondria",
  "timer": 30,
  "points": 10
}
```

**JSON Structure (Multiple Acceptable Answers):**
```json
{
  "type": "completion",
  "question": "What is the capital of USA?",
  "answer": ["Washington D.C.", "Washington DC", "DC"],
  "timer": 30,
  "points": 10
}
```

**Conversion Rules:**
- ✅ Keep blanks as "___" in question text
- ✅ If word bank provided, include all words
- ✅ Answer can be string or array of strings
- ✅ Case-insensitive matching applied automatically

---

### 4. Matching

**Indicators in Text:**
- "Match the following", "Pair the items"
- Two columns of items to be matched
- Lines or arrows showing connections

**JSON Structure:**
```json
{
  "type": "matching",
  "question": "Match the programming language to its use case:",
  "items": [
    { "id": "1", "text": "Python" },
    { "id": "2", "text": "JavaScript" },
    { "id": "3", "text": "SQL" }
  ],
  "options": [
    { "id": "a", "text": "Web interactivity" },
    { "id": "b", "text": "Data science" },
    { "id": "c", "text": "Database queries" }
  ],
  "answers": {
    "1": "b",
    "2": "a",
    "3": "c"
  },
  "reusableAnswers": false,
  "timer": 45,
  "points": 10
}
```

**Conversion Rules:**
- ✅ Left column = `items`, Right column = `options`
- ✅ Use simple IDs: "1", "2", "3" for items; "a", "b", "c" for options
- ✅ `answers` maps item IDs to option IDs
- ✅ Set `reusableAnswers: false` unless specified
- ✅ Partial credit awarded automatically

---

### 5. Diagram Labeling

**Indicators in Text:**
- "Label the diagram", "Identify the parts"
- Reference to an image/diagram
- Numbered labels or blanks

**JSON Structure:**
```json
{
  "type": "diagram-labeling",
  "question": "Label the parts of the cell:",
  "diagramUrl": "https://example.com/cell-diagram.png",
  "labels": [
    {
      "id": "1",
      "sentence": "The control center of the cell",
      "answer": "nucleus",
      "inputType": "text"
    },
    {
      "id": "2",
      "sentence": "Powerhouse of the cell",
      "answer": "mitochondria",
      "inputType": "text"
    },
    {
      "id": "3",
      "sentence": "Cell membrane function",
      "answer": "protection",
      "inputType": "mcq",
      "options": ["protection", "energy", "reproduction"]
    }
  ],
  "timer": 60,
  "points": 10
}
```

**Conversion Rules:**
- ✅ `diagramUrl` required (use placeholder if not provided)
- ✅ Each label needs unique `id`
- ✅ `inputType` can be "text" or "mcq"
- ✅ If MCQ, include `options` array
- ✅ Partial credit awarded automatically

---

### 6. True/False/Not Given

**Indicators in Text:**
- "True, False, or Not Given"
- "T/F/NG", "TFNG"
- Common in IELTS reading comprehension
- Statement to evaluate against passage

**JSON Structure:**
```json
{
  "type": "true-false-not-given",
  "question": "The author believes climate change is the most pressing issue.",
  "answer": "True",
  "timer": 30,
  "points": 10
}
```

**Conversion Rules:**
- ✅ No `options` array needed (auto-generated: True, False, Not Given)
- ✅ Answer must be exactly: "True", "False", or "Not Given"
- ✅ Case-sensitive: Use proper capitalization
- ✅ Common with passage-based questions

**Usage Context:**
- **True**: Statement is explicitly stated or clearly implied in the passage
- **False**: Statement contradicts information in the passage
- **Not Given**: Information is not mentioned or cannot be determined from the passage

---

### 7. Yes/No/Not Given

**Indicators in Text:**
- "Yes, No, or Not Given"
- "Y/N/NG", "YNNG"
- Common in IELTS reading comprehension
- Opinion/claim to evaluate

**JSON Structure:**
```json
{
  "type": "yes-no-not-given",
  "question": "Does the author agree that technology improves education?",
  "answer": "Yes",
  "timer": 30,
  "points": 10
}
```

**Conversion Rules:**
- ✅ No `options` array needed (auto-generated: Yes, No, Not Given)
- ✅ Answer must be exactly: "Yes", "No", or "Not Given"
- ✅ Case-sensitive: Use proper capitalization
- ✅ Common with passage-based questions

**Usage Context:**
- **Yes**: Author's opinion/claim agrees with the statement
- **No**: Author's opinion/claim disagrees with the statement
- **Not Given**: Author's opinion/claim is not stated or cannot be determined

**Difference from True/False/Not Given:**
- True/False/Not Given → Facts and information
- Yes/No/Not Given → Opinions, views, and claims

---

## Step-by-Step Conversion Process

### Step 1: Identify Quiz Metadata

**Look for:**
- Title (first line, heading, or "Quiz:", "Test:")
- Description (subtitle, introduction paragraph)
- General instructions
- Passage (reading comprehension text)

**Extract:**
```json
{
  "title": "Extract from first line or heading",
  "description": "Extract from subtitle or intro",
  "passage": {
    "type": "text",
    "content": "Extract if present"
  }
}
```

---

### Step 2: Identify Question Boundaries

**Markers:**
- Numbered questions: "1.", "2.", "Q1:", "Question 1:"
- Blank lines between questions
- New question indicators: "Next question", "---"

**Action:**
- Split text into individual question blocks
- Preserve all content within each block

---

### Step 3: Determine Question Type

**Decision Tree:**

```
Does it say "True/False/Not Given" or "T/F/NG"?
├─ YES → true-false-not-given
└─ NO
   ├─ Does it say "Yes/No/Not Given" or "Y/N/NG"?
   │  └─ YES → yes-no-not-given
   └─ NO
      ├─ Does it have multiple correct answers indicated?
      │  └─ YES → multiple-select
      └─ NO
         ├─ Does it have blanks (___)?
         │  └─ YES → completion
         └─ NO
            ├─ Does it have two columns to match?
            │  └─ YES → matching
            └─ NO
               ├─ Does it reference a diagram/image?
               │  └─ YES → diagram-labeling
               └─ NO → multiple-choice (default)
```

---

### Step 4: Extract Question Components

**For Each Question:**

1. **Question Text:**
   - Remove question number
   - Remove type indicators
   - Clean up formatting
   - Keep blanks as "___"

2. **Options:**
   - Remove labels (a), b), 1), 2))
   - Trim whitespace
   - Preserve exact text

3. **Answer:**
   - Match letter/number to option text
   - For multiple-select: create array
   - For completion: extract exact answer
   - For matching: create ID mappings

4. **Timer & Points:**
   - Use defaults if not specified
   - Extract if mentioned in text

---

### Step 5: Validate JSON Structure

**Check:**
- ✅ All required fields present
- ✅ Answer matches option text exactly
- ✅ Arrays properly formatted
- ✅ IDs are unique
- ✅ No trailing commas
- ✅ Proper JSON syntax

---

## Common Text Patterns

### Pattern 1: Standard Multiple Choice

**Input:**
```
1. What is Python?
   a) A snake
   b) A programming language
   c) A type of code
   d) A framework
   Correct answer: b
```

**Output:**
```json
{
  "type": "multiple-choice",
  "question": "What is Python?",
  "options": [
    "A snake",
    "A programming language",
    "A type of code",
    "A framework"
  ],
  "answer": "A programming language",
  "timer": 30,
  "points": 10
}
```

---

### Pattern 2: Multiple Select with Indicators

**Input:**
```
2. Select all data types in Python: (multiple answers)
   a) Integer
   b) HTML
   c) String
   d) Boolean
   Answers: a, c, d
```

**Output:**
```json
{
  "type": "multiple-select",
  "question": "Select all data types in Python:",
  "options": [
    "Integer",
    "HTML",
    "String",
    "Boolean"
  ],
  "answer": ["Integer", "String", "Boolean"],
  "timer": 30,
  "points": 10
}
```

---

### Pattern 3: Fill in the Blank

**Input:**
```
3. The _____ function is used to display output in Python.
   Word Bank: print, input, return, def
   Answer: print
```

**Output:**
```json
{
  "type": "completion",
  "question": "The _____ function is used to display output in Python.",
  "wordBank": ["print", "input", "return", "def"],
  "answer": "print",
  "timer": 30,
  "points": 10
}
```

---

### Pattern 4: Matching Pairs

**Input:**
```
4. Match the term to its definition:
   
   Terms:
   1. Variable
   2. Function
   3. Loop
   
   Definitions:
   a. Repeats code
   b. Stores data
   c. Reusable code block
   
   Answers: 1-b, 2-c, 3-a
```

**Output:**
```json
{
  "type": "matching",
  "question": "Match the term to its definition:",
  "items": [
    { "id": "1", "text": "Variable" },
    { "id": "2", "text": "Function" },
    { "id": "3", "text": "Loop" }
  ],
  "options": [
    { "id": "a", "text": "Repeats code" },
    { "id": "b", "text": "Stores data" },
    { "id": "c", "text": "Reusable code block" }
  ],
  "answers": {
    "1": "b",
    "2": "c",
    "3": "a"
  },
  "reusableAnswers": false,
  "timer": 45,
  "points": 10
}
```

---

### Pattern 5: True/False/Not Given

**Input:**
```
5. The passage states that Python was created in 1991. (T/F/NG)
   Answer: True
```

**Output:**
```json
{
  "type": "true-false-not-given",
  "question": "The passage states that Python was created in 1991.",
  "answer": "True",
  "timer": 30,
  "points": 10
}
```

---

### Pattern 6: Yes/No/Not Given

**Input:**
```
6. Does the author believe that AI will replace programmers? (Y/N/NG)
   Answer: No
```

**Output:**
```json
{
  "type": "yes-no-not-given",
  "question": "Does the author believe that AI will replace programmers?",
  "answer": "No",
  "timer": 30,
  "points": 10
}
```

---

## Validation Checklist

### Before Submitting JSON

- [ ] **Valid JSON Syntax**
  - No trailing commas
  - Proper quotes (double quotes only)
  - Balanced brackets and braces
  - **Valid escape sequences only** (see critical warning below)

- [ ] **Required Fields Present**
  - `title` at top level
  - `questions` array at top level
  - `type` for each question
  - `question` text for each question
  - `answer` for each question

- [ ] **Answer Validation**
  - Multiple-choice: answer matches one option exactly
  - Multiple-select: answer is array, all match options
  - Completion: answer is string or array of strings
  - Matching: all item IDs map to valid option IDs
  - Diagram-labeling: all labels have answers

- [ ] **Data Types Correct**
  - Strings in quotes
  - Numbers without quotes
  - Booleans as true/false (no quotes)
  - Arrays use square brackets []
  - Objects use curly braces {}

- [ ] **Consistency**
  - Timer values reasonable (15-120 seconds)
  - Points values consistent (usually 10)
  - Option count reasonable (2-8 for MCQ)

---

### 🚨 CRITICAL: Escape Sequences in Passage Text

**Common Error:** Invalid escape sequences in long passage content will cause "Invalid JSON file" errors.

#### Valid JSON Escape Sequences

Only these escape sequences are allowed in JSON strings:

| Escape | Meaning | Example |
|--------|---------|---------|
| `\"` | Double quote | `"He said \"Hello\""` |
| `\\` | Backslash | `"C:\\Users\\file.txt"` |
| `\/` | Forward slash | `"http:\/\/example.com"` |
| `\n` | Newline | `"Line 1\nLine 2"` |
| `\r` | Carriage return | `"Text\r\n"` |
| `\t` | Tab | `"Name:\tValue"` |
| `\b` | Backspace | Rarely used |
| `\f` | Form feed | Rarely used |
| `\uXXXX` | Unicode | `"\u00A9"` for © |

#### Invalid Escape Sequences (WILL CAUSE ERRORS)

❌ **WRONG - These will break your JSON:**
```json
{
  "content": "First paragraph.\n\As a result..."
}
```
**Error:** `\A` is not a valid escape sequence

❌ **WRONG - Missing second newline:**
```json
{
  "content": "Paragraph 1.\n\The next paragraph..."
}
```
**Error:** `\T` is not a valid escape sequence

✅ **CORRECT - Use double newlines for paragraph breaks:**
```json
{
  "content": "First paragraph.\n\nAs a result, the next paragraph begins..."
}
```

✅ **CORRECT - Or use single newline if not starting with capital:**
```json
{
  "content": "First sentence.\nthe next sentence continues..."
}
```

#### Common Patterns That Cause Errors

**Pattern:** `\n\[Capital Letter]` → Often happens when converting paragraphs

**Examples of errors:**
- `\n\As` → Should be `\n\nAs`
- `\n\The` → Should be `\n\nThe`
- `\n\In` → Should be `\n\nIn`
- `\n\However` → Should be `\n\nHowever`
- `\n\This` → Should be `\n\nThis`

#### How to Fix

**Find and Replace Pattern:**
```
Find:    \n\([A-Z])
Replace: \n\n$1
```

Or manually check that every `\n` followed by a capital letter has a second `\n`:
- ✅ `\n\nAs` - Correct
- ❌ `\n\As` - Wrong

#### Validation Command

Before uploading, validate your JSON:

**Node.js:**
```javascript
const fs = require('fs');
const data = fs.readFileSync('your-file.json', 'utf8');
try {
  JSON.parse(data);
  console.log('✓ Valid JSON');
} catch (e) {
  console.log('✗ Invalid:', e.message);
}
```

**Online Tools:**
- https://jsonlint.com/
- https://jsonformatter.org/

#### Real-World Example

**This caused an error:**
```json
{
  "passage": {
    "content": "The study showed results.\n\As a result, we concluded..."
  }
}
```
**Error:** `Bad escaped character in JSON`

**Fixed version:**
```json
{
  "passage": {
    "content": "The study showed results.\n\nAs a result, we concluded..."
  }
}
```

#### Prevention Tips

1. **Always use `\n\n` for paragraph breaks** (two newlines)
2. **Never use `\` before regular letters** (only before special characters)
3. **Validate JSON before uploading** using online tools or Node.js
4. **If you see "Invalid JSON file"**, check for escape sequence errors first
5. **Use a JSON validator** that shows the exact error position

---

## Complete Examples

### Example 1: Simple Quiz

**Input Text:**
```
Python Basics Quiz
Test your knowledge of Python fundamentals

1. What does print() do?
   a) Saves data
   b) Displays output
   c) Creates variables
   d) Runs loops
   Answer: b

2. Which are valid Python data types? (select all)
   a) int
   b) html
   c) str
   d) bool
   Answers: a, c, d

3. A _____ is used to store data in Python.
   Answer: variable
```

**Output JSON:**
```json
{
  "title": "Python Basics Quiz",
  "description": "Test your knowledge of Python fundamentals",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What does print() do?",
      "options": [
        "Saves data",
        "Displays output",
        "Creates variables",
        "Runs loops"
      ],
      "answer": "Displays output",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-select",
      "question": "Which are valid Python data types?",
      "options": [
        "int",
        "html",
        "str",
        "bool"
      ],
      "answer": ["int", "str", "bool"],
      "timer": 30,
      "points": 10
    },
    {
      "type": "completion",
      "question": "A _____ is used to store data in Python.",
      "answer": "variable",
      "timer": 30,
      "points": 10
    }
  ]
}
```

---

### Example 2: Quiz with Passage

**Input Text:**
```
Reading Comprehension: The Water Cycle

Passage:
The water cycle is the continuous movement of water on, above, and below the surface of the Earth. Water evaporates from bodies of water, forms clouds, and returns to Earth as precipitation. This cycle is essential for life on Earth.

1. What is the water cycle?
   a) Movement of air
   b) Movement of water
   c) Movement of rocks
   d) Movement of plants
   Answer: b

2. Select all stages of the water cycle:
   a) Evaporation
   b) Combustion
   c) Precipitation
   d) Condensation
   Answers: a, c, d
```

**Output JSON:**
```json
{
  "title": "Reading Comprehension: The Water Cycle",
  "passage": {
    "type": "text",
    "content": "The water cycle is the continuous movement of water on, above, and below the surface of the Earth. Water evaporates from bodies of water, forms clouds, and returns to Earth as precipitation. This cycle is essential for life on Earth."
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is the water cycle?",
      "options": [
        "Movement of air",
        "Movement of water",
        "Movement of rocks",
        "Movement of plants"
      ],
      "answer": "Movement of water",
      "timer": 30,
      "points": 10
    },
    {
      "type": "multiple-select",
      "question": "Select all stages of the water cycle:",
      "options": [
        "Evaporation",
        "Combustion",
        "Precipitation",
        "Condensation"
      ],
      "answer": ["Evaporation", "Precipitation", "Condensation"],
      "timer": 30,
      "points": 10
    }
  ]
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Answer Doesn't Match Options

**Problem:**
```json
{
  "options": ["Option A", "Option B"],
  "answer": "A"  // ❌ Wrong: doesn't match option text
}
```

**Solution:**
```json
{
  "options": ["Option A", "Option B"],
  "answer": "Option A"  // ✅ Correct: matches exactly
}
```

---

#### Issue 2: Multiple-Select Answer Not Array

**Problem:**
```json
{
  "type": "multiple-select",
  "answer": "Option A, Option B"  // ❌ Wrong: string, not array
}
```

**Solution:**
```json
{
  "type": "multiple-select",
  "answer": ["Option A", "Option B"]  // ✅ Correct: array
}
```

---

#### Issue 3: Missing Required Fields

**Problem:**
```json
{
  "question": "What is this?",
  "options": ["A", "B"]
  // ❌ Missing: type, answer
}
```

**Solution:**
```json
{
  "type": "multiple-choice",  // ✅ Added
  "question": "What is this?",
  "options": ["A", "B"],
  "answer": "A",  // ✅ Added
  "timer": 30,
  "points": 10
}
```

---

#### Issue 4: Matching IDs Don't Match

**Problem:**
```json
{
  "items": [{ "id": "1", "text": "Item" }],
  "options": [{ "id": "a", "text": "Option" }],
  "answers": {
    "1": "b"  // ❌ Wrong: "b" doesn't exist in options
  }
}
```

**Solution:**
```json
{
  "items": [{ "id": "1", "text": "Item" }],
  "options": [{ "id": "a", "text": "Option" }],
  "answers": {
    "1": "a"  // ✅ Correct: "a" exists in options
  }
}
```

---

## Advanced Features

### Timer Customization

Different question types may need different times:

```json
{
  "type": "multiple-choice",
  "timer": 20  // Quick question
}

{
  "type": "matching",
  "timer": 60  // More complex, needs more time
}

{
  "type": "diagram-labeling",
  "timer": 90  // Most complex
}
```

### Points Customization

Harder questions can award more points:

```json
{
  "type": "multiple-choice",
  "points": 5  // Easy question
}

{
  "type": "multiple-select",
  "points": 10  // Medium difficulty
}

{
  "type": "matching",
  "points": 15  // Hard question
}
```

### Passage with Image

```json
{
  "passage": {
    "type": "both",
    "content": "This diagram shows a cell structure.",
    "imageUrl": "https://example.com/cell.png",
    "caption": "Figure 1: Plant Cell"
  }
}
```

---

## Best Practices

### 1. Question Writing

- ✅ **Clear and concise:** Avoid ambiguous wording
- ✅ **Complete sentences:** End with proper punctuation
- ✅ **No hints in options:** Don't make one option obviously correct
- ✅ **Consistent formatting:** Use same style throughout

### 2. Option Writing

- ✅ **Similar length:** Avoid one option being much longer
- ✅ **Parallel structure:** Use same grammatical form
- ✅ **No "all of the above":** Doesn't work well with partial credit
- ✅ **Plausible distractors:** Wrong options should be reasonable

### 3. Answer Keys

- ✅ **Double-check:** Verify answer matches option exactly
- ✅ **Case-sensitive:** Match capitalization exactly
- ✅ **Whitespace:** Remove extra spaces
- ✅ **Special characters:** Include if present in option

### 4. Timing

- ✅ **Read time:** Allow ~1 second per word in question
- ✅ **Think time:** Add 10-15 seconds for thinking
- ✅ **Complexity:** Add more time for complex questions
- ✅ **Minimum:** Never less than 15 seconds

---

## Quick Reference Card

### Question Type Decision Matrix

| If Text Has... | Use Type | Key Fields |
|----------------|----------|------------|
| "True/False/Not Given", "T/F/NG" | `true-false-not-given` | `answer` (True/False/Not Given) |
| "Yes/No/Not Given", "Y/N/NG" | `yes-no-not-given` | `answer` (Yes/No/Not Given) |
| Single answer, options a-d | `multiple-choice` | `options[]`, `answer` (string) |
| "Select all", multiple answers | `multiple-select` | `options[]`, `answer` (array) |
| Blanks "___" | `completion` | `answer` (string/array), optional `wordBank[]` |
| Two columns to match | `matching` | `items[]`, `options[]`, `answers{}` |
| "Label diagram", image ref | `diagram-labeling` | `diagramUrl`, `labels[]` |

### Default Values

```json
{
  "timer": 30,
  "points": 10,
  "reusableAnswers": false
}
```

### Required vs Optional

**Required:**
- `title` (top level)
- `questions` (top level)
- `type` (each question)
- `question` (each question)
- `answer` (each question)

**Optional:**
- `description` (top level)
- `passage` (top level or per question)
- `timer` (each question, default: 30)
- `points` (each question, default: 10)

---

## Testing Your JSON

### Online Validators

1. **JSONLint:** https://jsonlint.com/
2. **JSON Formatter:** https://jsonformatter.org/
3. **JSON Editor Online:** https://jsoneditoronline.org/

### Manual Checks

```javascript
// 1. Can it be parsed?
JSON.parse(yourJsonString);

// 2. Does it have required fields?
const quiz = JSON.parse(yourJsonString);
console.log(quiz.title);  // Should not be undefined
console.log(quiz.questions);  // Should be an array

// 3. Are answers valid?
quiz.questions.forEach(q => {
  if (q.type === 'multiple-choice') {
    console.log(q.options.includes(q.answer));  // Should be true
  }
});
```

---

## Conclusion

This guide provides everything needed to convert plain text tests into the JSON format required by this quiz application. Follow the patterns, validate carefully, and test your output.

**Remember:**
- ✅ Match answer text exactly to options
- ✅ Use arrays for multiple-select answers
- ✅ Include all required fields
- ✅ Validate JSON syntax
- ✅ Test with online validators

**For Support:**
- See `documentation/system/0002-quiz-json-schema.md` for detailed schema
- See example quizzes in the application
- Check validation errors carefully

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Maintained By:** Development Team
