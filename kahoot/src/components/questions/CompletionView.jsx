import React, { useState, useMemo } from 'react';
import { Stack, Text, Button, Group, Paper, TextInput, Box, ActionIcon } from '@mantine/core';
import { IconZoomReset } from '@tabler/icons-react';
import { useAdaptiveLayout, getFontSizes } from '../../hooks/useAdaptiveLayout';
import WordBank from '../WordBank';

const CompletionView = ({ question, onSubmit, disabled = false, isPassageOpen = false }) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [filledAnswer, setFilledAnswer] = useState(null);

  const hasWordBank = question.wordBank && question.wordBank.length > 0;

  const { gridColumns, fontScale, isScaled, resetSize, containerRef } = useAdaptiveLayout({
    items: hasWordBank ? question.wordBank : [],
    questionText: question.question,
    isPassageOpen,
    questionType: 'completion'
  });

  const fontSizes = getFontSizes(fontScale);

  const parseQuestionText = (questionText) => {
    const parts = [];
    const blankPattern = /_+/g;
    let lastIndex = 0;
    let match;

    while ((match = blankPattern.exec(questionText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: questionText.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'blank', content: match[0] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < questionText.length) {
      parts.push({ type: 'text', content: questionText.substring(lastIndex) });
    }

    return parts;
  };

  const questionParts = useMemo(() => parseQuestionText(question.question), [question.question]);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setFilledAnswer(word);
  };

  const handleClearAnswer = () => {
    setSelectedWord(null);
    setFilledAnswer(null);
    setTypedAnswer('');
  };

  const handleSubmit = () => {
    if (onSubmit) {
      if (hasWordBank && filledAnswer) {
        onSubmit(filledAnswer);
      } else if (!hasWordBank && typedAnswer) {
        onSubmit(typedAnswer);
      }
    }
  };

  const usedWords = filledAnswer ? [filledAnswer] : [];
  const canSubmit = hasWordBank ? !!filledAnswer : typedAnswer.trim() !== '';

  return (
    <Box 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        maxHeight: '100%',
        overflow: 'auto',
        padding: '1rem',
        position: 'relative'
      }}
    >
      <Stack spacing="lg" style={{ flex: 1 }}>
        <Paper 
          p="xl" 
          withBorder 
          style={{ 
            backgroundColor: '#ffffff',
            borderColor: '#cbd5e1',
            borderWidth: '2px'
          }}
        >
          <Text 
            size="xl" 
            fw={700} 
            component="div" 
            style={{ 
              color: '#1e293b',
              fontSize: fontSizes.question,
              lineHeight: 1.6
            }}
          >
            {questionParts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.content}</span>;
              } else {
                if (hasWordBank) {
                  return (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        minWidth: '150px',
                        padding: '8px 16px',
                        margin: '0 8px',
                        borderBottom: '3px solid #3b82f6',
                        fontWeight: 700,
                        color: filledAnswer ? '#3b82f6' : '#94a3b8',
                        textAlign: 'center',
                        fontSize: fontSizes.option
                      }}
                    >
                      {filledAnswer || '___'}
                    </span>
                  );
                } else {
                  return (
                    <TextInput
                      key={index}
                      style={{ 
                        display: 'inline-block', 
                        margin: '0 8px',
                        minWidth: '150px'
                      }}
                      value={typedAnswer}
                      onChange={(event) => setTypedAnswer(event.currentTarget.value)}
                      placeholder="Type answer"
                      disabled={disabled}
                      size="lg"
                    />
                  );
                }
              }
            })}
          </Text>
        </Paper>

        {hasWordBank ? (
          <>
            <Text 
              size="md" 
              fw={600} 
              style={{ 
                color: '#64748b',
                fontSize: fontSizes.label,
                padding: '0.5rem 1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '0.5rem',
                border: '2px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              Select a word from the word bank below
            </Text>
            
            {/* Word Bank Grid */}
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: gridColumns === 3 ? 'repeat(3, 1fr)' : gridColumns === 2 ? 'repeat(2, 1fr)' : '1fr',
                gap: fontScale === 'compact' ? '0.75rem' : '1rem'
              }}
            >
              {(question.wordBank || []).map((word, index) => {
                const isUsed = usedWords.includes(word);
                const isSelected = selectedWord === word;
                
                return (
                  <Button
                    key={index}
                    onClick={() => !disabled && !isUsed && handleWordClick(word)}
                    disabled={disabled || isUsed}
                    variant={isSelected ? 'filled' : 'light'}
                    color={isSelected ? 'blue' : 'dark'}
                    size={fontScale === 'compact' ? 'sm' : 'md'}
                    style={{
                      fontSize: fontSizes.option,
                      opacity: isUsed ? 0.5 : 1,
                      cursor: isUsed ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      color: isSelected ? undefined : '#000000'
                    }}
                  >
                    {word}
                  </Button>
                );
              })}
            </Box>
          </>
        ) : (
          <Text 
            size="md" 
            fw={600} 
            style={{ 
              color: '#64748b',
              fontSize: fontSizes.label
            }}
          >
            Type your answer in the box above.
          </Text>
        )}

        {onSubmit && (
          <Group mt="md" spacing="md">
            <Button
              onClick={handleSubmit}
              disabled={disabled || !canSubmit}
              size="lg"
              color="blue"
            >
              Submit Answer
            </Button>
            {(filledAnswer || typedAnswer) && !disabled && (
              <Button onClick={handleClearAnswer} size="lg" variant="outline" color="gray">
                Clear
              </Button>
            )}
          </Group>
        )}
      </Stack>

      {/* Reset Size Button */}
      {isScaled && (
        <ActionIcon
          onClick={resetSize}
          size="lg"
          variant="filled"
          color="blue"
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 10
          }}
          title="Reset to original size"
        >
          <IconZoomReset size={20} />
        </ActionIcon>
      )}
    </Box>
  );
};

export default CompletionView;
