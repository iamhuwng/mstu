import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DrawingToolbarPro Component
 * 
 * Enhanced toolbar with:
 * - Double-click custom size input
 * - Double-click color picker
 * - Font size controls
 * - Export to PDF
 * - Auto-save to localStorage
 */
const DrawingToolbarPro = ({
  enabled,
  onToggle,
  color,
  onColorChange,
  lineWidth,
  onLineWidthChange,
  isEraser,
  onEraserToggle,
  isHighlighter,
  onHighlighterToggle,
  onUndo,
  onClear,
  canUndo,
  fontSize,
  onFontSizeChange,
  onExportPDF
}) => {
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState(lineWidth);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(color);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [lastTapTarget, setLastTapTarget] = useState(null);

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#fbbf24' },
    { name: 'Purple', value: '#a855f7' }
  ];

  const thicknesses = [
    { name: 'Thin', value: 2 },
    { name: 'Medium', value: 4 },
    { name: 'Thick', value: 6 }
  ];

  const buttonBaseStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const activeButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderColor: '#8b5cf6'
  };

  const disabledButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    cursor: 'not-allowed'
  };

  const handleCustomSizeSubmit = () => {
    const size = parseInt(customSize);
    if (size >= 1 && size <= 20) {
      onLineWidthChange(size);
      setShowCustomSize(false);
    }
  };

  const handleCustomColorSubmit = () => {
    onColorChange(customColor);
    setShowColorPicker(false);
    if (isEraser) onEraserToggle(false);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      flexWrap: 'wrap',
      position: 'relative'
    }}>
      {/* Toggle Drawing Mode */}
      <button
        onClick={onToggle}
        style={enabled ? activeButtonStyle : buttonBaseStyle}
        title={enabled ? 'Disable drawing mode' : 'Enable drawing mode'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="M2 2l7.586 7.586"/>
          <circle cx="11" cy="11" r="2"/>
        </svg>
        {enabled ? 'Drawing ON' : 'Drawing OFF'}
      </button>

      {enabled && (
        <>
          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Color Picker */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Color:</span>
            {colors.map(c => (
              <button
                key={c.value}
                onClick={(e) => {
                  const now = Date.now();
                  const target = e.currentTarget;
                  
                  // Double-click/tap detection (within 500ms)
                  if (now - lastTapTime < 500 && lastTapTarget === target) {
                    e.preventDefault();
                    e.stopPropagation();
                    setCustomColor(c.value);
                    setShowColorPicker(true);
                    setLastTapTime(0);
                    return;
                  }
                  
                  setLastTapTime(now);
                  setLastTapTarget(target);
                  
                  // Single click behavior
                  onColorChange(c.value);
                  if (isEraser) onEraserToggle(false);
                  if (isHighlighter && c.value === '#000000') {
                    onHighlighterToggle(false);
                  }
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCustomColor(c.value);
                  setShowColorPicker(true);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: c.value,
                  border: color === c.value && !isEraser && !isHighlighter ? '3px solid #8b5cf6' : '2px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: color === c.value && !isEraser && !isHighlighter ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none'
                }}
                title={`${c.name} (double-click for custom color)`}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
            
            {/* Custom Color Picker Modal */}
            {showColorPicker && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                  Custom Color:
                </label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  style={{ width: '100px', height: '40px', cursor: 'pointer', border: 'none' }}
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={handleCustomColorSubmit}
                    style={{
                      ...buttonBaseStyle,
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderColor: '#10b981'
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    style={{ ...buttonBaseStyle, padding: '6px 12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Line Thickness */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Size:</span>
            {thicknesses.map(t => (
              <button
                key={t.value}
                onClick={(e) => {
                  const now = Date.now();
                  const target = e.currentTarget;
                  
                  // Double-click/tap detection (within 500ms)
                  if (now - lastTapTime < 500 && lastTapTarget === target) {
                    e.preventDefault();
                    e.stopPropagation();
                    setCustomSize(t.value);
                    setShowCustomSize(true);
                    setLastTapTime(0);
                    return;
                  }
                  
                  setLastTapTime(now);
                  setLastTapTarget(target);
                  
                  // Single click behavior
                  onLineWidthChange(t.value);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCustomSize(t.value);
                  setShowCustomSize(true);
                }}
                style={{
                  ...buttonBaseStyle,
                  padding: '6px 10px',
                  backgroundColor: lineWidth === t.value && !isEraser ? '#8b5cf6' : 'white',
                  color: lineWidth === t.value && !isEraser ? 'white' : '#475569',
                  borderColor: lineWidth === t.value && !isEraser ? '#8b5cf6' : '#cbd5e1'
                }}
                title={`${t.name} (double-click for custom size)`}
              >
                {t.name}
              </button>
            ))}
            
            {/* Custom Size Input Modal */}
            {showCustomSize && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                  Custom Size (1-20px):
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomSizeSubmit()}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    width: '100px'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={handleCustomSizeSubmit}
                    style={{
                      ...buttonBaseStyle,
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderColor: '#10b981'
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowCustomSize(false)}
                    style={{ ...buttonBaseStyle, padding: '6px 12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Highlighter */}
          <button
            onClick={() => {
              onHighlighterToggle(!isHighlighter);
              if (isEraser) onEraserToggle(false);
            }}
            style={isHighlighter ? activeButtonStyle : buttonBaseStyle}
            title="Highlighter tool (semi-transparent)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l-6 6v3h9l3-3"/>
              <path d="M22 12l-4.6 4.6a2 2 0 01-2.8 0l-5.2-5.2a2 2 0 010-2.8L14 4"/>
            </svg>
            Highlight
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Eraser */}
          <button
            onClick={() => {
              onEraserToggle(!isEraser);
              if (isHighlighter) onHighlighterToggle(false);
            }}
            style={isEraser ? activeButtonStyle : buttonBaseStyle}
            title="Eraser tool (3x larger) - Also use pen eraser button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 20H7L3 16l10-10 8 8-1 6z"/>
              <path d="M7 20l-4-4"/>
            </svg>
            Eraser
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={!canUndo ? disabledButtonStyle : buttonBaseStyle}
            title="Undo last stroke"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
            </svg>
            Undo
          </button>

          {/* Clear All */}
          <button
            onClick={onClear}
            style={{
              ...buttonBaseStyle,
              color: '#ef4444',
              borderColor: '#fecaca'
            }}
            title="Clear all drawings"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            Clear
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Font Size Controls */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Font:</span>
            <button
              onClick={() => onFontSizeChange(Math.max(fontSize - 2, 12))}
              disabled={fontSize <= 12}
              style={fontSize <= 12 ? disabledButtonStyle : buttonBaseStyle}
              title="Decrease font size"
            >
              <span style={{ fontSize: '14px' }}>A−</span>
            </button>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', minWidth: '35px', textAlign: 'center' }}>
              {fontSize}px
            </span>
            <button
              onClick={() => onFontSizeChange(Math.min(fontSize + 2, 32))}
              disabled={fontSize >= 32}
              style={fontSize >= 32 ? disabledButtonStyle : buttonBaseStyle}
              title="Increase font size"
            >
              <span style={{ fontSize: '14px' }}>A+</span>
            </button>
            <button
              onClick={() => onFontSizeChange(16)}
              disabled={fontSize === 16}
              style={fontSize === 16 ? disabledButtonStyle : { ...buttonBaseStyle, padding: '6px 8px' }}
              title="Reset font size"
            >
              Reset
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#10b981',
              color: 'white',
              borderColor: '#10b981'
            }}
            title="Export passage with notes as PDF"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
        </>
      )}
    </div>
  );
};

DrawingToolbarPro.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  lineWidth: PropTypes.number.isRequired,
  onLineWidthChange: PropTypes.func.isRequired,
  isEraser: PropTypes.bool.isRequired,
  onEraserToggle: PropTypes.func.isRequired,
  isHighlighter: PropTypes.bool.isRequired,
  onHighlighterToggle: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  canUndo: PropTypes.bool,
  fontSize: PropTypes.number.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onExportPDF: PropTypes.func.isRequired
};

export default DrawingToolbarPro;
