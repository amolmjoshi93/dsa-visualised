# DSA Visualised

Data structures, searching and sorting — explained with everyday pictures and live, interactive visualisations. Plain HTML, CSS and JavaScript: no build step, no dependencies.

## Pages

| Section | Pages |
|---|---|
| Start | `index.html`, `why-it-matters.html` |
| Data structures | `arrays`, `linked-lists`, `stacks`, `queues`, `hash-tables`, `trees`, `graphs` |
| Searching | `linear-search`, `binary-search` |
| Sorting | `bubble-sort`, `selection-sort`, `insertion-sort`, `merge-sort`, `quick-sort` |

Shared files: `style.css` (look and feel) and `app.js` (navigation, sorting and searching visualisers).

## Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `dsa-visualised`).
2. Put all the files from this folder in the repository root (the `.html` files must sit next to `style.css` and `app.js`).
3. Commit and push to the `main` branch.
4. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, choose branch `main` and folder `/ (root)`, then Save.
5. After a minute your site is live at `https://<your-username>.github.io/dsa-visualised/`.

## Run locally

Just open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Add a new page

1. Copy any existing page (e.g. `bubble-sort.html`) and edit the content.
2. Add one line for it to the `PAGES` list at the top of `app.js`. It then appears on the home page and in the previous/next links automatically.
3. To add another sorting algorithm, add a generator to `SortAlgos` in `app.js` that `yield`s `cmp(...)`, `swp(...)` and `{t:'done'|'all'}` events, then use `<div data-algo="yourname"></div>` on the page.
