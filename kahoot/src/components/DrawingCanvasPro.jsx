import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLog } from '../context/LogContext';

/**
 * DrawingCanvasPro Component
 * 
 * Professional-grade drawing canvas optimized for Surface Slim Pen 2.
 * 
 * Key Optimizations:
 * - getCoalescedEvents() - Captures ALL pen points (no missed events)
 * - getPredictedEvents() - Reduces perceived latency by drawing ahead
 * - Catmull-Rom splines - Ultra-smooth curves
 * - Optimized pressure curve for Slim Pen 2 (4096 levels)
 * - Tilt support for natural shading
 * - Offscreen canvas for better performance
 * - requestAnimationFrame for smooth rendering
 * 
 * Surface Slim Pen 2 Specs:
 * - 4,096 pressure levels
 * - Tilt detection
 * - Ultra-low latency with 120Hz displays
 * - Haptic feedback support
 */
const DrawingCanvasPro = React.forwardRef(({ 
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
  const { addLog } = useLog();
  
  // DEBUG FLAG: Set to false to disable verbose performance logging
  const DEBUG_PERFORMANCE = false;
  
  // Helper to conditionally log performance metrics
  const perfLog = useCallback((message) => {
    if (DEBUG_PERFORMANCE) {
      addLog(message);
    }
  }, [addLog]); // DEBUG_PERFORMANCE is constant, no need in deps
  
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const offscreenContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false); // Ref for draw() to avoid stale closure
  const renderCountRef = useRef(0); // Track render cycles
  const lastRenderTimeRef = useRef(Date.now()); // Track render timing
  const cachedRectRef = useRef(null); // Cache canvas bounding rect
  // Get passage-specific storage key
  const getStorageKey = useCallback(() => {
    return `drawing_strokes_${passageId}`;
  }, [passageId]);

  const [strokes, setStrokes] = useState(() => {
    // Load from localStorage on mount with passage-specific key
    try {
      const storageKey = `drawing_strokes_${passageId}`;
      const saved = localStorage.getItem(storageKey);
      const loadedStrokes = saved ? JSON.parse(saved) : [];
      addLog(`[CANVAS] Initialized, passageId=${passageId}, loadedStrokes=${loadedStrokes.length}`);
      return loadedStrokes;
    } catch (e) {
      addLog(`[CANVAS] ❌ Failed to load strokes: ${e.message}`);
      console.error('Failed to load strokes:', e);
      return [];
    }
  });
  const currentStrokeRef = useRef([]);
  const activePointerIdRef = useRef(null);
  const animationFrameRef = useRef(null);
  const predictedPointsRef = useRef([]);
  const isPhysicalEraserActiveRef = useRef(false); // Track physical eraser state during stroke
  const strokeStartTimeRef = useRef(0); // Track stroke duration
  const strokeMetricsRef = useRef({ totalPressure: 0, pointCount: 0 }); // Track pressure metrics

  // Optimized pressure curve for Surface Slim Pen 2
  const calculatePressureWidth = useCallback((pressure, baseWidth, sizeMultiplier) => {
    // Slim Pen 2 has 4096 pressure levels (0.0 to 1.0)
    // Apply a curve that feels natural for writing
    const normalizedPressure = pressure || 0.5;
    
    // Exponential curve for more natural feel
    // Light touch = thin, medium = normal, hard = thick
    const curve = Math.pow(normalizedPressure, 0.7); // Softer curve
    
    const minWidth = baseWidth * sizeMultiplier * 0.5;
    const maxWidth = baseWidth * sizeMultiplier * 2.5;
    
    return minWidth + (maxWidth - minWidth) * curve;
  }, []);

  // Catmull-Rom spline for ultra-smooth curves
  const getCatmullRomPoint = useCallback((p0, p1, p2, p3, t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    
    return {
      x: 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      ),
      y: 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      )
    };
  }, []);

  // Draw smooth stroke using Catmull-Rom splines
  const drawSmoothStroke = useCallback((context, points, strokeColor, isEraserMode, isHighlighterMode) => {
    if (points.length === 0) return;
    
    context.globalCompositeOperation = isEraserMode ? 'destination-out' : 'source-over';
    context.globalAlpha = isHighlighterMode ? 0.3 : 1.0;
    context.strokeStyle = strokeColor;
    
    if (points.length === 1) {
      // Single point - draw a dot
      const point = points[0];
      context.beginPath();
      context.arc(point.x, point.y, point.width / 2, 0, Math.PI * 2);
      context.fillStyle = strokeColor;
      context.fill();
      return;
    }
    
    if (points.length === 2) {
      // Two points - draw a line
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineWidth = points[0].width;
      context.lineTo(points[1].x, points[1].y);
      context.stroke();
      return;
    }
    
    // Multiple points - use Catmull-Rom spline
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      // Interpolate between p1 and p2 using Catmull-Rom
      const segments = 8; // More segments = smoother
      for (let t = 0; t <= segments; t++) {
        const point = getCatmullRomPoint(p0, p1, p2, p3, t / segments);
        
        // Interpolate width
        const widthT = t / segments;
        const width = p1.width + (p2.width - p1.width) * widthT;
        context.lineWidth = width;
        
        context.lineTo(point.x, point.y);
      }
    }
    
    context.stroke();
    
    // Reset
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1.0;
  }, [getCatmullRomPoint]);

  // Redraw all strokes on offscreen canvas, then copy to main canvas
  const redrawCanvas = useCallback(() => {
    if (!contextRef.current || !offscreenContextRef.current || !canvasRef.current) return;
    
    const offscreenCtx = offscreenContextRef.current;
    const mainCtx = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear offscreen canvas
    offscreenCtx.clearRect(0, 0, width, height);
    
    // Draw all strokes on offscreen canvas
    strokes.forEach(stroke => {
      drawSmoothStroke(
        offscreenCtx,
        stroke.points,
        stroke.color,
        stroke.isEraser,
        stroke.isHighlighter
      );
    });
    
    // Copy offscreen canvas to main canvas
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    mainCtx.drawImage(offscreenCanvasRef.current, 0, 0);
  }, [strokes, width, height, drawSmoothStroke]);

  // Initialize canvas with offscreen buffer
  useEffect(() => {
    if (!canvasRef.current) {
      addLog(`[CANVAS] ❌ Canvas ref not available during init`);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true, // Hint for low-latency rendering
      willReadFrequently: false
    });
    
    addLog(`[CANVAS] Initializing canvas: ${width}x${height}, DPR=${window.devicePixelRatio || 1}`);
    
    // High-DPI support - fix pixelation on retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpr, dpr);
    
    // Create offscreen canvas for better performance (also high-DPI)
    const offscreenCanvas = new OffscreenCanvas(width * dpr, height * dpr);
    const offscreenContext = offscreenCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false
    });
    
    // Configure contexts for smooth drawing
    [context, offscreenContext].forEach(ctx => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    });
    
    // Scale offscreen context for high-DPI
    offscreenContext.scale(dpr, dpr);
    
    contextRef.current = context;
    offscreenCanvasRef.current = offscreenCanvas;
    offscreenContextRef.current = offscreenContext;
    
    addLog(`[CANVAS] Canvas initialized successfully`);
  }, [width, height, addLog]); // Only re-init when width/height change - NOT when strokes change
  
  // Separate effect for redrawing when strokes change (without re-initializing canvas)
  // CRITICAL: Only redraw on canvas size changes (width/height), NOT on stroke changes
  // New strokes are drawn incrementally in stopDrawing() - only undo/clear need full redraw
  useEffect(() => {
    const effectStartTime = performance.now();
    const timeSinceLastRender = effectStartTime - lastRenderTimeRef.current;
    renderCountRef.current++;
    perfLog(`[PERF] 🔄 Redraw useEffect triggered! Render #${renderCountRef.current}, ${timeSinceLastRender.toFixed(2)}ms since last render`);
    perfLog(`[PERF] 📊 Current state: ${strokes.length} strokes, canvas: ${width}x${height}`);
    
    // Only redraw on initial load or when canvas size changes
    // New strokes are handled incrementally in stopDrawing()
    // Undo/clear operations call redrawCanvas() explicitly
    if (contextRef.current && offscreenContextRef.current && canvasRef.current && strokes.length > 0) {
      const offscreenCtx = offscreenContextRef.current;
      const mainCtx = contextRef.current;
      const canvas = canvasRef.current;
      
      // Clear offscreen canvas
      offscreenCtx.clearRect(0, 0, width, height);
      
      // Draw all strokes on offscreen canvas (only on initial load)
      strokes.forEach(stroke => {
        drawSmoothStroke(
          offscreenCtx,
          stroke.points,
          stroke.color,
          stroke.isEraser,
          stroke.isHighlighter
        );
      });
      
      // Copy offscreen canvas to main canvas
      mainCtx.clearRect(0, 0, canvas.width, canvas.height);
      mainCtx.drawImage(offscreenCanvasRef.current, 0, 0);
      
      const effectEndTime = performance.now();
      const effectDuration = effectEndTime - effectStartTime;
      lastRenderTimeRef.current = effectEndTime;
      addLog(`[CANVAS] Initial redraw: ${strokes.length} strokes loaded`);
      perfLog(`[PERF] ⏱️ Redraw useEffect TOTAL: ${effectDuration.toFixed(2)}ms`);
    } else {
      perfLog(`[PERF] ⏭️ Redraw useEffect SKIPPED (no strokes or contexts not ready)`);
    }
  }, [width, height]); // CRITICAL: Only width/height - NO strokes.length, NO drawSmoothStroke, NO addLog!

  // Start drawing
  const startDrawing = useCallback((e) => {
    const fnStartTime = performance.now();
    perfLog(`[PERF] 🎬 startDrawing() called at ${fnStartTime.toFixed(2)}ms`);
    
    if (!enabled || !contextRef.current) {
      if (!enabled) addLog(`[CANVAS] ❌ startDrawing blocked: drawing not enabled`);
      if (!contextRef.current) addLog(`[CANVAS] ❌ startDrawing blocked: context not available`);
      return;
    }
    
    // Physical eraser detection (Slim Pen 2 eraser button) - buttons === 32
    const isPhysicalEraserActive = e.pointerType === 'pen' && e.buttons === 32;
    
    // Track stroke start time for duration metrics
    strokeStartTimeRef.current = Date.now();
    strokeMetricsRef.current = { totalPressure: 0, pointCount: 0 };
    
    addLog(`[PEN] ✏️ Stroke started: type=${e.pointerType}, pressure=${e.pressure?.toFixed(3) || 'N/A'}, buttons=${e.buttons}, physicalEraser=${isPhysicalEraserActive}, tilt=[${e.tiltX || 0},${e.tiltY || 0}]`);
    
    // Only respond to pen, touch, or mouse
    if (e.pointerType !== 'pen' && e.pointerType !== 'touch' && e.pointerType !== 'mouse') {
      return;
    }
    
    // Allow multi-touch gestures (2+ fingers) to pass through
    if (e.pointerType === 'touch' && activePointerIdRef.current !== null) {
      return;
    }

    activePointerIdRef.current = e.pointerId;
    setIsDrawing(true);
    isDrawingRef.current = true;
    
    // Store physical eraser state for this stroke
    isPhysicalEraserActiveRef.current = isPhysicalEraserActive;
    
    // Cache bounding rect for this stroke (avoid recalc on every move)
    cachedRectRef.current = canvasRef.current.getBoundingClientRect();
    const rect = cachedRectRef.current;
    // Physical eraser OR UI eraser toggle
    const sizeMultiplier = (isEraser || isPhysicalEraserActive) ? 3 : (isHighlighter ? 2 : 1);
    
    // Process coalesced events for maximum accuracy
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    
    currentStrokeRef.current = events.map(event => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pressure = event.pressure || 0.5;
      const width = calculatePressureWidth(pressure, lineWidth, sizeMultiplier);
      
      return {
        x,
        y,
        width,
        pressure,
        tiltX: event.tiltX || 0,
        tiltY: event.tiltY || 0
      };
    });
    
    // Start drawing immediately
    const context = contextRef.current;
    const firstPoint = currentStrokeRef.current[0];
    
    // Use physical eraser OR UI eraser
    context.globalCompositeOperation = (isEraser || isPhysicalEraserActive) ? 'destination-out' : 'source-over';
    context.globalAlpha = isHighlighter ? 0.3 : 1.0;
    context.strokeStyle = color;
    context.lineWidth = firstPoint.width;
    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    
    // Track initial pressure
    strokeMetricsRef.current.totalPressure += firstPoint.pressure;
    strokeMetricsRef.current.pointCount += events.length;
    
    const fnEndTime = performance.now();
    const fnDuration = fnEndTime - fnStartTime;
    addLog(`[PEN] Initial point: x=${firstPoint.x.toFixed(1)}, y=${firstPoint.y.toFixed(1)}, width=${firstPoint.width.toFixed(2)}, pressure=${firstPoint.pressure.toFixed(3)}, coalescedEvents=${events.length}`);
    perfLog(`[PERF] ⏱️ startDrawing() completed in ${fnDuration.toFixed(2)}ms`);
  }, [enabled, color, lineWidth, isEraser, isHighlighter, calculatePressureWidth, addLog]);

  // Continue drawing with coalesced events
  const draw = useCallback((e) => {
    const drawStartTime = performance.now();
    
    if (!isDrawingRef.current || !enabled || !contextRef.current) return;
    if (e.pointerId !== activePointerIdRef.current) {
      addLog(`[CANVAS] ⚠️ Pointer ID mismatch: expected=${activePointerIdRef.current}, got=${e.pointerId}`);
      return;
    }
    
    e.preventDefault();
    
    // Use cached rect (avoid expensive getBoundingClientRect on every move)
    const rect = cachedRectRef.current;
    const context = contextRef.current;
    const isPhysicalEraserActive = e.pointerType === 'pen' && e.buttons === 32;
    const sizeMultiplier = (isEraser || isPhysicalEraserActive) ? 3 : (isHighlighter ? 2 : 1);
    
    // Set context state for incremental drawing (must be set on every draw call)
    context.globalCompositeOperation = (isEraser || isPhysicalEraserActive) ? 'destination-out' : 'source-over';
    context.globalAlpha = isHighlighter ? 0.3 : 1.0;
    context.strokeStyle = color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Get ALL coalesced events (critical for Surface Pen accuracy)
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    
    // SINGLE LOOP: Process and draw events in one pass (was duplicated before!)
    events.forEach(event => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pressure = event.pressure || 0.5;
      const width = calculatePressureWidth(pressure, lineWidth, sizeMultiplier);
      
      const point = {
        x,
        y,
        width,
        pressure,
        tiltX: event.tiltX || 0,
        tiltY: event.tiltY || 0
      };
      
      currentStrokeRef.current.push(point);
      
      // Track pressure metrics
      strokeMetricsRef.current.totalPressure += pressure;
      strokeMetricsRef.current.pointCount++;
      
      // Draw incrementally for immediate feedback
      const len = currentStrokeRef.current.length;
      if (len === 1) {
        // First point after startDrawing - just move to it
        context.beginPath();
        context.moveTo(point.x, point.y);
      } else if (len >= 2) {
        // Draw line from previous point to current point
        const prevPoint = currentStrokeRef.current[len - 2];
        context.lineWidth = width;
        context.lineTo(point.x, point.y);
        context.stroke();
        context.beginPath();
        context.moveTo(point.x, point.y);
      }
    });
    
    // Log every 10th point to avoid spam, with pressure info
    if (currentStrokeRef.current.length % 10 === 0) {
      const avgPressure = strokeMetricsRef.current.totalPressure / strokeMetricsRef.current.pointCount;
      const drawDuration = performance.now() - drawStartTime;
      addLog(`[PEN] Drawing progress: points=${currentStrokeRef.current.length}, coalescedEvents=${events.length}, avgPressure=${avgPressure.toFixed(3)}`);
      perfLog(`[PERF] ⚡ draw() execution: ${drawDuration.toFixed(2)}ms for ${events.length} events`);
    }
    
    // Get predicted events for ultra-low latency
    if (e.getPredictedEvents) {
      const predictedEvents = e.getPredictedEvents();
      predictedPointsRef.current = predictedEvents.map(event => {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pressure = event.pressure || 0.5;
        const width = calculatePressureWidth(pressure, lineWidth, sizeMultiplier);
        
        return { x, y, width, pressure };
      });
      
      // Draw predicted points with lower opacity
      if (predictedPointsRef.current.length > 0) {
        context.save();
        context.globalAlpha = (isHighlighter ? 0.3 : 1.0) * 0.5; // 50% opacity for predictions
        
        predictedPointsRef.current.forEach(point => {
          context.lineWidth = point.width;
          context.lineTo(point.x, point.y);
        });
        context.stroke();
        context.restore();
        
        if (predictedPointsRef.current.length > 0) {
          addLog(`[PEN] ⚡ Predicted ${predictedPointsRef.current.length} future points for low-latency rendering`);
        }
      }
    }
  }, [enabled, lineWidth, isEraser, isHighlighter, calculatePressureWidth, perfLog, addLog]); // isDrawing removed - checked via state

  // Stop drawing and save stroke
  const stopDrawing = useCallback((e) => {
    const stopStartTime = performance.now();
    perfLog(`[PERF] 🛑 stopDrawing() called at ${stopStartTime.toFixed(2)}ms`);
    
    if (!isDrawing) return;
    if (e && e.pointerId !== activePointerIdRef.current) {
      addLog(`[CANVAS] ⚠️ stopDrawing: Pointer ID mismatch`);
      return;
    }
    
    // Calculate stroke metrics
    const strokeDuration = Date.now() - strokeStartTimeRef.current;
    const avgPressure = strokeMetricsRef.current.pointCount > 0 
      ? strokeMetricsRef.current.totalPressure / strokeMetricsRef.current.pointCount 
      : 0;
    const pointsPerSecond = strokeDuration > 0 
      ? (currentStrokeRef.current.length / (strokeDuration / 1000)).toFixed(0) 
      : 0;
    
    addLog(`[PEN] ✓ Stroke ended: totalPoints=${currentStrokeRef.current.length}, duration=${strokeDuration}ms, avgPressure=${avgPressure.toFixed(3)}, speed=${pointsPerSecond}pts/s`);
    
    setIsDrawing(false);
    activePointerIdRef.current = null;
    predictedPointsRef.current = [];
    strokeStartTimeRef.current = 0;
    strokeMetricsRef.current = { totalPressure: 0, pointCount: 0 };
    
    // Save the stroke
    if (currentStrokeRef.current.length > 0) {
      // Use the physical eraser state captured at stroke start (e.buttons is 0 on pointerup)
      const wasPhysicalEraser = isPhysicalEraserActiveRef.current;
      const newStroke = {
        points: [...currentStrokeRef.current],
        color: color,
        isEraser: isEraser || wasPhysicalEraser,
        isHighlighter: isHighlighter,
        timestamp: Date.now()
      };
      
      // Reset physical eraser state
      isPhysicalEraserActiveRef.current = false;
      
      const setStrokesStartTime = performance.now();
      perfLog(`[PERF] 📝 Calling setStrokes() at ${setStrokesStartTime.toFixed(2)}ms`);
      
      setStrokes(prev => {
        const updated = [...prev, newStroke];
        
        // Calculate stroke statistics
        const minPressure = Math.min(...newStroke.points.map(p => p.pressure));
        const maxPressure = Math.max(...newStroke.points.map(p => p.pressure));
        const avgPressure = newStroke.points.reduce((sum, p) => sum + p.pressure, 0) / newStroke.points.length;
        const hasTilt = newStroke.points.some(p => p.tiltX !== 0 || p.tiltY !== 0);
        
        const setStrokesEndTime = performance.now();
        const setStrokesDuration = setStrokesEndTime - setStrokesStartTime;
        addLog(`[PEN] 💾 Stroke saved: totalStrokes=${updated.length}, points=${newStroke.points.length}, isEraser=${newStroke.isEraser}, pressure=[min:${minPressure.toFixed(3)}, avg:${avgPressure.toFixed(3)}, max:${maxPressure.toFixed(3)}], tilt=${hasTilt}`);
        perfLog(`[PERF] ⏱️ setStrokes() callback executed in ${setStrokesDuration.toFixed(2)}ms`);
        return updated;
      });
      
      // Update parent that strokes exist (for undo button)
      if (onStrokeComplete) {
        // Trigger callback to update canUndo state
        setTimeout(() => {
          if (onStrokeComplete) onStrokeComplete(newStroke);
        }, 0);
      }
      
      // Draw the final smooth stroke directly without clearing
      // This prevents flicker by only adding the new stroke
      const mainCanvasDrawStart = performance.now();
      if (contextRef.current) {
        perfLog(`[PERF] 🎨 Drawing final stroke to MAIN canvas: ${newStroke.points.length} points`);
        drawSmoothStroke(
          contextRef.current,
          newStroke.points,
          newStroke.color,
          newStroke.isEraser,
          newStroke.isHighlighter
        );
        const mainCanvasDrawEnd = performance.now();
        perfLog(`[PERF] ⏱️ Main canvas draw took ${(mainCanvasDrawEnd - mainCanvasDrawStart).toFixed(2)}ms`);
      }
      
      // Also update offscreen canvas for future redraws
      const offscreenDrawStart = performance.now();
      if (offscreenContextRef.current) {
        perfLog(`[PERF] 🎨 Drawing final stroke to OFFSCREEN canvas: ${newStroke.points.length} points`);
        drawSmoothStroke(
          offscreenContextRef.current,
          newStroke.points,
          newStroke.color,
          newStroke.isEraser,
          newStroke.isHighlighter
        );
        const offscreenDrawEnd = performance.now();
        perfLog(`[PERF] ⏱️ Offscreen canvas draw took ${(offscreenDrawEnd - offscreenDrawStart).toFixed(2)}ms`);
      }
    }
    
    currentStrokeRef.current = [];
    isDrawingRef.current = false;
    
    const stopEndTime = performance.now();
    const stopTotalDuration = stopEndTime - stopStartTime;
    perfLog(`[PERF] ✅ stopDrawing() TOTAL duration: ${stopTotalDuration.toFixed(2)}ms`);
  }, [isDrawing, color, isEraser, isHighlighter, onStrokeComplete, drawSmoothStroke, addLog]);

  // Undo last stroke
  const undo = useCallback(() => {
    if (strokes.length === 0) {
      addLog(`[CANVAS] ⚠️ Undo called but no strokes to undo`);
      return;
    }
    const newStrokes = strokes.slice(0, -1);
    addLog(`[CANVAS] Undo: ${strokes.length} → ${newStrokes.length} strokes`);
    setStrokes(newStrokes);
    
    // Redraw after undo
    requestAnimationFrame(() => {
      redrawCanvas();
      addLog(`[CANVAS] Canvas redrawn after undo`);
    });
  }, [strokes, redrawCanvas, addLog]);

  // Clear all strokes
  const clear = useCallback(() => {
    const previousCount = strokes.length;
    addLog(`[CANVAS] Clear all: removing ${previousCount} strokes`);
    setStrokes([]);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (offscreenContextRef.current) {
      offscreenContextRef.current.clearRect(0, 0, width, height);
    }
    addLog(`[CANVAS] ✅ Canvas cleared successfully`);
  }, [width, height, strokes.length, addLog]);

  // Only redraw when strokes are removed (undo/clear), not when added
  // New strokes are drawn incrementally to prevent flicker
  useEffect(() => {
    // Redraw only needed for undo/clear operations
    // Normal drawing is handled incrementally in stopDrawing()
  }, [strokes, redrawCanvas]);

  // Auto-save to localStorage whenever strokes change (passage-specific)
  useEffect(() => {
    const saveStartTime = performance.now();
    try {
      const storageKey = getStorageKey();
      const jsonString = JSON.stringify(strokes);
      const jsonSize = new Blob([jsonString]).size;
      localStorage.setItem(storageKey, jsonString);
      const saveEndTime = performance.now();
      const saveDuration = saveEndTime - saveStartTime;
      addLog(`[CANVAS] Auto-saved ${strokes.length} strokes to localStorage (key: ${storageKey})`);
      perfLog(`[PERF] 💾 localStorage save: ${saveDuration.toFixed(2)}ms, size: ${(jsonSize / 1024).toFixed(2)}KB`);
    } catch (e) {
      addLog(`[CANVAS] ❌ Auto-save failed: ${e.message}`);
      console.error('Failed to save strokes:', e);
    }
  }, [strokes, getStorageKey, addLog]);

  // Expose methods via ref (using React.useImperativeHandle)
  React.useImperativeHandle(ref, () => ({
    undo,
    clear,
    getStrokes: () => strokes,
    loadStrokes: (newStrokes) => {
      setStrokes(newStrokes);
      requestAnimationFrame(() => redrawCanvas());
    }
  }), [undo, clear, strokes, redrawCanvas]);

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
        touchAction: 'none', // Prevent all default touch behaviors for drawing
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

DrawingCanvasPro.propTypes = {
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

DrawingCanvasPro.displayName = 'DrawingCanvasPro';

export default DrawingCanvasPro;
