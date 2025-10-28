import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * DrawingCanvas Component
 * 
 * Provides a transparent canvas overlay for drawing/annotating with pen/stylus.
 * Optimized for Surface Pro pen with pressure sensitivity support.
 * 
 * Features:
 * - Pen/stylus drawing with pressure sensitivity
 * - Multiple colors and line thicknesses
 * - Eraser tool
 * - Undo/Redo functionality
 * - Clear all drawings
 * - Touch-action prevention to avoid scrolling while drawing
 */
const DrawingCanvas = ({ 
  width, 
  height, 
  enabled = false,
  color = '#000000',
  lineWidth = 2,
  isEraser = false,
  isHighlighter = false,
  onStrokeComplete
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const currentStrokeRef = useRef([]);
  const lastPointRef = useRef(null);
  const activePointerIdRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas size to match container
    canvas.width = width;
    canvas.height = height;
    
    // Configure context for smooth drawing
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.imageSmoothingEnabled = true;
    
    contextRef.current = context;
    
    // Redraw all strokes when canvas resizes
    redrawCanvas();
  }, [width, height]);

  // Redraw all strokes on canvas
  const redrawCanvas = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all strokes
    strokes.forEach(stroke => {
      context.strokeStyle = stroke.color;
      context.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
      context.globalAlpha = stroke.isHighlighter ? 0.3 : 1.0;
      
      if (stroke.points.length === 1) {
        // Single point - draw a dot
        const point = stroke.points[0];
        context.beginPath();
        context.arc(point.x, point.y, point.width / 2, 0, Math.PI * 2);
        context.fillStyle = stroke.color;
        context.fill();
      } else {
        // Multiple points - draw smooth curve
        context.beginPath();
        context.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          const point = stroke.points[i];
          const prevPoint = stroke.points[i - 1];
          
          // Use quadratic curve for smoother lines
          const midX = (prevPoint.x + point.x) / 2;
          const midY = (prevPoint.y + point.y) / 2;
          
          context.lineWidth = point.width;
          context.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
        }
        
        // Draw to last point
        const lastPoint = stroke.points[stroke.points.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);
        context.stroke();
      }
    });
    
    // Reset composite operation and alpha
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1.0;
  }, [strokes]);

  // Start drawing
  const startDrawing = useCallback((e) => {
    if (!enabled || !contextRef.current) return;
    
    // Only respond to pen, touch, or mouse
    if (e.pointerType !== 'pen' && e.pointerType !== 'touch' && e.pointerType !== 'mouse') {
      return;
    }
    
    // Allow multi-touch gestures (2+ fingers) to pass through
    if (e.pointerType === 'touch' && activePointerIdRef.current !== null) {
      return; // Already drawing with one finger, ignore additional touches
    }

    activePointerIdRef.current = e.pointerId;
    setIsDrawing(true);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get pressure (0.5 default for devices without pressure)
    const pressure = e.pressure || 0.5;
    // Eraser is 3x larger, highlighter is 2x larger
    const sizeMultiplier = isEraser ? 3 : (isHighlighter ? 2 : 1);
    const width = (lineWidth * sizeMultiplier) + (pressure * lineWidth * 1.5);
    
    currentStrokeRef.current = [{
      x,
      y,
      width,
      pressure
    }];
    
    lastPointRef.current = { x, y };
    
    const context = contextRef.current;
    context.strokeStyle = color;
    context.lineWidth = width;
    context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    context.globalAlpha = isHighlighter ? 0.3 : 1.0;
    context.beginPath();
    context.moveTo(x, y);
  }, [enabled, color, lineWidth, isEraser, isHighlighter]);

  // Continue drawing
  const draw = useCallback((e) => {
    if (!isDrawing || !enabled || !contextRef.current) return;
    if (e.pointerId !== activePointerIdRef.current) return; // Only track the active pointer
    
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get pressure
    const pressure = e.pressure || 0.5;
    const sizeMultiplier = isEraser ? 3 : (isHighlighter ? 2 : 1);
    const width = (lineWidth * sizeMultiplier) + (pressure * lineWidth * 1.5);
    
    currentStrokeRef.current.push({
      x,
      y,
      width,
      pressure
    });
    
    const context = contextRef.current;
    context.lineWidth = width;
    
    // Use quadratic curve for smoother drawing
    if (lastPointRef.current) {
      const midX = (lastPointRef.current.x + x) / 2;
      const midY = (lastPointRef.current.y + y) / 2;
      context.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
      context.stroke();
      context.beginPath();
      context.moveTo(midX, midY);
    }
    
    lastPointRef.current = { x, y };
  }, [isDrawing, enabled, lineWidth, isEraser, isHighlighter]);

  // Stop drawing
  const stopDrawing = useCallback((e) => {
    if (!isDrawing) return;
    if (e && e.pointerId !== activePointerIdRef.current) return; // Only stop for the active pointer
    
    setIsDrawing(false);
    activePointerIdRef.current = null;
    lastPointRef.current = null;
    
    // Save the stroke
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
        onStrokeComplete(newStroke);
      }
    }
    
    currentStrokeRef.current = [];
  }, [isDrawing, color, isEraser, isHighlighter, onStrokeComplete]);

  // Undo last stroke
  const undo = useCallback(() => {
    if (strokes.length === 0) return;
    
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
  }, [strokes]);

  // Clear all strokes
  const clear = useCallback(() => {
    setStrokes([]);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // Redraw when strokes change
  useEffect(() => {
    redrawCanvas();
  }, [strokes, redrawCanvas]);

  // Expose undo and clear methods via ref
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.undo = undo;
      canvasRef.current.clear = clear;
      canvasRef.current.getStrokes = () => strokes;
    }
  }, [undo, clear, strokes]);

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
        touchAction: 'pan-y pinch-zoom', // Allow multi-touch gestures
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
};

DrawingCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  enabled: PropTypes.bool,
  color: PropTypes.string,
  lineWidth: PropTypes.number,
  isEraser: PropTypes.bool,
  isHighlighter: PropTypes.bool,
  onStrokeComplete: PropTypes.func
};

export default DrawingCanvas;
