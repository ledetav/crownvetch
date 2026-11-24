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
- `public/404.html` and `index.html` restore SPA routes along with query strings and `#hash` anchors on page reload.
- In the repository settings on GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
- Because the GitHub MCP endpoint returned `403 TOOL_AGENT_CONSENT_MISSING` when creating `.github/workflows/deploy-pages.yml` automatically, add `.github/workflows/deploy-pages.yml` with the workflow below to deploy `./dist` on push to `main` or manual `workflow_dispatch`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build for GitHub Pages
        env:
          GITHUB_PAGES: "true"
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
