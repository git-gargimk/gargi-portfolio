import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { DrawingCarousel } from '../DrawingCarousel';

const items = [
  { id: 'one', src: '/test-one.jpg', title: 'First drawing', alt: 'First test drawing' },
  { id: 'two', src: '/test-two.jpg', title: 'Second drawing', alt: 'Second test drawing' },
  { id: 'three', src: '/test-three.jpg', title: 'Third drawing', alt: 'Third test drawing' },
];

let frames;
beforeEach(() => {
  frames = new Map();
  let id = 0;
  vi.stubGlobal('requestAnimationFrame', callback => { frames.set(++id, callback); return id; });
  vi.stubGlobal('cancelAnimationFrame', id => frames.delete(id));
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

function advanceFrame(time) {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach(callback => callback(time)));
}

function setScrollableLayout() {
  const track = screen.getByRole('list', { name: 'Drawing gallery' });
  Object.defineProperties(track, {
    clientWidth: { configurable: true, value: 600 },
    scrollWidth: { configurable: true, value: 2700 },
    scrollTo: { configurable: true, value: vi.fn(({ left }) => {
      track.scrollLeft = left;
      fireEvent.scroll(track);
    }) },
  });
  Object.defineProperty(track.children[0], 'offsetLeft', { configurable: true, value: 0 });
  Object.defineProperty(track.children[items.length], 'offsetLeft', { configurable: true, value: 900 });
  fireEvent(window, new Event('resize'));
  return track;
}

function finishMovement() {
  advanceFrame(0);
  advanceFrame(400);
}

describe('drawing carousel', () => {
  it('shows no gallery before artwork is supplied', () => {
    const { container } = render(<DrawingCarousel items={[]} />);
    expect(container.childElementCount).toBe(0);
  });

  it('shows one drawing without unnecessary navigation controls', () => {
    render(<DrawingCarousel items={items.slice(0, 1)} />);
    expect(screen.getByRole('img', { name: items[0].alt }).getAttribute('src')).toBe(items[0].src);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps every drawing in a continuous strip and scrolls with the buttons', async () => {
    const user = userEvent.setup();
    render(<DrawingCarousel items={items} />);
    const track = setScrollableLayout();
    expect(screen.getAllByRole('img')).toHaveLength(items.length);
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length);
    expect(screen.queryByText('First drawing')).toBeNull();
    expect(screen.queryByText(/Scroll to explore/)).toBeNull();
    const next = screen.getByRole('button', { name: 'Next drawings' });
    const previous = screen.getByRole('button', { name: 'Previous drawings' });
    expect(previous.disabled).toBe(false);
    await user.click(next);
    finishMovement();
    expect(track.scrollLeft).toBe(1380);
    expect(previous.disabled).toBe(false);
    expect(document.activeElement).toBe(next);
    await user.click(previous);
    finishMovement();
    expect(track.scrollLeft).toBe(900);
    await user.click(previous);
    finishMovement();
    expect(track.scrollLeft).toBe(1320);
    await user.click(next);
    finishMovement();
    expect(track.scrollLeft).toBe(900);
  });

  it('supports circular keyboard scrolling and retains gallery focus', async () => {
    const user = userEvent.setup();
    render(<DrawingCarousel items={items} />);
    const track = setScrollableLayout();
    track.focus();
    await user.keyboard('{ArrowRight}');
    finishMovement();
    expect(track.scrollLeft).toBe(1380);
    await user.keyboard('{End}');
    finishMovement();
    expect(track.scrollLeft).toBe(1500);
    expect(screen.getByRole('button', { name: 'Next drawings' }).disabled).toBe(false);
    await user.keyboard('{ArrowRight}');
    finishMovement();
    expect(track.scrollLeft).toBe(1080);
    await user.keyboard('{Home}');
    finishMovement();
    expect(track.scrollLeft).toBe(900);
    await user.keyboard('{ArrowLeft}');
    finishMovement();
    expect(track.scrollLeft).toBe(1320);
    expect(document.activeElement).toBe(track);
  });

  it('offers a fallback for a failed image while keeping the other drawings visible', () => {
    render(<DrawingCarousel items={items} />);
    fireEvent.error(screen.getByRole('img', { name: items[0].alt }));
    expect(screen.getByRole('link', { name: /View drawings on Instagram/ }).getAttribute('href')).toBe('https://www.instagram.com/chhand.reghancha/');
    expect(screen.getAllByText('This drawing isn’t available.')).toHaveLength(3);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByRole('img', { name: items[1].alt })).toBeTruthy();
  });

  it('loops forward automatically across the seam and normalizes native scrolling', () => {
    const { unmount } = render(<DrawingCarousel items={items} />);
    const track = setScrollableLayout();
    advanceFrame(0);
    advanceFrame(32);
    expect(track.scrollLeft).toBeCloseTo(901.12);
    track.scrollLeft = 1799.9;
    advanceFrame(64);
    expect(track.scrollLeft).toBeCloseTo(901.02);
    advanceFrame(96);
    expect(track.scrollLeft).toBeCloseTo(902.14);
    track.scrollLeft = 899;
    fireEvent.scroll(track);
    expect(track.scrollLeft).toBe(1799);
    unmount();
    expect(frames.size).toBe(0);
  });

  it('has only arrow controls and pauses for hover, focus, and manual interaction', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(<DrawingCarousel items={items} />);
    const track = setScrollableLayout();
    const region = screen.getByRole('region', { name: 'My drawings' });
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /automatic scrolling/ })).toBeNull();
    fireEvent.mouseEnter(region);
    expect(frames.size).toBe(0);
    fireEvent.mouseLeave(region);
    expect(frames.size).toBe(1);
    fireEvent.focus(track);
    expect(frames.size).toBe(0);
    fireEvent.blur(track);
    expect(frames.size).toBe(1);
    fireEvent.pointerDown(track);
    expect(frames.size).toBe(0);
    act(() => vi.advanceTimersByTime(5000));
    expect(frames.size).toBe(1);
  });

  it('disables automatic motion for a reduced-motion preference', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    render(<DrawingCarousel items={items} />);
    setScrollableLayout();
    expect(frames.size).toBe(0);
    expect(screen.queryByRole('button', { name: /automatic scrolling/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Next drawings' }).disabled).toBe(false);
  });

  it('has no axe-detected structural violations', async () => {
    render(<main><h1>Drawing gallery</h1><DrawingCarousel items={items} /></main>);
    const result = await axe.run(document.body, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations.map(({ id }) => id)).toEqual([]);
  });
});
