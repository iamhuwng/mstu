# Quiz JSON Schema

This document outlines the JSON structure for quizzes, including the overall quiz structure and the different question types.

---

## Top-Level Quiz Structure

```json
{
  "title": "string",
  "description": "string",
  "passage": { ... },
  "questions": [ ... ]
}
```

- **`title`** (string, required): The title of the quiz.
- **`description`** (string, optional): A brief description of the quiz.
- **`passage`** (object, optional): A passage to be displayed for the entire quiz. See the [Passage Schema](#passage-schema) for more details.
- **`questions`** (array, required): An array of question objects.

---

## Question Types

### Multiple Choice

**Type:** `multiple-choice`

```json
{
  "type": "multiple-choice",
  "question": "string",
  "options": ["string", "string", ...],
  "answer": "string",
  "timer": "number",
  "points": "number"
}
```

### Multiple Select

**Type:** `multiple-select`

```json
{
  "type": "multiple-select",
  "question": "string",
  "options": ["string", "string", ...],
  "answer": ["string", "string", ...],
  "timer": "number",
  "points": "number"
}
```

### Completion

**Type:** `completion`

**With Word Bank:**
```json
{
  "type": "completion",
  "question": "string",
  "wordBank": ["string", "string", ...],
  "answer": "string",
  "timer": "number",
  "points": "number"
}
```

**Typed Answer:**
```json
{
  "type": "completion",
  "question": "string",
  "answer": "string" or ["string", "string", ...],
  "timer": "number",
  "points": "number"
}
```

### Matching

**Type:** `matching`

```json
{
  "type": "matching",
  "question": "string",
  "items": [
    {
      "id": "string",
      "text": "string"
    }
  ],
  "options": [
    {
      "id": "string",
      "text": "string"
    }
  ],
  "answers": {
    "itemId": "optionId"
  },
  "reusableAnswers": "boolean",
  "timer": "number",
  "points": "number"
}
```

### Diagram Labeling

**Type:** `diagram-labeling`

```json
{
  "type": "diagram-labeling",
  "question": "string",
  "diagramUrl": "string",
  "labels": [
    {
      "id": "string",
      "sentence": "string",
      "answer": "string",
      "inputType": "string",
      "options": ["string", "string", ...]
    }
  ],
  "timer": "number",
  "points": "number"
}
```

### True/False/Not Given

**Type:** `true-false-not-given`

```json
{
  "type": "true-false-not-given",
  "question": "string",
  "answer": "True" | "False" | "Not Given",
  "timer": "number",
  "points": "number"
}
```

**Note:** This question type automatically provides three options: "True", "False", and "Not Given". No `options` array is needed.

### Yes/No/Not Given

**Type:** `yes-no-not-given`

```json
{
  "type": "yes-no-not-given",
  "question": "string",
  "answer": "Yes" | "No" | "Not Given",
  "timer": "number",
  "points": "number"
}
```

**Note:** This question type automatically provides three options: "Yes", "No", and "Not Given". No `options` array is needed.

---

## Passage Schema

A `passage` object can be included at the top level of the quiz or within a question. It has the following structure:

```json
{
  "type": "text" | "image" | "both",
  "content": "string",
  "imageUrl": "string",
  "caption": "string"
}
```

- **`type`** (string, required): The type of passage. Can be `text`, `image`, or `both`.
- **`content`** (string, conditional): The text content of the passage. Required if `type` is `text` or `both`.
- **`imageUrl`** (string, conditional): The URL of the image. Required if `type` is `image` or `both`.
- **`caption`** (string, optional): A caption for the image.
