# Accessibility

The implementation follows [W3C's accessibility mission](https://www.w3.org/mission/accessibility/) and uses [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) as its design target. Automated checks do not establish complete WCAG conformance.

## Navigation and interaction

- The first keyboard stop is **Skip to main content**.
- The navigation follows the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Left/Right arrows move between tabs, wrapping at either end. Home/End go to the first/last tab. Tab leaves the tab list. All four tabs have persistent associated panels; inactive panels are hidden.
- Content buttons that change tabs move focus to the destination panel. About summary links for experience, education, and certifications move focus directly to the corresponding detailed heading. Direct hash URLs and browser history preserve section navigation.
- Project names are headings. Projects with verified repository URLs have explicitly labelled “View project” links that open GitHub in a new tab and announce that behavior. Projects without a repository URL have no link or placeholder action.
- Filter buttons expose their pressed state; project counts are announced through a status region.
- All drawings remain in a labelled horizontal list below their description, with descriptive alternative text and no visible titles. The strip loops continuously with circular previous/next buttons over the images. Visual duplicates are hidden from assistive technology and are inert. Hover and keyboard focus temporarily stop autoplay; manual interaction pauses it for five seconds. Reduced-motion preferences disable autoplay and manual animation. Visitors can also scroll or swipe, or press Left/Right and Home/End while the list is focused. Both arrow buttons wrap continuously, and scrolling retains focus. Images display without cropping.
- External links announce that they open a new tab. Decorative illustrations and symbols are excluded from the accessibility tree.

## Presentation

- Project previews share the portfolio’s navy, white, and soft neutral palette. Tested normal-text pairs meet 4.5:1; tested focus and control borders meet 3:1.
- Active tabs have an underline and font-weight change. Selected project filters use a stronger font weight, navy border, and soft background, so state is not conveyed only through color. Text links are underlined.
- Controls have at least a 44px height; icon-only controls have a 44px minimum width. Only the “View project” action is clickable; project descriptions and previews are static.
- The responsive layout includes a two-column tab grid below 400px and wrapping content. Font sizes use relative units.
- Focus indicators are visible, and reduced-motion and forced-colors preferences have dedicated styles.

## Verification

Run `npm test` for interaction tests, axe structural checks, and contrast checks. Run `npm run build` for production validation.

The DOM tests use jsdom, which has no visual layout engine; axe color-contrast checks are disabled there. Separate tests calculate contrast from the actual CSS palette tokens.

Live browser QA was unavailable because the Computer Use connection failed to start. Before a full conformance claim, manually verify keyboard navigation, 200% text resizing, reflow at 320 CSS pixels / 400% zoom, text-spacing overrides, forced colors, and a screen reader such as VoiceOver or NVDA. Check every tab, filtering, project links, and social links.
