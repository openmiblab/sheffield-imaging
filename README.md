# Staff directory

A static page that shows each member of staff as an ID-style badge. No build step, no dependencies.

```
index.html   page shell
style.css    badge design (light/dark mode, print layout)
script.js    reads staff.json, draws badges, search and group filter
staff.json   the data: edit this file to add or change people
photos/      optional portrait photos
```

## Add or edit a person

Edit `staff.json`. Each person can have:

| Field    | Example                        | Notes                              |
|----------|--------------------------------|------------------------------------|
| `name`   | `"Dr Alex Example"`            | required                           |
| `role`   | `"Postdoctoral researcher"`    |                                    |
| `group`  | `"Imaging"`                    | must match a key in `groups`       |
| `email`  | `"a.example@university.ac.uk"` |                                    |
| `web`    | `"https://example.org/alex"`   | full URL                           |
| `github` | `"alex-example"`               | username only                      |
| `orcid`  | `"0000-0002-1825-0097"`        | ID only                            |
| `photo`  | `"photos/alex-example.jpg"`    | square crop works best; initials are shown if missing |

Every field except `name` is optional; missing ones are simply left off the badge.

Groups and their colours are defined at the top of the file under `groups`. Keep the colours dark enough for white text to stay readable.

## Preview locally

Browsers block `fetch` on `file://` pages, so open it through a local server:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Publish on GitHub Pages

1. Create a repository and push these files to the `main` branch (at the repository root, or in `/docs`).
2. In the repository, go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)` (or `/docs`), and save.
4. After a minute the site is live at `https://<user-or-org>.github.io/<repo>/`.

## Notes

- **Email addresses on a public page** can be harvested by spammers. If that matters, drop the `email` field and link to a contact form, or list only a shared group address.
- **Photos and personal data:** get consent from staff before publishing photos and contact details.
- **Fonts** are loaded from Google Fonts. To avoid external requests, delete the three font `<link>` lines in `index.html`; the page falls back to system fonts.
- **Print:** use the browser's print function to get a clean sheet of badges (controls are hidden).
