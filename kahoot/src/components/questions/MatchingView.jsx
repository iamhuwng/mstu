import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, Box, Card, ActionIcon } from '@mantine/core';
import { IconZoomReset } from '@tabler/icons-react';
import { useAdaptiveLayout, getFontSizes } from '../../hooks/useAdaptiveLayout';

/**
 * MatchingView Component
 *
 * Displays a matching question on the teacher screen.
 * Shows items, options, and the correct answer mapping.
 */
const MatchingView = ({ question, isPassageOpen = false }) => {
  const { fontScale, isScaled, resetSize, containerRef, textMetrics } = useAdaptiveLayout({
    items: [...(question.items || []), ...(question.options || [])],
    questionText: question.question,
    isPassageOpen,
    questionType: 'matching'
  });

  const fontSizes = getFontSizes(fontScale);

  // Determine layout: horizontal (side-by-side) or vertical (stacked)
  const useVerticalLayout = useMemo(() => {
    // Use vertical layout if most text is long or passage is open
    return textMetrics.mostAreLong || (isPassageOpen && textMetrics.avgLength > 50);
  }, [textMetrics, isPassageOpen]);
  if (!question || !question.items || !question.options || !question.answers) {
    return (
      <Box p="md">
        <Text c="red">Invalid matching question: missing items, options, or answers</Text>
      </Box>
    );
  }

  const getOptionText = (optionId) => {
    const option = question.options.find((o) => o.id === optionId);
    return option ? option.text : 'N/A';
  };

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
        <Text 
          size="xl" 
          fw={700} 
          style={{ 
            color: '#1e293b',
            fontSize: fontSizes.question,
            lineHeight: 1.4
          }}
        >
          {question.question}
        </Text>

        {/* Instruction banner for students */}
        <Box
          style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0.75rem',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Text
            size="lg"
            fw={600}
            style={{
              color: '#ffffff',
              textAlign: 'center',
              fontSize: fontSizes.label
            }}
          >
            📱 Students: Drag and drop items on your device to match pairs
          </Text>
        </Box>

        <Box style={{ 
          display: 'flex', 
          flexDirection: useVerticalLayout ? 'column' : 'row',
          gap: '1.5rem', 
          flexWrap: useVerticalLayout ? 'nowrap' : 'wrap'
        }}>
          {/* Left side: Items to be matched */}
          <Box style={{ flex: useVerticalLayout ? '1' : '1 1 300px', minWidth: useVerticalLayout ? 'auto' : '280px' }}>
            <Text 
              size="lg" 
              fw={700} 
              mb="md" 
              style={{ 
                color: '#1e293b',
                fontSize: fontSizes.label
              }}
            >
              Items to Match:
            </Text>
            <Stack spacing={fontScale === 'compact' ? 'xs' : 'sm'}>
              {question.items.map((item) => (
                <Card
                  key={item.id}
                  p={fontScale === 'compact' ? 'sm' : 'md'}
                  shadow="sm"
                  radius="md"
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '2px solid #cbd5e1'
                  }}
                >
                  <Text 
                    size="md" 
                    fw={600} 
                    style={{ 
                      color: '#1e293b',
                      fontSize: fontSizes.option
                    }}
                  >
                    {item.text}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Right side: Answer pool options */}
          <Box style={{ flex: useVerticalLayout ? '1' : '1 1 300px', minWidth: useVerticalLayout ? 'auto' : '280px' }}>
            <Text 
              size="lg" 
              fw={700} 
              mb="md" 
              style={{ 
                color: '#1e293b',
                fontSize: fontSizes.label
              }}
            >
              Answer Pool:
            </Text>
            <Stack spacing={fontScale === 'compact' ? 'xs' : 'sm'}>
              {question.options.map((option) => (
                <Card
                  key={option.id}
                  p={fontScale === 'compact' ? 'sm' : 'md'}
                  shadow="sm"
                  radius="md"
                  style={{
                    backgroundColor: '#dbeafe',
                    border: '2px solid #3b82f6'
                  }}
                >
                  <Text 
                    size="md" 
                    fw={600} 
                    style={{ 
                      color: '#1e293b',
                      fontSize: fontSizes.option
                    }}
                  >
                    {option.text}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>

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

MatchingView.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })).isRequired,
    answers: PropTypes.object.isRequired,
    points: PropTypes.number,
    reusableAnswers: PropTypes.bool,
  }).isRequired
};

export default MatchingView;
