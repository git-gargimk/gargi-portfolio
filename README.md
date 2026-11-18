# Gargi Kulkarni — Portfolio

A responsive React portfolio with four hash-linked tabs, keyboard navigation, filterable projects with direct GitHub links, and social profile links. Built with Vite and React.

## Develop

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The production output is `dist/`. Portfolio content is in `src/main.jsx` and `src/data/`. Design tokens, responsive layouts, and illustrations are in `src/styles.css`; keyboard, focus, reflow, and preference styles are in `src/accessibility.css`.

## GitHub Pages

The deployment workflow is `.github/workflows/deploy-pages.yml`. It installs dependencies, runs tests, builds the site, and deploys `dist/` whenever `main` is pushed. The build reads GitHub Pages' base path so JavaScript, styles, the profile photo, and drawings work at a repository URL or a custom domain.

For the first deployment, open the GitHub repository’s **Settings → Pages**, then select **GitHub Actions** under **Build and deployment → Source**. Push to `main` or run **Deploy portfolio to GitHub Pages** from the **Actions** tab. The deployment’s published URL appears in its run summary.

GitHub Pages serves the generated static files; a running Node.js server is not needed. Local preview still uses `npm run dev` or `npm run preview`. See the official [Vite GitHub Pages guide](https://vite.dev/guide/static-deploy#github-pages) and [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Content is based on the LinkedIn profile at https://www.linkedin.com/in/gargimk/ and details provided by Gargi. The project illustrations are original visual interpretations, not product screenshots.

Projects are grouped into **Curiosity to Code** (personal and side projects, starting with this portfolio), followed by **Classroom to Code** (six university projects). Both sections remain expanded and share the technology filters. Their project data and section descriptions are in `src/main.jsx`.

University projects use compact topic graphics and a responsive card grid: three columns on desktop, two on tablets, and one on mobile. The graphics represent each project's subject rather than an application interface.

Five projects link directly to verified repositories or project folders under `github.com/gargimk`. The EC2 deployment and current React portfolio have no project link until their repository URLs are supplied. Add a `repositoryUrl` to their project data when available. Project links open in a new tab; project modals have been removed.

## Accessibility checks

```sh
npm test
```

Tests cover keyboard navigation, skip navigation, tab/panel relationships, content navigation focus, filtering announcements, project repository links, drawing gallery interactions, axe structural checks on every tab, and WCAG contrast calculations for the palette.

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the design target, keyboard instructions, verification scope, and remaining manual checks.

## Design direction

The layout takes inspiration from [Aparna Designs](https://www.aparnadesigns.com/): a white canvas, bold sans-serif headings, a personal introduction, and large project previews paired with editorial summaries. Content, preview illustrations, and the React tab navigation belong to this portfolio.

## About page profile photo

The introduction and section summaries are in `src/main.jsx`. The supplied portrait is stored in `public/images/gargi-kulkarni.jpeg`; `src/data/profile.js` resolves its path using Vite’s base URL for GitHub Pages compatibility. The image has descriptive alternative text, a responsive crop, and an initials fallback if loading fails.

## Drawing carousel

The About page’s “Outside of work” section features six drawings supplied by Gargi: a sunflower, two mandala compositions, a puppy, an owl, and a bird on a branch. The original images are stored in `public/images/drawings/`; titles, descriptive alternative text, and dimensions are in `src/data/drawings.js`. Add more supplied drawing files and entries using this structure:

```js
export const drawings = [
  {
    id: 'drawing-1',
    src: `${import.meta.env.BASE_URL}images/drawings/drawing-1.jpg`,
    title: 'Title of the drawing',
    alt: 'Describe the actual subjects and details in the drawing.',
    width: 1200,
    height: 900,
  },
];
```

Use the image’s actual dimensions. Drawings appear together without visible titles in a continuous horizontal strip beneath the description, without cropping. The strip loops forward seamlessly, and subtle circular arrows over the images wrap in either direction. Visual copies create the loop and are hidden from assistive technology and keyboard focus. Hovering or focusing the gallery temporarily stops autoplay; manual interaction pauses it for five seconds. Reduced-motion preferences disable autoplay and make manual navigation instant. Visitors can also scroll, swipe, or press Left/Right and Home/End while the gallery is focused. Failed images offer a link to Instagram.
