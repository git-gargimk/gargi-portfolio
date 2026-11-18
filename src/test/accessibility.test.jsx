import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { App } from '../main';

describe('keyboard and assistive technology workflows', () => {
  it.each(['About', 'Experience', 'Projects', 'Contact'])('returns to the top of %s and restores focus to its selected tab', async (tab) => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', `#${tab.toLowerCase()}`);
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();
    window.scrollY = 600;
    fireEvent.scroll(window);
    await user.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' });
    const selected = screen.getByRole('tab', { name: tab });
    expect(document.activeElement).toBe(selected);
    expect(selected.getAttribute('aria-selected')).toBe('true');
    expect(window.location.hash).toBe(`#${tab.toLowerCase()}`);
    window.scrollY = 0;
    fireEvent.scroll(window);
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();
  });

  it('returns to the top without animation when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    try {
      const user = userEvent.setup();
      window.history.replaceState(null, '', '#experience');
      render(<App />);
      window.scrollY = 600;
      fireEvent.scroll(window);
      const button = screen.getByRole('button', { name: 'Back to top' });
      button.focus();
      await user.keyboard('{Enter}');
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Experience' }));
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('offers a first-tab skip link that focuses the main landmark without changing sections', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Skip to main content' }));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(screen.getByRole('tab', { name: 'About' }).getAttribute('aria-selected')).toBe('true');
  });

  it('connects all tabs to panels and supports arrow, Home, and End navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const tab of screen.getAllByRole('tab')) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    screen.getByRole('tab', { name: 'About' }).focus();
    await user.keyboard('{ArrowRight}');
    const experience = screen.getByRole('tab', { name: 'Experience' });
    expect(document.activeElement).toBe(experience);
    expect(experience.getAttribute('aria-selected')).toBe('true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(document.title).toBe('Experience — Gargi Kulkarni');
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Contact' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'About' }));
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'About' }).tabIndex).toBe(0);
    expect(screen.getByRole('tab', { name: 'Contact' }).tabIndex).toBe(-1);
  });

  it('moves focus to the destination panel when a content button changes sections', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'View projects' }));
    expect(document.activeElement).toBe(screen.getByRole('tabpanel', { name: 'Projects' }));
    expect(window.location.hash).toBe('#projects');
  });

  it.each([
    ['View experience', 'Professional Experience'],
    ['View education', 'Education'],
    ['View certifications', 'Certifications'],
  ])('moves %s from the About summary directly to its detailed heading', async (button, heading) => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: button }));
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: heading, level: 2 }));
    expect(screen.getByRole('tab', { name: 'Experience' }).getAttribute('aria-selected')).toBe('true');
  });

  it('groups university and personal projects and filters both sections together', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '#projects');
    render(<App />);
    const university = screen.getByRole('region', { name: 'Classroom to Code' });
    const lab = screen.getByRole('region', { name: 'Curiosity to Code' });
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual(['Curiosity to Code', 'Classroom to Code']);
    expect(within(university).getAllByRole('article')).toHaveLength(6);
    expect(within(lab).getAllByRole('article')).toHaveLength(1);
    expect(within(lab).getByRole('heading', { name: 'My personal portfolio', level: 3 })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('7 projects');
    await user.click(screen.getByRole('button', { name: 'Web development' }));
    expect(within(university).getAllByRole('article')).toHaveLength(3);
    expect(within(lab).getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('status').textContent).toBe('4 projects');
    await user.click(screen.getByRole('button', { name: 'Machine learning' }));
    expect(within(university).getAllByRole('article')).toHaveLength(2);
    expect(within(lab).queryByRole('article')).toBeNull();
    expect(within(lab).getByText('No projects in this section match the selected filter.')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'All projects' }));
    expect(screen.getAllByRole('article')).toHaveLength(7);
  });

  it('exposes project headings, announces filtering, and links to the source repositories', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '#projects');
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Machine learning' }));
    expect(screen.getByRole('status').textContent).toBe('2 projects');
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Reading between the reviews' })).toBeTruthy();
    const link = screen.getByRole('link', { name: 'View project code on GitHub: Reading between the reviews (opens in a new tab)' });
    expect(link.getAttribute('href')).toBe('https://github.com/gargimk/CPSC531Project');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.hasAttribute('aria-haspopup')).toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each(['about', 'experience', 'projects', 'contact'])('has no axe-detected WCAG A/AA structure violations on %s', async (tab) => {
    window.history.replaceState(null, '', `#${tab}`);
    render(<App />);
    const result = await axe.run(document.body, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      // jsdom has no layout engine. Color contrast is checked from actual
      // palette tokens in contrast.test.js and visually in browser QA.
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(node => node.target) }))).toEqual([]);
  });

  it('uses verified repository links and leaves the two unmatched projects without actions', () => {
    window.history.replaceState(null, '', '#projects');
    render(<App />);
    const expected = [
      ['Planning Poker', 'https://github.com/gargimk/planningpoker'],
      ['Reading between the reviews', 'https://github.com/gargimk/CPSC531Project'],
      ['A place for conversation', 'https://github.com/gargimk/ReactJS/tree/master/CommentApp'],
      ['Making sense of house prices', 'https://github.com/gargimk/Housing-Prices-prediction'],
      ['RateThyProf', 'https://github.com/gargimk/cpsc-473/tree/master/gradProj'],
    ];
    for (const [title, url] of expected) {
      expect(screen.getByRole('link', { name: `View project code on GitHub: ${title} (opens in a new tab)` }).getAttribute('href')).toBe(url);
    }
    expect(screen.getAllByRole('link', { name: /^View project code on GitHub:/ })).toHaveLength(5);
    for (const title of ['From code to cloud', 'My personal portfolio']) {
      const article = screen.getByRole('heading', { name: title }).closest('article');
      expect(within(article).queryByRole('link')).toBeNull();
      expect(within(article).queryByRole('button')).toBeNull();
    }
    expect(screen.queryByRole('button', { name: /^View project code on GitHub:/ })).toBeNull();
  });
});
