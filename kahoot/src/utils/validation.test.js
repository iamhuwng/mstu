import { validateQuizJson } from './validation';

describe('validateQuizJson', () => {
  it('should return valid for a correct schema', () => {
    const validQuiz = {
      title: 'My Awesome Quiz',
      questions: [
        {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5'],
          answer: '4',
        },
      ],
    };
    const { valid, error } = validateQuizJson(validQuiz);
    expect(valid).toBe(true);
    expect(error).toBeNull();
  });

  it('should return invalid for a missing title', () => {
    const invalidQuiz = {
      questions: [
        {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5'],
          answer: '4',
        },
      ],
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('Missing or invalid title');
  });

  it('should return invalid for a missing questions array', () => {
    const invalidQuiz = {
      title: 'My Awesome Quiz',
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('Missing or invalid questions array');
  });

  it('should return invalid for a question with missing text', () => {
    const invalidQuiz = {
      title: 'My Awesome Quiz',
      questions: [
        {
          options: ['3', '4', '5'],
          answer: '4',
        },
      ],
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('Missing or invalid question text');
  });

  it('should return invalid for a question with missing options', () => {
    const invalidQuiz = {
      title: 'My Awesome Quiz',
      questions: [
        {
          question: 'What is 2 + 2?',
          answer: '4',
        },
      ],
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('Missing or invalid options array');
  });

  it('should return invalid for a question with less than two options', () => {
    const invalidQuiz = {
      title: 'My Awesome Quiz',
      questions: [
        {
          question: 'What is 2 + 2?',
          options: ['4'],
          answer: '4',
        },
      ],
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('A question must have at least two options');
  });

  it('should return invalid for a question with a missing answer', () => {
    const invalidQuiz = {
      title: 'My Awesome Quiz',
      questions: [
        {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5'],
        },
      ],
    };
    const { valid, error } = validateQuizJson(invalidQuiz);
    expect(valid).toBe(false);
    expect(error).toBe('Missing or invalid answer');
  });

  describe('multiple-select questions', () => {
    it('should return valid for a correct multiple-select question', () => {
      const validQuiz = {
        title: 'Multiple Select Quiz',
        questions: [
          {
            type: 'multiple-select',
            question: 'Which of these are programming languages?',
            options: ['Python', 'HTML', 'JavaScript', 'CSS'],
            answer: ['Python', 'JavaScript'],
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });

    it('should return invalid when multiple-select answer is not an array', () => {
      const invalidQuiz = {
        title: 'Multiple Select Quiz',
        questions: [
          {
            type: 'multiple-select',
            question: 'Which of these are programming languages?',
            options: ['Python', 'HTML', 'JavaScript', 'CSS'],
            answer: 'Python',
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Multiple-select question must have answer as an array');
    });

    it('should return invalid when multiple-select has less than 2 correct answers', () => {
      const invalidQuiz = {
        title: 'Multiple Select Quiz',
        questions: [
          {
            type: 'multiple-select',
            question: 'Which of these are programming languages?',
            options: ['Python', 'HTML', 'JavaScript', 'CSS'],
            answer: ['Python'],
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Multiple-select question must have at least 2 correct answers');
    });

    it('should return invalid when answer is not in options', () => {
      const invalidQuiz = {
        title: 'Multiple Select Quiz',
        questions: [
          {
            type: 'multiple-select',
            question: 'Which of these are programming languages?',
            options: ['Python', 'HTML', 'JavaScript', 'CSS'],
            answer: ['Python', 'Ruby'],
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Answer "Ruby" is not in the options array');
    });
  });

  describe('completion questions', () => {
    it('should return valid for a correct completion question', () => {
      const validQuiz = {
        title: 'Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of France is _____.',
            wordBank: ['Paris', 'London', 'Berlin', 'Madrid'],
            answer: 'Paris',
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });

    it('should return invalid when wordBank is not an array', () => {
      const invalidQuiz = {
        title: 'Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of France is _____.',
            wordBank: 'Paris, London, Berlin',
            answer: 'Paris',
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Completion question must have a wordBank array');
    });

    it('should return invalid when wordBank has less than 2 words', () => {
      const invalidQuiz = {
        title: 'Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of France is _____.',
            wordBank: ['Paris'],
            answer: 'Paris',
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Word bank must have at least 2 words');
    });

    it('should return invalid when answer is not in wordBank', () => {
      const invalidQuiz = {
        title: 'Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of France is _____.',
            wordBank: ['London', 'Berlin', 'Madrid'],
            answer: 'Paris',
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Answer "Paris" is not in the word bank');
    });

    it('should return invalid when completion question has no answer', () => {
      const invalidQuiz = {
        title: 'Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of France is _____.',
            wordBank: ['Paris', 'London', 'Berlin', 'Madrid'],
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Missing or invalid answer');
    });
  });

  describe('typed-input completion questions', () => {
    it('should return valid for a typed completion question with a string answer', () => {
      const validQuiz = {
        title: 'Typed Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of Spain is _____.',
            answer: 'Madrid',
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });

    it('should return valid for a typed completion question with an array of string answers', () => {
      const validQuiz = {
        title: 'Typed Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of Spain is _____.',
            answer: ['Madrid', 'madrid'],
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });

    it('should return invalid for a typed completion question with a non-string answer', () => {
      const invalidQuiz = {
        title: 'Typed Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of Spain is _____.',
            answer: 123,
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Typed completion question answer must be a string or an array of strings');
    });

    it('should return invalid for a typed completion question with a non-string answer in an array', () => {
      const invalidQuiz = {
        title: 'Typed Completion Quiz',
        questions: [
          {
            type: 'completion',
            question: 'The capital of Spain is _____.',
            answer: ['Madrid', 123],
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Typed completion answer array must not be empty and all answers must be strings');
    });
  });

  describe('diagram-labeling questions', () => {
    it('should return valid for a correct diagram labeling question', () => {
      const validQuiz = {
        title: 'Diagram Quiz',
        questions: [
          {
            type: 'diagram-labeling',
            question: 'Label the parts of the plant cell.',
            diagramUrl: '/plant-cell.png',
            labels: [
              {
                id: 'label-1',
                sentence: 'Converts light energy into chemical energy.',
                answer: 'Chloroplast',
                inputType: 'completion'
              },
              {
                id: 'label-2',
                sentence: 'The rigid outer layer of a plant cell.',
                answer: 'Cell wall',
                inputType: 'completion'
              }
            ],
            timer: 60,
            points: 10
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });

    it('should return invalid when diagramUrl is missing', () => {
      const invalidQuiz = {
        title: 'Diagram Quiz',
        questions: [
          {
            type: 'diagram-labeling',
            question: 'Label the parts.',
            labels: [
              { id: 'label-1', sentence: 'Test', answer: 'Answer' }
            ]
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Diagram labeling question must have a diagramUrl');
    });

    it('should return invalid when labels array is missing', () => {
      const invalidQuiz = {
        title: 'Diagram Quiz',
        questions: [
          {
            type: 'diagram-labeling',
            question: 'Label the parts.',
            diagramUrl: '/diagram.png'
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Diagram labeling question must have a non-empty labels array');
    });

    it('should return invalid when labels array is empty', () => {
      const invalidQuiz = {
        title: 'Diagram Quiz',
        questions: [
          {
            type: 'diagram-labeling',
            question: 'Label the parts.',
            diagramUrl: '/diagram.png',
            labels: []
          },
        ],
      };
      const { valid, error } = validateQuizJson(invalidQuiz);
      expect(valid).toBe(false);
      expect(error).toBe('Diagram labeling question must have a non-empty labels array');
    });

    it('should NOT require options array for diagram labeling questions', () => {
      const validQuiz = {
        title: 'Diagram Quiz',
        questions: [
          {
            type: 'diagram-labeling',
            question: 'Label the parts.',
            diagramUrl: '/diagram.png',
            labels: [
              { id: 'label-1', sentence: 'Test', answer: 'Answer' }
            ]
            // NOTE: No options array - this should still be valid
          },
        ],
      };
      const { valid, error } = validateQuizJson(validQuiz);
      expect(valid).toBe(true);
      expect(error).toBeNull();
    });
  });
});
