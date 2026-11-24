# Crownvetch

A hybrid visual novel and text quest web application built with React, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

## Build & Verification

```bash
npm run build
npm run lint
```

## Deployment

### Vercel
The project includes a `vercel.json` configuration and defaults to root path `/` for local development and Vercel builds.

### GitHub Pages
- The project supports GitHub Pages under `/crownvetch/` when `GITHUB_PAGES=true` is passed during build (`vite.config.ts` keeps `/` by default for local runs and Vercel).
- `BrowserRouter` uses `import.meta.env.BASE_URL` as `basename`, and static images from `public/` are resolved through `resolveAssetUrl` so both links and images work under `/crownvetch/` and `/`.
- `public/404.html` and `index.html` restore SPA routes along with query strings and `#hash` anchors on direct load or page reload.
- Automated deployment is configured in `.github/workflows/deploy-pages.yml` (runs `npm install` and `GITHUB_PAGES=true npm run build` on push to `main` or manual `workflow_dispatch`).
- In the repository settings on GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
