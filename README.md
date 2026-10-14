# Site Ledger

Site Ledger is a static marketing and demo site for a construction material and site management system. The site includes a landing page, a browser-based demo, a database overview and local documentation. It is designed for GitHub Pages and can be published without a build step.

## Publish to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository in GitHub.
3. Go to Settings > Pages.
4. In the Build and deployment section, choose Source.
5. Select Deploy from branch.
6. Choose main as the branch.
7. Set the folder to / (root).
8. Save.
9. GitHub Pages will publish the site and give you a live URL.

## Files included

- `index.html`
- `demo.html`
- `database.html`
- `docs.html`
- `css/styles.css`
- `js/app.js`
- `js/data.js`
- `js/demo.js`
- `.nojekyll`

## Notes

- The site uses relative links only so it works from a repository sub-path.
- The browser demo stores its state in localStorage.
- The database page references the ER diagram file at `docs/er-diagram.png`.

## Local preview

You can preview the site locally with any static file server, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.
