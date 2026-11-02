# Alec Daveynis — Portfolio

An isometric 3D portfolio built with React, TypeScript, Vite, and React Three Fiber. The site is a static build for GitHub Pages at `/portfolio/`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173/portfolio/`.

```bash
npm run build
npm run preview
```

The production preview is served at `http://localhost:4173/portfolio/`.

## Deployment

GitHub Actions builds `dist/` and deploys it with GitHub Pages. In the repository settings, set Pages → Build and deployment → Source to **GitHub Actions**.

## Car model

The Audi R8 in the scene is an original low-poly stand-in (matte black coupe, sideblades, wide haunches). It is not an official Audi asset. To replace it, add a properly licensed GLB at `public/models/audi-r8.glb` and set `CAR_MODEL_URL` in `src/scene/carConfig.ts`.

## Legacy site

The previous static page is preserved in `legacy/`. Source images remain in `img/`. The live app uses the optimized copies in `public/img/`.
