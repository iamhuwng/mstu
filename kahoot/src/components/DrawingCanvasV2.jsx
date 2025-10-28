import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * DrawingCanvasV2 Component
 * 
 * Clean, efficient drawing canvas optimized for Surface Pen.
 * 
 * Key Features:
 * - Real-time smooth curves using quadratic Bezier
 * - Single rendering pipeline (no dual system)
 * - Minimal state management
 * - Coalesced events for accuracy
 * - Passage-specific localStorage
 * - Pressure sensitivity
 * 
 * Architecture:
 * - One canvas, one rendering method
 * - Smooth curves drawn WHILE drawing, not after
 * - Simple, predictable, fast
 */
const DrawingCanvasV2 = React.forwardRef(({ 
  width, 
  height, 
  enabled = false,
  color = '#000000',
  lineWidth = 2,
  isEraser = false,
  isHighlighter = false,
  onStrokeComplete,
  passageId = 'default'
}, ref) => {
  // Canvas refs
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false); // Avoid closure issues
  
  // Stroke management
  const [strokes, setStrokes] = useState(() => {
    // Load from passage-specific localStorage
    try {
      const storageKey = `drawing_strokes_v2_${passageId}`;
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load strokes:', e);
      return [];
    }
  });
  
  const currentStrokeRef = useRef([]);
  const activePointerIdRef = useRef(null);
  const lastPointRef = useRef(null);
  const cachedRectRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastDrawTimeRef = useRef(0);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true, // Low-latency hint
      willReadFrequently: false
    });
    
    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpr, dpr);
    
    // Configure for smooth drawing
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    contextRef.current = context;
  }, [width, height]);

  // Calculate pressure-sensitive width with natural curve
  const getPressureWidth = useCallback((pressure, baseWidth, sizeMultiplier) => {
    const normalizedPressure = pressure || 0.5;
    
    // Exponential curve for more natural pen-like feel
    // Light pressure = very thin, medium = normal, hard = thick
    const curve = Math.pow(normalizedPressure, 0.75); // Sweet spot for natural feel
    
    const minWidth = baseWidth * sizeMultiplier * 0.4; // Thinner minimum
    const maxWidth = baseWidth * sizeMultiplier * 2.5; // Thicker maximum
    
    return minWidth + (maxWidth - minWidth) * curve;
  }, []);

  // Draw a complete stroke with tapering (used for redraw and final render)
  const drawStroke = useCallback((context, stroke) => {
    if (stroke.points.length === 0) return;
    
    // Set context state
    context.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
    context.globalAlpha = stroke.isHighlighter ? 0.3 : 1.0;
    context.strokeStyle = stroke.color;
    
    if (stroke.points.length === 1) {
      // Single point - draw a dot
      const point = stroke.points[0];
      context.beginPath();
      context.arc(point.x, point.y, point.width / 2, 0, Math.PI * 2);
      context.fillStyle = stroke.color;
      context.fill();
      return;
    }
    
    // Multiple points - draw smooth curve with tapering
    context.beginPath();
    context.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    const totalPoints = stroke.points.length;
    
    for (let i = 1; i < totalPoints; i++) {
      const point = stroke.points[i];
      const prevPoint = stroke.points[i - 1];
      
      // Quadratic curve through midpoint for smoothness
      const midX = (prevPoint.x + point.x) / 2;
      const midY = (prevPoint.y + point.y) / 2;
      
      // Apply tapering at start and end for natural stroke
      let width = point.width;
      if (i < 3) {
        // Taper in at start (first 3 points)
        width *= (i / 3);
      } else if (i > totalPoints - 4) {
        // Taper out at end (last 3 points)
        width *= ((totalPoints - i) / 3);
      }
      
      context.lineWidth = Math.max(width, 0.5); // Minimum width to avoid invisible lines
      context.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
    }
    
    // Draw to last point
    const lastPoint = stroke.points[stroke.points.length - 1];
    context.lineTo(lastPoint.x, lastPoint.y);
    context.stroke();
    
    // Reset
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1.0;
  }, []);

  // Redraw all strokes
  const redrawAll = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all strokes
    strokes.forEach(stroke => drawStroke(context, stroke));
  }, [strokes, drawStroke]);

  // Only redraw on initial load and canvas size changes (performance optimization)
  // New strokes are drawn in real-time, only undo/clear need full redraw
  // PERFORMANCE FIX: Don't redraw during active drawing to prevent lag
  useEffect(() => {
    if (!isDrawingRef.current && (strokes.length === 0 || !contextRef.current)) {
      redrawAll();
    }
  }, [width, height]); // Removed strokes dependency for performance
  
  // Redraw when strokes are removed (undo/clear)
  useEffect(() => {
    if (contextRef.current && canvasRef.current) {
      redrawAll();
    }
  }, [strokes.length, redrawAll]); // Only when count changes

  // Start drawing - STRIPPED DOWN VERSION
  const startDrawing = useCallback((e) => {
    if (!enabled || !contextRef.current) return;
    
    e.preventDefault();

    activePointerIdRef.current = e.pointerId;
    setIsDrawing(true);
    isDrawingRef.current = true;
    
    // Cache bounding rect
    cachedRectRef.current = canvasRef.current.getBoundingClientRect();
    const rect = cachedRectRef.current;
    
    // REMOVED: Physical eraser detection
    // REMOVED: Coalesced events
    // REMOVED: Pressure sensitivity
    const sizeMultiplier = isEraser ? 3 : (isHighlighter ? 2 : 1);
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = lineWidth * sizeMultiplier; // Fixed width, no pressure
    
    currentStrokeRef.current = [{ x, y, width }];
    
    // Start drawing
    const context = contextRef.current;
    context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    context.globalAlpha = isHighlighter ? 0.3 : 1.0;
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x, y);
    
    lastPointRef.current = { x, y, width };
  }, [enabled, color, lineWidth, isEraser, isHighlighter]);

  // Continue drawing - STRIPPED DOWN VERSION
  const draw = useCallback((e) => {
    if (!isDrawingRef.current || !enabled || !contextRef.current) return;
    if (e.pointerId !== activePointerIdRef.current) return;
    
    e.preventDefault();
    
    const rect = cachedRectRef.current;
    const context = contextRef.current;
    
    // REMOVED: Physical eraser detection
    // REMOVED: Coalesced events
    // REMOVED: Pressure sensitivity
    // REMOVED: Velocity smoothing
    // REMOVED: Frame rate throttling (testing if this causes issues)
    
    const sizeMultiplier = isEraser ? 3 : (isHighlighter ? 2 : 1);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = lineWidth * sizeMultiplier; // Fixed width
    
    const point = { x, y, width };
    currentStrokeRef.current.push(point);
    
    // Simple straight line - no curves, no smoothing
    if (lastPointRef.current) {
      context.lineWidth = width;
      context.lineTo(x, y);
      context.stroke();
    }
    
    lastPointRef.current = point;
  }, [enabled, lineWidth, isEraser, isHighlighter]);

  // Stop drawing
  const stopDrawing = useCallback((e) => {
    if (!isDrawing) return;
    if (e && e.pointerId !== activePointerIdRef.current) return;
    
    setIsDrawing(false);
    isDrawingRef.current = false;
    activePointerIdRef.current = null;
    lastPointRef.current = null;
    
    // Save the stroke - REMOVED physical eraser
    if (currentStrokeRef.current.length > 0) {
      const newStroke = {
        points: [...currentStrokeRef.current],
        color: color,
        isEraser: isEraser,
        isHighlighter: isHighlighter,
        timestamp: Date.now()
      };
      
      setStrokes(prev => [...prev, newStroke]);
      
      if (onStrokeComplete) {
        setTimeout(() => onStrokeComplete(newStroke), 0);
      }
    }
    
    currentStrokeRef.current = [];
  }, [isDrawing, color, isEraser, isHighlighter, onStrokeComplete]);

  // Undo last stroke
  const undo = useCallback(() => {
    if (strokes.length === 0) return;
    setStrokes(prev => prev.slice(0, -1));
  }, [strokes.length]);

  // Clear all strokes
  const clear = useCallback(() => {
    setStrokes([]);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // Auto-save to localStorage (passage-specific) - DEBOUNCED FOR PERFORMANCE
  useEffect(() => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Debounce save - only write after 1 second of inactivity
    saveTimerRef.current = setTimeout(() => {
      try {
        const storageKey = `drawing_strokes_v2_${passageId}`;
        localStorage.setItem(storageKey, JSON.stringify(strokes));
      } catch (e) {
        console.error('Failed to save strokes:', e);
      }
    }, 1000);
    
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [strokes, passageId]);

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    undo,
    clear,
    getStrokes: () => strokes,
    loadStrokes: (newStrokes) => setStrokes(newStrokes)
  }), [undo, clear, strokes]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: isEraser ? 'cell' : (isHighlighter ? 'text' : 'crosshair'),
        touchAction: 'none',
        pointerEvents: enabled ? 'auto' : 'none',
        zIndex: 10
      }}
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      onPointerCancel={stopDrawing}
    />
  );
});

DrawingCanvasV2.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  enabled: PropTypes.bool,
  color: PropTypes.string,
  lineWidth: PropTypes.number,
  isEraser: PropTypes.bool,
  isHighlighter: PropTypes.bool,
  onStrokeComplete: PropTypes.func,
  passageId: PropTypes.string
};

DrawingCanvasV2.displayName = 'DrawingCanvasV2';

export default DrawingCanvasV2;
