import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

const INSTAGRAM = 'https://www.instagram.com/chhand.reghancha/';
const modulo = (value, width) => ((value % width) + width) % width;

export function DrawingCarousel({ items }) {
  const trackRef = useRef(null);
  const leadingRef = useRef(null);
  const originalRef = useRef(null);
  const loopWidthRef = useRef(0);
  const manualMotionRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const [animationVersion, setAnimationVersion] = useState(0);
  const [failedSources, setFailedSources] = useState(() => new Set());
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const id = useId();
  const trackId = `${id}-drawings`;
  const helpId = `${id}-help`;
  const multiple = items.length > 1;

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !originalRef.current || !leadingRef.current) return;
    const width = originalRef.current.offsetLeft - leadingRef.current.offsetLeft;
    if (!width) return;
    const oldWidth = loopWidthRef.current;
    const phase = oldWidth ? modulo(track.scrollLeft, oldWidth) / oldWidth : 0;
    loopWidthRef.current = width;
    manualMotionRef.current = null;
    track.scrollTo({ left: width + phase * width, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (trackRef.current) observer?.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items.length, measure]);

  useEffect(() => {
    if (!multiple) return;
    const autoplay = !paused && !hovered && !focused && !reducedMotion;
    if (!autoplay && !manualMotionRef.current) return;
    let frame;
    let lastTime = null;
    function animate(time) {
      const track = trackRef.current;
      if (!track) return;
      const width = loopWidthRef.current;
      const elapsed = lastTime === null ? 0 : Math.min(time - lastTime, 64);
      lastTime = time;
      const motion = manualMotionRef.current;
      if (motion && width) {
        motion.started ??= time;
        const progress = reducedMotion ? 1 : Math.min(1, (time - motion.started) / 400);
        const eased = (1 - Math.cos(Math.PI * progress)) / 2;
        track.scrollTo({ left: width + modulo(motion.start + motion.distance * eased, width), behavior: 'instant' });
        if (progress === 1) manualMotionRef.current = null;
      } else if (autoplay && width) {
        track.scrollTo({ left: width + modulo(track.scrollLeft + elapsed * .035, width), behavior: 'instant' });
      }
      if (autoplay || manualMotionRef.current) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [multiple, paused, hovered, focused, reducedMotion, animationVersion]);

  if (!items.length) return null;

  function pauseForInteraction() {
    setPaused(true);
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), 5000);
  }

  function stopForInteraction() {
    manualMotionRef.current = null;
    pauseForInteraction();
  }

  function scroll(direction) {
    pauseForInteraction();
    const track = trackRef.current;
    const width = loopWidthRef.current;
    if (!track || !width) return;
    const start = modulo(track.scrollLeft, width);
    const lastDrawing = (items.length - 1) * width / items.length;
    const distance = direction === 'start' ? -start : direction === 'end' ? lastDrawing - start : direction * track.clientWidth * .8;
    manualMotionRef.current = { start, distance, started: null };
    setAnimationVersion(current => current + 1);
  }

  function normalizeScroll() {
    const track = trackRef.current;
    const width = loopWidthRef.current;
    if (track && width && (track.scrollLeft < width || track.scrollLeft >= 2 * width)) {
      track.scrollTo({ left: width + modulo(track.scrollLeft, width), behavior: 'instant' });
    }
  }

  function handleKeyDown(event) {
    if (!multiple || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') scroll(-1);
    if (event.key === 'ArrowRight') scroll(1);
    if (event.key === 'Home') scroll('start');
    if (event.key === 'End') scroll('end');
  }

  const copies = multiple ? [0, 1, 2] : [1];
  return <section className="drawing-carousel" aria-label="My drawings" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {multiple && <p className="sr-only" id={helpId}>The drawings loop continuously. Scroll horizontally, use the previous and next buttons, or use Left and Right arrow keys. Home shows the first drawing; End shows the last.</p>}
    <div className="drawing-carousel-viewport">
      <ul className="drawing-track" id={trackId} ref={trackRef} role="list" aria-label="Drawing gallery" aria-describedby={multiple ? helpId : undefined} tabIndex={multiple ? 0 : undefined} onKeyDown={handleKeyDown} onScroll={normalizeScroll} onPointerDown={stopForInteraction} onWheel={stopForInteraction}>
        {copies.flatMap(copy => items.map((drawing, index) => <li className="drawing-slide" key={`${copy}-${drawing.id}`} ref={index === 0 ? copy === 0 ? leadingRef : copy === 1 ? originalRef : undefined : undefined} aria-hidden={copy !== 1 ? true : undefined} inert={copy !== 1 ? true : undefined}>
          <div className="drawing-image-frame">
            {failedSources.has(drawing.src) ? <div className="drawing-image-error"><p>This drawing isn’t available.</p>{copy === 1 && <a className="text-link" href={INSTAGRAM} target="_blank" rel="noreferrer">View drawings on Instagram<span className="sr-only"> (opens in a new tab)</span></a>}</div> : <img src={drawing.src} alt={copy === 1 ? drawing.alt : ''} width={drawing.width || 900} height={drawing.height || 900} loading="lazy" decoding="async" onError={() => setFailedSources(current => new Set([...current, drawing.src]))} />}
          </div>
        </li>))}
      </ul>
      {multiple && <>
        <button className="drawing-carousel-button drawing-arrow drawing-arrow-previous" type="button" aria-label="Previous drawings" aria-controls={trackId} onClick={() => scroll(-1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
        <button className="drawing-carousel-button drawing-arrow drawing-arrow-next" type="button" aria-label="Next drawings" aria-controls={trackId} onClick={() => scroll(1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
      </>}
    </div>
  </section>;
}
