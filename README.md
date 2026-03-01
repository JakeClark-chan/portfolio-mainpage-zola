# portfolio-mainpage-zola

Personal portfolio homepage for [JakeClark (Nguyễn Chí Thành)](https://thanhnc.id.vn), built with [Zola](https://www.getzola.org/) and the [tabi](https://github.com/welpo/tabi) theme. Deployed on Cloudflare Workers.

## ✨ Features

- **Bilingual** — Vietnamese (default) + English (`/en/*`)
- **Dark/Light theme switcher** with mint skin
- **Build-time image optimization** — images are automatically converted to AVIF + WebP + JPEG using Zola's built-in `resize_image`, no external tools needed
- **Cloudflare Workers** deployment with branch-aware URLs (prod vs. preview)

## 📁 Project Structure

```
portfolio-mainpage-zola/
├── content/                    # All page content (Markdown)
│   ├── _index.md               # Homepage — Vietnamese
│   ├── _index.en.md            # Homepage — English
│   ├── faq/                    # FAQ section
│   │   ├── index.md
│   │   └── index.en.md
│   ├── projects/               # Projects section
│   │   ├── index.md
│   │   └── index.en.md
│   ├── DSC_073.jpg             # Co-located page image
│   └── jakeclark-with-duy-luan-720p.jpg
├── templates/
│   └── shortcodes/
│       └── optimized_img.html  # Custom shortcode: outputs <picture> with AVIF/WebP/JPEG
├── themes/tabi/                # tabi theme (git submodule)
├── static/                     # Static files served as-is (empty by default)
├── sass/                       # Custom SCSS overrides
├── zola.toml                   # Zola site config
├── wrangler.toml               # Cloudflare Workers config
└── build.sh                    # CI build script
```

## ✍️ How Content Works

This site uses **Zola** — a static site generator. Content is written in Markdown with a TOML front matter block delimited by `+++`.

### Front Matter Example

```toml
+++
title = "Page Title"
description = "A short description for SEO."
# Optional: template, date, taxonomies.tags, extra.toc, etc.
+++

Your Markdown content here.
```

### Bilingual Pages

Every page has two files:
- `index.md` → Vietnamese (default language)
- `index.en.md` → English version at `/en/<section>/`

### Adding / Editing Images

Images co-located next to `_index.md` (in `content/`) are processed automatically. Use the custom shortcode instead of standard Markdown image syntax to get next-gen formats:

```
{{ optimized_img(src="your-image.jpg", alt="Description of the image") }}
```

This generates a `<picture>` element with AVIF, WebP, and JPEG fallback at 800px width. Standard `![alt](img.jpg)` syntax still works but skips optimization.

### Adding a New Section

1. Create a new directory under `content/`, e.g., `content/blog/`
2. Add a `_index.md` (and optionally `_index.en.md`) with front matter
3. Add it to the `menu` and `footer_menu` arrays in `zola.toml`

```toml
menu = [
    { name = "blog", url = "blog" },
    ...
]
```

### Adding a Page Inside a Section

Create a Markdown file inside the section folder. For simple pages:

```
content/blog/my-post.md       # standalone file
```

For pages with co-located assets (images, etc.), use a **page bundle**:

```
content/blog/my-post/
  index.md
  hero-image.jpg
```

Reference assets with just the filename: `{{ optimized_img(src="hero-image.jpg", alt="...") }}`

---

## 🚀 Deployment

### Prerequisites

- A [Cloudflare](https://cloudflare.com) account with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed (`npm install -g wrangler`)
- Git with submodule support

### Cloudflare Workers (Current Setup)

The project ships a `build.sh` that downloads Zola itself, so **no local Zola install is needed on the build machine**.

**1. Connect the repo**

Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Connect to Git. Select this repository.

**2. Set the build command**

| Field | Value |
|---|---|
| Build command | `chmod +x build.sh && ./build.sh` |
| Deploy directory | `public` |

This is already configured via `wrangler.toml`. On `main`/`master` branch it builds to `https://thanhnc.id.vn`; all other branches build to a preview URL.

**3. Deploy manually (optional)**

```bash
wrangler deploy
```

### Netlify

A `netlify.toml` is not present in this repo, but setup is straightforward:

1. Connect the repo in [Netlify](https://app.netlify.com)
2. Set build settings:

| Field | Value |
|---|---|
| Build command | `curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz \| tar xz && ./zola build` |
| Publish directory | `public` |

Or create a `netlify.toml` at the root:

```toml
[build]
command = """
curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz | tar xz && ./zola build --base-url $DEPLOY_PRIME_URL
"""
publish = "public"

[context.production]
command = """
curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz | tar xz && ./zola build
"""
```

### GitHub Pages

1. In your GitHub repo, go to **Settings → Pages** and set the source to **GitHub Actions**.
2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Download Zola
        run: |
          curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz | tar xz
      - name: Build
        run: ./zola build --base-url "https://<your-username>.github.io/<repo-name>/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public
      - id: deployment
        uses: actions/deploy-pages@v4
```

> [!NOTE]
> Replace `<your-username>` and `<repo-name>` with your GitHub username and repository name. Update the `base_url` in `zola.toml` accordingly.

---

## 🛠️ Local Development

```bash
# 1. Clone with submodules (tabi theme)
git clone --recurse-submodules https://github.com/JakeClark-chan/portfolio-mainpage-zola

# 2. Install Zola
# See: https://www.getzola.org/documentation/getting-started/installation/

# 3. Serve locally with hot-reload
zola serve
```

Site will be available at `http://127.0.0.1:1111`.

---

## 🔧 Configuration Reference

Key fields in `zola.toml`:

| Key | Purpose |
|---|---|
| `base_url` | Production URL (overridden by `build.sh` per branch) |
| `default_language` | `"vi"` — Vietnamese |
| `theme` | `"tabi"` |
| `[extra].skin` | Color skin — `"mint"` |
| `[extra].menu` | Top navigation links |
| `[extra].socials` | Social media icons in footer |
