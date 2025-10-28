import React, { useState, useEffect } from 'react';
import { Text, Textarea, TextInput, NumberInput, Radio, Checkbox, Stack, Group } from '@mantine/core';
import { Button } from './modern';

const QuestionEditorPanel = ({
  question,
  questionIndex,
  totalQuestions,
  onUpdate,
  onClose,
  onReset,
  onPrevious,
  onNext,
  isFirst,
  isLast
}) => {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [validationWarnings, setValidationWarnings] = useState({});

  useEffect(() => {
    setLocalQuestion(question);
    validateFields(question);
  }, [question, questionIndex]);

  const validateFields = (q) => {
    if (!q) return; // Safety check for undefined question
    
    const warnings = {};
    
    if (!q.question || q.question.trim() === '') {
      warnings.question = 'Question text is empty';
    }
    
    if (q.options) {
      q.options.forEach((opt, index) => {
        // Handle string options (multiple-choice)
        if (typeof opt === 'string' && (!opt || opt.trim() === '')) {
          warnings[`option_${index}`] = `Option ${String.fromCharCode(65 + index)} is empty`;
        }
        // Handle object options (matching, etc.) - check if they have required properties
        else if (typeof opt === 'object' && opt !== null && !opt.text) {
          warnings[`option_${index}`] = `Option ${String.fromCharCode(65 + index)} is missing text`;
        }
      });
    }
    
    // Handle different answer types (string, array, etc.)
    if (!q.answer) {
      warnings.answer = 'Correct answer is not set';
    } else if (typeof q.answer === 'string' && q.answer.trim() === '') {
      warnings.answer = 'Correct answer is not set';
    } else if (Array.isArray(q.answer) && q.answer.length === 0) {
      warnings.answer = 'Correct answer is not set';
    }
    
    setValidationWarnings(warnings);
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    validateFields(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(localQuestion.options || [])];
    newOptions[index] = value;
    const updated = { ...localQuestion, options: newOptions };
    setLocalQuestion(updated);
    validateFields(updated);
    onUpdate(updated);
  };

  const handleCorrectAnswerChange = (value) => {
    const updated = { ...localQuestion, answer: value };
    setLocalQuestion(updated);
    validateFields(updated);
    onUpdate(updated);
  };

  const handleMultipleAnswerToggle = (optionValue) => {
    const currentAnswers = Array.isArray(localQuestion.answer) ? localQuestion.answer : [];
    const newAnswers = currentAnswers.includes(optionValue)
      ? currentAnswers.filter(a => a !== optionValue)
      : [...currentAnswers, optionValue];
    const updated = { ...localQuestion, answer: newAnswers };
    setLocalQuestion(updated);
    validateFields(updated);
    onUpdate(updated);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Text size="lg" fw={700} style={{ color: '#1e293b' }}>
            Editing Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <Text size="xs" style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Changes are auto-saved to your browser
          </Text>
        </div>
        
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <Button
          variant="glass"
          size="sm"
          onClick={onPrevious}
          disabled={isFirst}
          style={{ flex: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.25rem' }}>
            <polyline points="15 18 9 12 15 6" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
          Previous
        </Button>
        <Button
          variant="glass"
          size="sm"
          onClick={onNext}
          disabled={isLast}
          style={{ flex: 1 }}
        >
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '0.25rem' }}>
            <polyline points="9 18 15 12 9 6" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </Button>
      </div>

      {/* Editor Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem'
      }}>
        <Stack spacing="lg">
          {/* Question Text */}
          <div>
            <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
              Question Text *
            </Text>
            <Textarea
              value={typeof localQuestion.question === 'string' ? localQuestion.question : (localQuestion.question?.text || '')}
              onChange={(e) => handleFieldChange('question', e.target.value)}
              placeholder="Enter the question text..."
              minRows={3}
              maxRows={6}
              styles={{
                input: {
                  borderRadius: '0.5rem',
                  border: validationWarnings.question ? '2px solid #ef4444' : '2px solid #cbd5e1',
                  fontSize: '0.9375rem',
                  color: '#1e293b',
                  background: '#ffffff'
                }
              }}
            />
            {validationWarnings.question && (
              <Text size="xs" style={{ color: '#ef4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {validationWarnings.question}
              </Text>
            )}
          </div>

          {/* Answer Options */}
          {localQuestion.options && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Answer Options *
              </Text>
              <Stack spacing="sm">
                {localQuestion.options.map((option, index) => (
                  <div key={index}>
                    <TextInput
                      value={typeof option === 'string' ? option : (option?.text || '')}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      label={
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      }
                      styles={{
                        input: {
                          borderRadius: '0.5rem',
                          border: validationWarnings[`option_${index}`] ? '2px solid #ef4444' : '2px solid #cbd5e1',
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          background: '#ffffff'
                        }
                      }}
                    />
                    {validationWarnings[`option_${index}`] && (
                      <Text size="xs" style={{ color: '#ef4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        {validationWarnings[`option_${index}`]}
                      </Text>
                    )}
                  </div>
                ))}
              </Stack>
            </div>
          )}

          {/* Correct Answer Selection - Multiple Choice & Multiple Select */}
          {localQuestion.options && (localQuestion.type === 'multiple-choice' || localQuestion.type === 'multiple-select') && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Correct Answer{localQuestion.type === 'multiple-select' ? 's' : ''} *
              </Text>
              
              {localQuestion.type === 'multiple-select' ? (
                // Multiple Select: Use Checkboxes
                <Stack spacing="xs">
                  {localQuestion.options.map((option, index) => {
                    const optionValue = typeof option === 'string' ? option : (option?.text || '');
                    const currentAnswers = Array.isArray(localQuestion.answer) ? localQuestion.answer : [];
                    return (
                      <Checkbox
                        key={index}
                        checked={currentAnswers.includes(optionValue)}
                        onChange={() => handleMultipleAnswerToggle(optionValue)}
                        label={
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                            <strong>{String.fromCharCode(65 + index)}:</strong> {typeof option === 'string' ? option : (option?.text || '(Empty)')}
                          </span>
                        }
                        styles={{
                          input: {
                            cursor: 'pointer'
                          },
                          label: {
                            cursor: 'pointer',
                            paddingLeft: '0.5rem'
                          }
                        }}
                      />
                    );
                  })}
                </Stack>
              ) : (
                // Multiple Choice: Use Radio Buttons
                <Radio.Group
                  value={localQuestion.answer || ''}
                  onChange={handleCorrectAnswerChange}
                >
                  <Stack spacing="xs">
                    {localQuestion.options.map((option, index) => (
                      <Radio
                        key={index}
                        value={typeof option === 'string' ? option : (option?.text || '')}
                        label={
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                            <strong>{String.fromCharCode(65 + index)}:</strong> {typeof option === 'string' ? option : (option?.text || '(Empty)')}
                          </span>
                        }
                        styles={{
                          radio: {
                            cursor: 'pointer'
                          },
                          label: {
                            cursor: 'pointer',
                            paddingLeft: '0.5rem'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Radio.Group>
              )}
              
              {validationWarnings.answer && (
                <Text size="xs" style={{ color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {validationWarnings.answer}
                </Text>
              )}
            </div>
          )}

          {/* Completion Answer */}
          {localQuestion.type === 'completion' && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Correct Answer{Array.isArray(localQuestion.answer) ? 's (Acceptable Variations)' : ''} *
              </Text>
              {localQuestion.wordBank ? (
                // Word Bank: Select from options
                <Radio.Group
                  value={localQuestion.answer || ''}
                  onChange={handleCorrectAnswerChange}
                >
                  <Stack spacing="xs">
                    {localQuestion.wordBank.map((word, index) => (
                      <Radio
                        key={index}
                        value={word}
                        label={
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                            {word}
                          </span>
                        }
                        styles={{
                          radio: { cursor: 'pointer' },
                          label: { cursor: 'pointer', paddingLeft: '0.5rem' }
                        }}
                      />
                    ))}
                  </Stack>
                </Radio.Group>
              ) : (
                // Free Text: Enter acceptable answers
                <TextInput
                  value={Array.isArray(localQuestion.answer) ? localQuestion.answer.join(', ') : (localQuestion.answer || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const answers = value.includes(',') ? value.split(',').map(a => a.trim()) : value;
                    handleFieldChange('answer', answers);
                  }}
                  placeholder="Enter answer(s), separate multiple with commas"
                  styles={{
                    input: {
                      borderRadius: '0.5rem',
                      border: '2px solid #cbd5e1',
                      fontSize: '0.9375rem',
                      color: '#1e293b',
                      background: '#ffffff'
                    }
                  }}
                />
              )}
              {validationWarnings.answer && (
                <Text size="xs" style={{ color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {validationWarnings.answer}
                </Text>
              )}
            </div>
          )}

          {/* Matching Answers */}
          {localQuestion.type === 'matching' && localQuestion.items && localQuestion.options && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Match Items to Options *
              </Text>
              <Text size="xs" style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                Select the correct option for each item
              </Text>
              <Stack spacing="sm">
                {localQuestion.items.map((item, index) => (
                  <div key={item.id} style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                      {item.text}
                    </Text>
                    <Radio.Group
                      value={localQuestion.answers?.[item.id] || ''}
                      onChange={(value) => {
                        const updated = {
                          ...localQuestion,
                          answers: { ...(localQuestion.answers || {}), [item.id]: value }
                        };
                        setLocalQuestion(updated);
                        validateFields(updated);
                        onUpdate(updated);
                      }}
                    >
                      <Group spacing="sm">
                        {localQuestion.options.map((option) => (
                          <Radio
                            key={option.id}
                            value={option.id}
                            label={option.text}
                            styles={{
                              radio: { cursor: 'pointer' },
                              label: { cursor: 'pointer', fontSize: '0.8125rem' }
                            }}
                          />
                        ))}
                      </Group>
                    </Radio.Group>
                  </div>
                ))}
              </Stack>
            </div>
          )}

          {/* Diagram Labeling Answers */}
          {localQuestion.type === 'diagram-labeling' && localQuestion.labels && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Label Answers *
              </Text>
              <Stack spacing="sm">
                {localQuestion.labels.map((label, index) => (
                  <div key={label.id}>
                    <Text size="xs" fw={600} mb="xs" style={{ color: '#475569' }}>
                      Label {index + 1}: {label.sentence}
                    </Text>
                    <TextInput
                      value={label.answer || ''}
                      onChange={(e) => {
                        const newLabels = [...localQuestion.labels];
                        newLabels[index] = { ...newLabels[index], answer: e.target.value };
                        const updated = { ...localQuestion, labels: newLabels };
                        setLocalQuestion(updated);
                        validateFields(updated);
                        onUpdate(updated);
                      }}
                      placeholder="Enter correct answer"
                      styles={{
                        input: {
                          borderRadius: '0.5rem',
                          border: '2px solid #cbd5e1',
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          background: '#ffffff'
                        }
                      }}
                    />
                  </div>
                ))}
              </Stack>
            </div>
          )}

          {/* Timer */}
          <div>
            <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
              Timer (seconds) *
            </Text>
            <NumberInput
              value={localQuestion.timer || 10}
              onChange={(value) => handleFieldChange('timer', value)}
              min={5}
              max={300}
              step={5}
              suffix=" seconds"
              styles={{
                input: {
                  borderRadius: '0.5rem',
                  border: '2px solid #cbd5e1',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  background: '#ffffff'
                }
              }}
            />
          </div>

          {/* Question Type (if applicable) */}
          {localQuestion.type && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Question Type
              </Text>
              <TextInput
                value={localQuestion.type || 'multiple-choice'}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                disabled
                styles={{
                  input: {
                    borderRadius: '0.5rem',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.9375rem',
                    color: '#64748b',
                    background: '#f8fafc'
                  }
                }}
              />
              <Text size="xs" style={{ color: '#64748b', marginTop: '0.25rem' }}>
                Question type cannot be changed
              </Text>
            </div>
          )}

          {/* Passage (if applicable) */}
          {localQuestion.passage && (
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#1e293b' }}>
                Passage
              </Text>
              <Textarea
                value={localQuestion.passage || ''}
                onChange={(e) => handleFieldChange('passage', e.target.value)}
                placeholder="Enter passage text..."
                minRows={4}
                maxRows={8}
                styles={{
                  input: {
                    borderRadius: '0.5rem',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    background: '#ffffff'
                  }
                }}
              />
            </div>
          )}
        </Stack>
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(59, 130, 246, 0.15)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          variant="glass"
          size="sm"
          onClick={onReset}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
            <polyline points="1 4 1 10 7 10"/>
            <polyline points="23 20 23 14 17 14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Reset to Original
        </Button>

        <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
          {Object.keys(validationWarnings).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {Object.keys(validationWarnings).length} validation warning{Object.keys(validationWarnings).length === 1 ? '' : 's'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditorPanel;
