<!-- Copilot instructions for contributors and AI coding agents -->
# Project-focused Copilot Instructions

Purpose: Help AI agents be immediately productive in this repository by documenting the architecture, workflows, conventions, and concrete file examples.

Repository layout (key paths)
- `Frontend/` — Vite + React app (ES modules). Entry: `Frontend/src/main.jsx`, UI root: `Frontend/src/App.jsx`.
- `Frontend/package.json` — dev scripts: `dev`, `build`, `lint`, `preview`.
- `Frontend/vite.config.js` — uses `@vitejs/plugin-react` and configures `babel-plugin-react-compiler`.
- `Frontend/eslint.config.js` — project ESLint config (flat config, `no-unused-vars` tweak).
- `Backend/` — minimal Express-based backend; `Backend/package.json` lists `express` but no start script (look for `index.js`).

Big picture / architecture
- Frontend is a Vite-powered single-page React app using ES modules and React Fast Refresh. The dev server is run from `Frontend` with `npm run dev`.
- Vite's React plugin is configured to run a React compiler Babel plugin (`babel-plugin-react-compiler`) — changes to build or dev behavior are controlled in `Frontend/vite.config.js`.
- Backend is a small Express service (CommonJS indicated in `Backend/package.json`). There is no explicit `start` script in package.json; expect an `index.js` entry point or create one when implementing server behavior.

Key developer workflows (concrete commands)
- Frontend dev: `cd Frontend; npm install; npm run dev` — open the Vite dev server.
- Frontend build: `cd Frontend; npm run build` then `npm run preview` to locally preview the production build.
- Lint: `cd Frontend; npm run lint` (ESLint configured in `Frontend/eslint.config.js`).
- Backend: package lists `express`; if an entry file exists run `cd Backend; npm install; node index.js` (no `start` script present).

Project-specific conventions and patterns
- ES module usage: `Frontend/package.json` sets `type: "module"`. Use `import`/`export` in frontend files.
- Asset imports: images and assets are imported directly from `src` (e.g., `import reactLogo from './assets/react.svg'`) and the root `vite.svg` is referenced with an absolute `/vite.svg` path — respect Vite's static asset handling.
- React StrictMode: app root uses `StrictMode` in `Frontend/src/main.jsx` — preserve this pattern for new components.
- ESLint: config is flat and intentionally ignores `dist`. Rule: `no-unused-vars` ignores names matching `^[A-Z_]` (useful for exported types/consts).
- React compiler plugin: the project explicitly enables `babel-plugin-react-compiler` in `vite.config.js` — avoid removing it when editing build config unless intentionally changing compilation strategy.

Integration points & external dependencies
- Frontend depends on `react`, `react-dom`, `vite`, `@vitejs/plugin-react` and a Babel plugin for the React compiler.
- Backend depends on `express`. There is no automated script tying frontend and backend together — local integration requires running both servers separately.

How to make safe changes (agent guidance)
- When editing the frontend, prefer editing files under `Frontend/src/`. Validate changes by running `npm run dev` from `Frontend` and checking HMR behavior.
- If adding new npm dependencies to the frontend, update `Frontend/package.json` and run `npm install` in the `Frontend` folder. Keep `type: "module"` intact for ES module semantics.
- For build or plugin changes, update `Frontend/vite.config.js` and run a production build `npm run build` to verify.
- For backend work, check for an existing `Backend/index.js`. If absent, confirm with maintainers before adding a new entrypoint or `start` script.

Files to inspect for context before coding
- `Frontend/package.json`, `Frontend/vite.config.js`, `Frontend/src/main.jsx`, `Frontend/src/App.jsx`, `Frontend/eslint.config.js`, `Backend/package.json`.

Notes & gotchas discovered
- There is no `start` script in `Backend/package.json`; backend may not be runnable without adding an entrypoint or script.
- The project uses a React compiler plugin that can affect dev/build output; test builds after changing Babel or Vite plugin settings.

If anything here is incorrect or you expect additional details (CI, deployment, or missing server files), ask the repository owner to provide the missing files or preferred commands.

-- End of copilot-instructions
