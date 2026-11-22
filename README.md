# blog.maab.dev

Personal site of Hussan ul Maab — built with [Jekyll] and the [Hydejack] theme,
deployed to GitHub Pages by the workflow in `.github/workflows/pages.yml`.

## Editing

| What | Where |
|---|---|
| Name, tagline, nav menu, colours | `_config.yml` |
| Bio, photo, social links | `_data/authors.yml` |
| Intro page | `index.md` |
| Publications | `publications.md` |
| Talks | `talks.md` |
| CV page (drop the PDF at `assets/cv.pdf`) | `cv.md` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| Extra CSS | `_sass/my-style.scss` |

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>.

## Deploying

Push to `main`. In **Settings → Pages**, set **Source** to **GitHub Actions**
(not "Deploy from a branch") — the workflow handles the rest. The `CNAME` file
keeps the custom domain `blog.maab.dev` pointed at the site.

[jekyll]: https://jekyllrb.com
[hydejack]: https://hydejack.com
