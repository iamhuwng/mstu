import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PassageRenderer Component - NO DRAWING MODE
 * 
 * Renders passage/material content for IELTS-style quizzes.
 * Supports three types: text, image, or both.
 * 
 * ALL DRAWING FUNCTIONALITY REMOVED FOR TESTING
 */
const PassageRenderer = ({ passage }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default 16px (1em)
  const textContainerRef = useRef(null);

  // If no passage provided, show placeholder
  if (!passage) {
    return (
      <div style={{
        backgroundColor: '#f0f8ff',
        padding: '20px',
        borderRadius: '8px',
        border: '2px dashed #b0d4f1',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#5a9fd4', fontStyle: 'italic', margin: 0, fontSize: '0.95em' }}>
          No passage available for this question.
        </p>
        <p style={{ color: '#999', fontSize: '0.85em', margin: '8px 0 0 0' }}>
          Passages will appear here when configured in the quiz JSON.
        </p>
      </div>
    );
  }

  const { type, content, imageUrl, caption } = passage;

  // Render text content
  const renderTextContent = () => {
    if (!content) return null;

    return (
      <div>
        {/* Font size controls only - NO DRAWING */}
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9em', color: '#666' }}>Font Size:</span>
          <button
            onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            A-
          </button>
          <span style={{ fontSize: '0.85em', color: '#999', minWidth: '40px', textAlign: 'center' }}>
            {fontSize}px
          </span>
          <button
            onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            A+
          </button>
        </div>
        
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: type === 'both' ? '20px' : '0'
        }}>
          <div 
            ref={textContainerRef}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.8',
              color: '#333',
              fontFamily: 'Georgia, serif',
              whiteSpace: 'pre-wrap',
              position: 'relative'
            }}
          >
            {content}
          </div>
        </div>
      </div>
    );
  };

  // Render image content
  const renderImageContent = () => {
    if (!imageUrl) return null;

    return (
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <img
          src={imageUrl}
          alt={caption || 'Passage image'}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onClick={() => setImageModalOpen(true)}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        />
        {caption && (
          <p style={{
            marginTop: '10px',
            fontSize: '0.9em',
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: 0
          }}>
            {caption}
          </p>
        )}
        <p style={{
          marginTop: '8px',
          fontSize: '0.75em',
          color: '#999',
          textAlign: 'center',
          marginBottom: 0
        }}>
          Click image to enlarge
        </p>
      </div>
    );
  };

  // Render image modal
  const renderImageModal = () => {
    if (!imageModalOpen || !imageUrl) return null;

    return (
      <div
        data-testid="image-modal"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          cursor: 'pointer'
        }}
        onClick={() => setImageModalOpen(false)}
      >
        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
          <img
            src={imageUrl}
            alt={`${caption || 'Passage image'} - enlarged view`}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          />
          {caption && (
            <p style={{
              position: 'absolute',
              bottom: '-40px',
              left: 0,
              right: 0,
              color: 'white',
              textAlign: 'center',
              fontSize: '1em',
              fontStyle: 'italic'
            }}>
              {caption}
            </p>
          )}
          <button
            style={{
              position: 'absolute',
              top: '-40px',
              right: '0',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setImageModalOpen(false);
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>
    );
  };

  // Render based on passage type
  return (
    <div>
      {type === 'text' && renderTextContent()}
      {type === 'image' && renderImageContent()}
      {type === 'both' && (
        <>
          {renderTextContent()}
          {renderImageContent()}
        </>
      )}
      {renderImageModal()}
    </div>
  );
};

PassageRenderer.propTypes = {
  passage: PropTypes.shape({
    type: PropTypes.oneOf(['text', 'image', 'both']).isRequired,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    caption: PropTypes.string
  })
};

export default PassageRenderer;
