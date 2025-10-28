import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import DrawingCanvasV2 from './DrawingCanvasV2'; // REMOVED - Testing without drawing
// import DrawingToolbarPro from './DrawingToolbarPro'; // REMOVED - Testing without drawing
// import { useLog } from '../context/LogContext'; // DISABLED FOR TESTING

/**
 * PassageRenderer Component
 *
 * Renders passage/material content for IELTS-style quizzes.
 * Supports three types: text, image, or both.
 *
 * @param {Object} passage - The passage object to render
 * @param {string} passage.type - Type of passage: "text", "image", or "both"
 * @param {string} passage.content - Text content (required for "text" and "both")
 * @param {string} passage.imageUrl - Image URL (required for "image" and "both")
 * @param {string} passage.caption - Optional caption
 */
const PassageRenderer = ({ passage }) => {
  // const { addLog } = useLog(); // DISABLED FOR TESTING
  const addLog = () => {}; // No-op function
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default 16px (1em)
  
  // REMOVED: All drawing state - testing without drawing feature
  // const [drawingEnabled, setDrawingEnabled] = useState(false);
  // const [drawingColor, setDrawingColor] = useState('#000000');
  // const [lineWidth, setLineWidth] = useState(2);
  // const [isEraser, setIsEraser] = useState(false);
  // const [isHighlighter, setIsHighlighter] = useState(false);
  // const [canUndo, setCanUndo] = useState(false);
  // const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  // const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Font size control
  const handleFontSizeChange = (newSize) => {
    addLog(`[DRAWING] Font size changed: ${fontSize}px → ${newSize}px`);
    setFontSize(newSize);
  };
  
  // Export to PDF
  const handleExportPDF = async () => {
    addLog(`[DRAWING] PDF export started, strokeCount=${canvasRef.current?.getStrokes()?.length || 0}`);
    try {
      // Dynamically import libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      if (!textContainerRef.current) return;
      
      // Capture the passage with drawings
      const canvas = await html2canvas(textContainerRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`passage-notes-${Date.now()}.pdf`);
      
      addLog(`[DRAWING] ✅ PDF exported successfully`);
      alert('PDF exported successfully!');
    } catch (error) {
      addLog(`[DRAWING] ❌ PDF export failed: ${error.message}`);
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };
  
  // Drawing controls
  const handleUndo = () => {
    if (canvasRef.current && canvasRef.current.undo) {
      const strokeCount = canvasRef.current.getStrokes()?.length || 0;
      addLog(`[DRAWING] Undo triggered, strokeCount before: ${strokeCount}`);
      canvasRef.current.undo();
      addLog(`[DRAWING] Undo completed, strokeCount after: ${strokeCount - 1}`);
    } else {
      addLog(`[DRAWING] ❌ Undo failed: canvas ref not available`);
    }
  };
  
  const handleClear = () => {
    if (canvasRef.current && canvasRef.current.clear) {
      const strokeCount = canvasRef.current.getStrokes()?.length || 0;
      addLog(`[DRAWING] Clear requested, strokeCount: ${strokeCount}`);
      if (window.confirm('Clear all drawings? This cannot be undone.')) {
        canvasRef.current.clear();
        addLog(`[DRAWING] ✅ All drawings cleared`);
      } else {
        addLog(`[DRAWING] Clear cancelled by user`);
      }
    } else {
      addLog(`[DRAWING] ❌ Clear failed: canvas ref not available`);
    }
  };
  
  const handleStrokeComplete = (stroke) => {
    // Update undo availability - DrawingCanvasPro already uses setTimeout, no need to nest
    if (canvasRef.current && canvasRef.current.getStrokes) {
      const strokeCount = canvasRef.current.getStrokes().length;
      setCanUndo(strokeCount > 0);
      // Only log every 5th stroke to reduce overhead
      if (strokeCount % 5 === 0 || strokeCount === 1) {
        addLog(`[DRAWING] Stroke completed, totalStrokes: ${strokeCount}, points: ${stroke?.points?.length || 0}`);
      }
    }
  };
  
  // Update canUndo when drawing is enabled/disabled
  useEffect(() => {
    if (drawingEnabled) {
      addLog(`[DRAWING] Drawing mode ENABLED, passageId: ${passage?.id || passage?.title || 'default'}`);
      if (canvasRef.current && canvasRef.current.getStrokes) {
        const strokeCount = canvasRef.current.getStrokes().length;
        setCanUndo(strokeCount > 0);
        addLog(`[DRAWING] Loaded ${strokeCount} saved strokes from localStorage`);
      }
    } else {
      addLog(`[DRAWING] Drawing mode DISABLED`);
      setCanUndo(false);
    }
  }, [drawingEnabled, addLog, passage]);
  
  // Keyboard shortcuts for drawing tools
  useEffect(() => {
    if (!drawingEnabled) return;
    
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Undo (Ctrl+Z)`);
      }
      
      // E = Eraser toggle
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEraser(prev => !prev);
        if (!isEraser) setIsHighlighter(false);
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Eraser (E) - ${!isEraser ? 'ON' : 'OFF'}`);
      }
      
      // H = Highlighter toggle
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsHighlighter(prev => !prev);
        if (!isHighlighter) setIsEraser(false);
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Highlighter (H) - ${!isHighlighter ? 'ON' : 'OFF'}`);
      }
      
      // P = Pen (disable eraser/highlighter)
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsEraser(false);
        setIsHighlighter(false);
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Pen (P)`);
      }
      
      // [ = Decrease size
      if (e.key === '[') {
        e.preventDefault();
        setLineWidth(prev => Math.max(1, prev - 1));
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Decrease size ([)`);
      }
      
      // ] = Increase size
      if (e.key === ']') {
        e.preventDefault();
        setLineWidth(prev => Math.min(20, prev + 1));
        addLog(`[DRAWING] ⌨️ Keyboard shortcut: Increase size (])`);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [drawingEnabled, isEraser, isHighlighter, handleUndo, addLog]);
  
  // Update canvas size when text container size changes
  useEffect(() => {
    if (!textContainerRef.current) return;
    
    let lastLoggedSize = { width: 0, height: 0 };
    let lastSetSize = { width: 0, height: 0 };
    let resizeTimeout = null;
    
    const updateSize = (shouldLog = false, immediate = false) => {
      const rect = textContainerRef.current.getBoundingClientRect();
      const newSize = {
        width: rect.width,
        height: rect.height
      };
      
      // Only update if size changed significantly (avoid unnecessary re-renders)
      const sizeChanged = Math.abs(newSize.width - lastSetSize.width) > 2 || 
                          Math.abs(newSize.height - lastSetSize.height) > 2;
      
      if (!sizeChanged && !immediate) return;
      
      // Only log if size actually changed significantly (avoid spam during drawing)
      if (shouldLog && (Math.abs(newSize.width - lastLoggedSize.width) > 5 || 
                        Math.abs(newSize.height - lastLoggedSize.height) > 5)) {
        addLog(`[DRAWING] Canvas size updated: ${newSize.width}x${newSize.height}`);
        lastLoggedSize = newSize;
      }
      
      lastSetSize = newSize;
      setCanvasSize(newSize);
    };
    
    // Initial size with logging
    updateSize(true, true);
    
    // Use ResizeObserver with throttling to avoid excessive updates during drawing
    const resizeObserver = new ResizeObserver(() => {
      // Throttle updates to max once per 100ms during drawing
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        updateSize(false, false); // Silent, non-immediate updates
      }, 100);
    });
    
    resizeObserver.observe(textContainerRef.current);
    
    // Fallback: window resize (with logging, immediate)
    const handleResize = () => updateSize(true, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [passage]); // Removed addLog from dependencies - it's stable

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
        {/* Drawing Toolbar with Font Controls */}
        <div style={{ marginBottom: '12px', position: 'relative', overflow: 'visible' }}>
          <DrawingToolbarPro
            enabled={drawingEnabled}
            onToggle={() => setDrawingEnabled(!drawingEnabled)}
            color={drawingColor}
            onColorChange={setDrawingColor}
            lineWidth={lineWidth}
            onLineWidthChange={setLineWidth}
            isEraser={isEraser}
            onEraserToggle={setIsEraser}
            isHighlighter={isHighlighter}
            onHighlighterToggle={setIsHighlighter}
            onUndo={handleUndo}
            onClear={handleClear}
            canUndo={canUndo}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            onExportPDF={handleExportPDF}
          />
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
          
          {/* Drawing Canvas Overlay */}
          {drawingEnabled && canvasSize.width > 0 && (
            <DrawingCanvasV2
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              enabled={drawingEnabled}
              color={drawingColor}
              lineWidth={lineWidth}
              isEraser={isEraser}
              isHighlighter={isHighlighter}
              onStrokeComplete={handleStrokeComplete}
              passageId={passage?.id || passage?.title || 'default'}
            />
          )}
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
