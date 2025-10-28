import React, { useState } from 'react';
import { Text, Stack, NumberInput } from '@mantine/core';
import { Button, Card, CardBody, CardFooter } from './modern';

const EditQuizModal = ({ quiz, editedQuestions, onQuestionSelect, selectedQuestionIndex, onSaveChanges, onCancel, showEditor, onSetAllTimers, onUpdateQuestionTimer, onHideQuestion, onDeleteQuestion, onAddQuestion, isSaving, showSaveSuccess }) => {
  const [commonTimer, setCommonTimer] = useState(10);
  const [editingTimerIndex, setEditingTimerIndex] = useState(null);
  const [tempTimerValue, setTempTimerValue] = useState('');

  if (!quiz) return null;

  const handleApplyToAll = () => {
    if (onSetAllTimers) {
      onSetAllTimers(commonTimer);
    }
  };

  const handleTimerDoubleClick = (index) => {
    const currentTimer = (editedQuestions && editedQuestions[index] ? editedQuestions[index].timer : quiz.questions[index].timer) || 10;
    setEditingTimerIndex(index);
    setTempTimerValue(currentTimer.toString());
  };

  const handleTimerChange = (value) => {
    setTempTimerValue(value);
  };

  const handleTimerBlur = (index) => {
    const newTimer = parseInt(tempTimerValue) || 10;
    // Clamp between 5 and 300
    const clampedTimer = Math.max(5, Math.min(300, newTimer));
    
    // Update the question timer through parent
    if (onUpdateQuestionTimer) {
      const question = editedQuestions && editedQuestions[index] ? editedQuestions[index] : quiz.questions[index];
      const updated = { ...question, timer: clampedTimer };
      onUpdateQuestionTimer(index, updated);
    }
    
    setEditingTimerIndex(null);
  };

  const handleTimerKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleTimerBlur(index);
    } else if (e.key === 'Escape') {
      setEditingTimerIndex(null);
    }
  };
  
  // Use editedQuestions if available, otherwise fall back to quiz.questions
  const questionsToDisplay = editedQuestions && Object.keys(editedQuestions).length > 0
    ? Object.values(editedQuestions)
    : quiz.questions;

  return (
    <Card 
      variant="glass" 
      hover={false}
      style={{ 
        width: showEditor ? '350px' : '450px', 
        maxHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
      }}
    >
        <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <Text size="xl" fw={700} style={{ color: '#1e293b' }}>Edit Quiz</Text>
              </div>
              {onAddQuestion && (
                <Button 
                  variant="primary" 
                  size="xs" 
                  onClick={onAddQuestion}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.25rem' }}>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Question
                </Button>
              )}
            </div>
            
            {/* Set Timer for All Questions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(139, 92, 246, 0.15)'
            }}>
              <Text size="xs" fw={600} mb="xs" style={{ color: '#64748b' }}>
                Set Timer for All Questions
              </Text>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <NumberInput
                  value={commonTimer}
                  onChange={setCommonTimer}
                  min={5}
                  max={300}
                  step={5}
                  suffix="s"
                  size="xs"
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      borderRadius: '0.375rem',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      color: '#8b5cf6',
                      background: '#ffffff'
                    }
                  }}
                />
                <Button 
                  variant="primary" 
                  size="xs" 
                  onClick={handleApplyToAll}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Apply
                </Button>
              </div>
            </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <Stack spacing="sm">
            {quiz.questions.map((question, index) => {
                // Get the edited version of this question if it exists
                const displayQuestion = editedQuestions && editedQuestions[index] ? editedQuestions[index] : question;
                const isSelected = selectedQuestionIndex === index;
                const isHidden = displayQuestion.hidden || false;
                
                return (
                <div
                    key={index}
                    style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    padding: '1rem',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)' 
                      : isHidden
                      ? 'rgba(203, 213, 225, 0.3)'
                      : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    border: isSelected ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    opacity: isHidden ? 0.6 : 1
                    }}
                >
                    <div 
                      style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                      onClick={() => onQuestionSelect(index)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)';
                          e.currentTarget.parentElement.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                          e.currentTarget.parentElement.style.transform = 'translateY(-2px)';
                          e.currentTarget.parentElement.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.parentElement.style.background = isHidden ? 'rgba(203, 213, 225, 0.3)' : 'rgba(255, 255, 255, 0.5)';
                          e.currentTarget.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                          e.currentTarget.parentElement.style.transform = 'translateY(0)';
                          e.currentTarget.parentElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }
                      }}
                    >
                      <Text size="sm" fw={700} style={{ color: '#1e293b', marginBottom: '0.25rem' }}>
                          Question {index + 1} {isHidden && <span style={{ color: '#64748b', fontWeight: 400 }}>(Hidden)</span>}
                      </Text>
                      <Text size="sm" style={{
                          color: '#475569',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                      }}>
                          {(() => {
                            if (typeof question.question === 'string') {
                              return question.question;
                            } else if (question.question && typeof question.question === 'object') {
                              return question.question.text || '(Empty)';
                            }
                            return '(Empty)';
                          })()}
                      </Text>
                    </div>
                    
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontWeight: 600
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleTimerDoubleClick(index);
                      }}
                      title="Double-click to edit timer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {editingTimerIndex === index ? (
                        <input
                          type="number"
                          value={tempTimerValue}
                          onChange={(e) => handleTimerChange(e.target.value)}
                          onBlur={() => handleTimerBlur(index)}
                          onKeyDown={(e) => handleTimerKeyDown(e, index)}
                          autoFocus
                          min={5}
                          max={300}
                          style={{
                            width: '40px',
                            padding: '0.125rem 0.25rem',
                            border: '2px solid #8b5cf6',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: '#1e293b',
                            background: '#ffffff',
                            outline: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span style={{ cursor: 'pointer' }}>{displayQuestion.timer || 10}s</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      {onHideQuestion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onHideQuestion(index);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.375rem',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 116, 139, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title={isHidden ? "Unhide question" : "Hide question"}
                        >
                          {isHidden ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          )}
                        </button>
                      )}
                      {onDeleteQuestion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete Question ${index + 1}? This cannot be undone.`)) {
                              onDeleteQuestion(index);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.375rem',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Delete question"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                </div>
                );
            })}
            </Stack>
        </div>

        <CardFooter style={{
          gap: '0.75rem',
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(139, 92, 246, 0.15)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)'
        }}>
        <Button variant="glass" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button 
          variant="primary" 
          onClick={onSaveChanges} 
          disabled={isSaving}
          style={showSaveSuccess ? {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            transition: 'all 0.3s ease'
          } : {}}
        >
            {isSaving ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
                Saving...
              </>
            ) : showSaveSuccess ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21" fill="white"/>
                  <polyline points="7 3 7 8 15 8" fill="white"/>
                </svg>
                Save Changes
              </>
            )}
        </Button>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        </CardFooter>
    </Card>
  );
};

export default EditQuizModal;