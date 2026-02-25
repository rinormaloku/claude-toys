# Claude Toys

This workspace hosts a small React-based viewer for "toys" located in the `toys/` directory. Each toy is a self-contained `.jsx` component that renders some visualization or interactive demo.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```
   If you're adding new packages (e.g. for a toy) install them here.

2. **Enable Tailwind CSS** (already configured)
   Tailwind is set up via `tailwind.config.js` and `postcss.config.js`. The
   global stylesheet (`src/index.css`) includes the required `@tailwind`
   directives. Feel free to use utility classes throughout the app or your toys.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will open in your browser at `http://localhost:5173` by default.

3. **Add new toys**
   - Drop a `.jsx` file into the `toys/` folder (keeping React imports as needed).
   - The sidebar menu is automatically populated from the filenames.
   - If your toy needs additional npm packages, install them and add to `package.json`.

## Project structure

```
.
├── package.json          # project config and deps
├── vite.config.js        # Vite build configuration
├── index.html            # entry HTML
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # sidebar + toy loader
│   ├── index.css         # global styles
└── toys/
    └── rrf.jsx           # example toy
```

Feel free to expand the framework with routing, theming, or additional utilities as needed.