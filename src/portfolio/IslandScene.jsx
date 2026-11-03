/* eslint-disable react/prop-types -- props del contrato del renderer, validados por uso interno */
import { useEffect, useRef } from 'react';
import { renderScene, replayTextQueue } from './sceneRenderer.js';

const W = 1280;
const H = 720;
const WORLD_STEP = 1600;
const TRAVEL_MS = 2500;
const PIXEL_H = 180;
const HIT_RX = 250;
const HIT_RY = 140;
const HIT_CENTER_Y = 420;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getSceneTransform(targetW, targetH) {
  const scale = Math.max(targetW / W, targetH / H);
  const offsetX = (targetW - W * scale) / 2;
  let offsetY = (targetH - H * scale) / 2;

  // Si la altura queda recortada (canvas más ancho que 16:9):
  // Aseguramos que el rango lógico y ∈ [180, 640] (isla, cartel, lancha y agua) se mantenga visible.
  if (targetH < H * scale) {
    if (640 * scale + offsetY > targetH) {
      offsetY = targetH - 640 * scale;
    }
    if (180 * scale + offsetY < 0) {
      offsetY = -180 * scale;
    }
  }

  return { scale, offsetX, offsetY };
}

function getLogicalCoords(event, canvas, currentStyle) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  const clientX = event.clientX;
  const clientY = event.clientY;
  if (typeof clientX !== 'number' || typeof clientY !== 'number') return null;

  const px = (clientX - rect.left) * (canvas.width / rect.width);
  const py = (clientY - rect.top) * (canvas.height / rect.height);

  if (currentStyle === 'pixel') {
    const pixelW = Math.max(1, Math.round(PIXEL_H * (canvas.width / canvas.height)));
    const pixelH = PIXEL_H;
    const bufX = px * (pixelW / canvas.width);
    const bufY = py * (pixelH / canvas.height);
    const { scale, offsetX, offsetY } = getSceneTransform(pixelW, pixelH);
    return {
      x: (bufX - offsetX) / scale,
      y: (bufY - offsetY) / scale,
    };
  }

  const { scale, offsetX, offsetY } = getSceneTransform(canvas.width, canvas.height);
  return {
    x: (px - offsetX) / scale,
    y: (py - offsetY) / scale,
  };
}

function hitTestIsland(logicalX, logicalY, cameraX, islandCount) {
  if (typeof logicalX !== 'number' || typeof logicalY !== 'number') return null;

  for (let i = 0; i < islandCount; i++) {
    const islandX = 640 + i * WORLD_STEP - cameraX;
    if (Math.abs(logicalX - islandX) > HIT_RX || Math.abs(logicalY - HIT_CENTER_Y) > HIT_RY) {
      continue;
    }
    const dx = (logicalX - islandX) / HIT_RX;
    const dy = (logicalY - HIT_CENTER_Y) / HIT_RY;
    if (dx * dx + dy * dy <= 1) {
      return i;
    }
  }
  return null;
}

export default function IslandScene({
  projects,
  selectedIndex,
  onArrive,
  onTravel,
  style,
  paused,
  onIslandClick,
}) {
  const canvasRef = useRef(null);
  const callbacks = useRef({ onArrive, onTravel, onIslandClick });
  const props = useRef({ projects, selectedIndex, style, paused });
  const scheduleRef = useRef(null);
  const pointerPos = useRef(null);
  const updateHoverRef = useRef(null);
  const scene = useRef({
    cameraX: selectedIndex * WORLD_STEP,
    fromX: selectedIndex * WORLD_STEP,
    toX: selectedIndex * WORLD_STEP,
    progress: 1,
    moving: false,
    direction: 1,
    selectedIndex,
    hoveredIndex: null,
  });

  useEffect(() => {
    callbacks.current = { onArrive, onTravel, onIslandClick };
  }, [onArrive, onTravel, onIslandClick]);

  useEffect(() => {
    props.current = { projects, selectedIndex, style, paused };
    if (pointerPos.current) {
      updateHoverRef.current?.(pointerPos.current.clientX, pointerPos.current.clientY);
    }
    scheduleRef.current?.();
  }, [projects, selectedIndex, style, paused]);

  useEffect(() => {
    const state = scene.current;
    if (selectedIndex === state.selectedIndex) return;

    state.fromX = state.cameraX;
    state.toX = selectedIndex * WORLD_STEP;
    state.direction = state.toX >= state.fromX ? 1 : -1;
    state.selectedIndex = selectedIndex;

    if (prefersReducedMotion() || state.fromX === state.toX) {
      state.cameraX = state.toX;
      state.progress = 1;
      state.moving = false;
      callbacks.current.onArrive?.();
      if (pointerPos.current) {
        updateHoverRef.current?.(pointerPos.current.clientX, pointerPos.current.clientY);
      }
    } else {
      state.progress = 0;
      state.moving = true;
      callbacks.current.onTravel?.();
    }

    scheduleRef.current?.();
  }, [selectedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    let raf = 0;
    let last = 0;
    let time = 0;
    let disposed = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Buffer lowres persistente para el estilo pixel con ancho variable.
    const buffer = document.createElement('canvas');
    buffer.width = Math.max(1, Math.round(PIXEL_H * (canvas.width / canvas.height || 16 / 9)));
    buffer.height = PIXEL_H;
    const bufferCtx = buffer.getContext('2d');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawScene = (target, state, current, textQueue) => {
      const { scale, offsetX, offsetY } = getSceneTransform(target.canvas.width, target.canvas.height);

      target.setTransform(1, 0, 0, 1, 0, 0);
      target.clearRect(0, 0, target.canvas.width, target.canvas.height);
      target.save();
      target.translate(offsetX, offsetY);
      target.scale(scale, scale);
      renderScene(target, {
        time,
        cameraX: state.cameraX,
        boatX: 640,
        boatY: 535,
        moving: state.moving,
        direction: state.direction,
        progress: state.progress,
        paused: current.paused,
        reducedMotion: reduced.matches,
        projects: current.projects,
        selectedIndex: state.selectedIndex,
        style: current.style,
        hoveredIndex: state.hoveredIndex,
        textQueue,
      });
      target.restore();
    };

    const schedule = () => {
      if (disposed || document.hidden || raf) return;
      last = 0;
      raf = requestAnimationFrame(draw);
    };
    scheduleRef.current = schedule;

    const updateHoverAt = (clientX, clientY) => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const coords = getLogicalCoords({ clientX, clientY }, cvs, props.current.style);
      if (!coords) return;
      const islandCount = Math.max(props.current.projects?.length || 0, 4);
      const hit = hitTestIsland(coords.x, coords.y, scene.current.cameraX, islandCount);
      if (scene.current.hoveredIndex !== hit) {
        scene.current.hoveredIndex = hit;
        cvs.style.cursor = hit !== null ? 'pointer' : '';
        schedule();
      }
    };
    updateHoverRef.current = updateHoverAt;

    const clearHover = () => {
      pointerPos.current = null;
      const cvs = canvasRef.current;
      if (scene.current.hoveredIndex !== null) {
        scene.current.hoveredIndex = null;
        if (cvs) cvs.style.cursor = '';
        schedule();
      }
    };

    const handlePointerMove = (e) => {
      pointerPos.current = { clientX: e.clientX, clientY: e.clientY };
      updateHoverAt(e.clientX, e.clientY);
    };

    const handlePointerDown = (e) => {
      pointerPos.current = { clientX: e.clientX, clientY: e.clientY };
      updateHoverAt(e.clientX, e.clientY);
    };

    const handleClick = (e) => {
      if (scene.current.moving) return;
      const cvs = canvasRef.current;
      if (!cvs) return;
      const coords = getLogicalCoords(e, cvs, props.current.style);
      if (!coords) return;
      const islandCount = Math.max(props.current.projects?.length || 0, 4);
      const hit = hitTestIsland(coords.x, coords.y, scene.current.cameraX, islandCount);
      if (hit !== null) {
        callbacks.current.onIslandClick?.(hit);
      }
    };

    const draw = (now) => {
      raf = 0;
      if (disposed || document.hidden) return;

      resize();
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;

      const state = scene.current;
      const current = props.current;
      if (!current.paused && !reduced.matches) time += dt / 1000;

      if (state.moving) {
        state.progress = Math.min(1, state.progress + dt / TRAVEL_MS);
        state.cameraX = state.fromX + (state.toX - state.fromX) * easeInOutCubic(state.progress);
        if (state.progress === 1) {
          state.cameraX = state.toX;
          state.moving = false;
          callbacks.current.onArrive?.();
          if (pointerPos.current) {
            updateHoverAt(pointerPos.current.clientX, pointerPos.current.clientY);
          }
        }
      }

      if (current.style === 'pixel') {
        const aspect = canvas.width / canvas.height;
        const pixelW = Math.max(1, Math.round(PIXEL_H * aspect));
        if (buffer.width !== pixelW || buffer.height !== PIXEL_H) {
          buffer.width = pixelW;
          buffer.height = PIXEL_H;
        }
        const textQueue = [];
        drawScene(bufferCtx, state, current, textQueue);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;

        if (textQueue.length > 0) {
          const scaleX = canvas.width / buffer.width;
          const scaleY = canvas.height / buffer.height;
          replayTextQueue(ctx, textQueue, scaleX, scaleY);
        }
      } else {
        drawScene(ctx, state, current);
      }

      if (state.moving || (!current.paused && !reduced.matches)) {
        raf = requestAnimationFrame(draw);
      }
    };

    const handleMotionChange = () => {
      const state = scene.current;
      if (reduced.matches && state.moving) {
        state.cameraX = state.toX;
        state.progress = 1;
        state.moving = false;
        callbacks.current.onArrive?.();
        if (pointerPos.current) {
          updateHoverAt(pointerPos.current.clientX, pointerPos.current.clientY);
        }
      }
      schedule();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      } else {
        schedule();
      }
    };

    const observer = new ResizeObserver(() => schedule());
    observer.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibility);
    reduced.addEventListener?.('change', handleMotionChange);

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerleave', clearHover);
    canvas.addEventListener('pointercancel', clearHover);
    canvas.addEventListener('click', handleClick);

    resize();
    schedule();

    return () => {
      disposed = true;
      scheduleRef.current = null;
      updateHoverRef.current = null;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      reduced.removeEventListener?.('change', handleMotionChange);

      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerleave', clearHover);
      canvas.removeEventListener('pointercancel', clearHover);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="scene-canvas">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Lancha navegando por un archipiélago de proyectos"
      />
    </div>
  );
}
