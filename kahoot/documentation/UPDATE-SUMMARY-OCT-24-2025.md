# Documentation Update Summary - October 24, 2025

## Issue Identified

**Problem:** `IC20T1R.json` file was rejected with "Invalid JSON file" error when uploaded through Teacher Lobby.

**Root Cause:** The JSON file contained an **array of 3 quiz objects** at the top level:
```json
[
  { "title": "Passage 1", "questions": [...] },
  { "title": "Passage 2", "questions": [...] },
  { "title": "Passage 3", "questions": [...] }
]
```

But the validation system expects a **single quiz object**:
```json
{
  "title": "Quiz Title",
  "questions": [...]
}
```

**Why it happened:** The AI assistant followed the guide but didn't have clear instructions for handling multi-section tests (like IELTS Reading with 3 passages).

---

## Solution Implemented

Updated `documentation/AI-TEST-CONVERSION-GUIDE.md` with a comprehensive new section:

### **Section 3: IMPORTANT: Multi-Section Test Handling**

This section includes:

1. **🚨 CRITICAL RULE** - Explicitly states that only single quiz objects are accepted, not arrays

2. **Decision Framework** with 3 scenarios:
   - **Scenario 1:** Multiple independent sections (default: merge into one quiz)
   - **Scenario 2:** User explicitly requests separate files (create multiple files)
   - **Scenario 3:** Listening tests with multiple parts (merge with labels)

3. **When to Merge vs. When to Split** - Decision matrix table

4. **Technical Implementation** - Per-question passage approach for multi-section tests

5. **Communication Template** - Standard message for AI to inform users

6. **Common Mistakes to Avoid** - Shows wrong approaches and why they fail

7. **Summary Checklist** - 8-point validation checklist before finalizing

---

## Key Principles Added

### For AI Assistants Converting Multi-Section Tests:

✅ **Default Action:** MERGE all sections into a single quiz object
✅ **Add passage to each question** using per-question `passage` field
✅ **Prefix questions** with `[Passage 1]`, `[Passage 2]`, etc.
✅ **Create descriptive title** mentioning it's a complete test
✅ **Add description** listing all sections included

### Example Structure:
```json
{
  "title": "IELTS Cambridge 20 - Test 1 - Reading (Complete)",
  "description": "Full reading test with 3 passages: The kākāpō, Return of the elm, and How stress affects our judgement",
  "questions": [
    {
      "question": "[Passage 1] Question text...",
      "passage": {
        "type": "text",
        "content": "Passage 1 content..."
      },
      ...
    },
    {
      "question": "[Passage 2] Question text...",
      "passage": {
        "type": "text",
        "content": "Passage 2 content..."
      },
      ...
    }
  ]
}
```

---

## Benefits

1. **Prevents the array error** - AI will now merge sections by default
2. **Better user experience** - Single file upload instead of 3 separate files
3. **Maintains context** - Each question includes its relevant passage
4. **Clear labeling** - Questions prefixed with passage/section identifiers
5. **Flexibility** - Still allows splitting if user explicitly requests it

---

## Files Modified

- `documentation/AI-TEST-CONVERSION-GUIDE.md`
  - Added Section 3: Multi-Section Test Handling (~350 lines)
  - Updated Table of Contents
  - Updated "Last Updated" date to October 24, 2025

---

## Next Steps for User

For the existing `IC20T1R.json` file, you have two options:

### Option A: Ask AI to Re-convert (Recommended)
Ask your AI assistant to convert the IELTS test again, and it will now follow the new guidelines to create a single merged quiz.

### Option B: Manual Fix
You can manually merge the 3 quiz objects into one by:
1. Keeping only the outer `{}`
2. Combining all questions into one array
3. Adding passage context to each question
4. Prefixing questions with `[Passage 1]`, `[Passage 2]`, `[Passage 3]`

---

## Testing Recommendation

Test the updated guide by:
1. Providing a multi-section test to an AI assistant
2. Verifying it produces a single quiz object (not an array)
3. Uploading through Teacher Lobby
4. Confirming it passes validation

---

**Document Created:** October 24, 2025  
**Issue Resolved:** Multi-section test conversion guidance  
**Impact:** Prevents "Invalid JSON file" errors for IELTS, TOEFL, and similar multi-passage tests
