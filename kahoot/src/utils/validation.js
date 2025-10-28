export const validateQuizJson = (quiz) => {
  if (!quiz.title || typeof quiz.title !== 'string') {
    return { valid: false, error: 'Missing or invalid title' };
  }

  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    return { valid: false, error: 'Missing or invalid questions array' };
  }

  for (const question of quiz.questions) {
    if (!question.question || typeof question.question !== 'string') {
      return { valid: false, error: 'Missing or invalid question text' };
    }

    // Set default type to 'multiple-choice' if not specified
    const questionType = question.type || 'multiple-choice';

    // Validate based on question type
    if (questionType === 'completion') {
      if (!question.answer) {
        return { valid: false, error: 'Missing or invalid answer' };
      }

      if (question.wordBank) {
        if (!Array.isArray(question.wordBank)) {
          return { valid: false, error: 'Completion question must have a wordBank array' };
        }
        if (question.wordBank.length < 2) {
          return { valid: false, error: 'Word bank must have at least 2 words' };
        }
        if (typeof question.answer !== 'string' || !question.wordBank.includes(question.answer)) {
          return { valid: false, error: `Answer "${question.answer}" is not in the word bank` };
        }
      } else {
        // Typed answer validation
        if (typeof question.answer !== 'string' && !Array.isArray(question.answer)) {
          return { valid: false, error: 'Typed completion question answer must be a string or an array of strings' };
        }
        if (Array.isArray(question.answer) && (question.answer.length === 0 || question.answer.some(a => typeof a !== 'string'))) {
          return { valid: false, error: 'Typed completion answer array must not be empty and all answers must be strings' };
        }
      }
    } else if (questionType === 'diagram-labeling') {
      // Diagram labeling questions don't need options array
      if (!question.diagramUrl || typeof question.diagramUrl !== 'string') {
        return { valid: false, error: 'Diagram labeling question must have a diagramUrl' };
      }
      if (!question.labels || !Array.isArray(question.labels) || question.labels.length === 0) {
        return { valid: false, error: 'Diagram labeling question must have a non-empty labels array' };
      }
    } else if (questionType === 'true-false-not-given') {
      // True/False/Not Given questions don't need options array (auto-generated)
      if (!question.answer || typeof question.answer !== 'string') {
        return { valid: false, error: 'True/False/Not Given question must have an answer' };
      }
      const validAnswers = ['True', 'False', 'Not Given'];
      if (!validAnswers.includes(question.answer)) {
        return { valid: false, error: `True/False/Not Given answer must be one of: ${validAnswers.join(', ')}` };
      }
    } else if (questionType === 'yes-no-not-given') {
      // Yes/No/Not Given questions don't need options array (auto-generated)
      if (!question.answer || typeof question.answer !== 'string') {
        return { valid: false, error: 'Yes/No/Not Given question must have an answer' };
      }
      const validAnswers = ['Yes', 'No', 'Not Given'];
      if (!validAnswers.includes(question.answer)) {
        return { valid: false, error: `Yes/No/Not Given answer must be one of: ${validAnswers.join(', ')}` };
      }
    } else {
      // All other question types require options array
      if (!question.options || !Array.isArray(question.options)) {
        return { valid: false, error: 'Missing or invalid options array' };
      }

      if (question.options.length < 2) {
        return { valid: false, error: 'A question must have at least two options' };
      }

      // Validate answer based on question type
      if (questionType === 'multiple-select') {
        // Multiple-select questions must have answer as an array
        if (!question.answer || !Array.isArray(question.answer)) {
          return { valid: false, error: 'Multiple-select question must have answer as an array' };
        }

        if (question.answer.length < 2) {
          return { valid: false, error: 'Multiple-select question must have at least 2 correct answers' };
        }

        // Verify all answers exist in options
        for (const ans of question.answer) {
          if (!question.options.includes(ans)) {
            return { valid: false, error: `Answer "${ans}" is not in the options array` };
          }
        }
      } else if (questionType === 'matching') {
        if (!question.items || !Array.isArray(question.items) || question.items.length === 0) {
          return { valid: false, error: 'Matching question must have a non-empty items array' };
        }
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          return { valid: false, error: 'Matching question must have a non-empty options array' };
        }
        if (!question.answers || typeof question.answers !== 'object' || Object.keys(question.answers).length === 0) {
          return { valid: false, error: 'Matching question must have a non-empty answers object' };
        }
      } else if (questionType === 'multiple-choice') {
        // Single-answer questions (multiple-choice, etc.)
        if (!question.answer || typeof question.answer !== 'string') {
          return { valid: false, error: 'Missing or invalid answer' };
        }
      }
    }
  }

  return { valid: true, error: null };
};
