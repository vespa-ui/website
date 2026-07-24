# Writing Documentation

How this docs site turns committed Markdown files into pages.

This documentation site renders plain Markdown files committed to the repository — there is no CMS and no build step to run by hand beyond the normal site build.

## Adding a page

1. Create a `.md` file under `website/src/content/docs/`.
2. Optionally add frontmatter at the top of the file:

```markdown
---
title: My Page Title
description: One sentence shown under the title.
order: 10
---

Your content starts here.
```

3. Commit it. The next build picks it up automatically and adds it to the sidebar — no route, nav entry, or index needs to be updated by hand.

## Organizing into sections

Put files in a subfolder to group them under a collapsible sidebar section:

```text
content/docs/
├── 01-getting-started/
│   ├── 01-introduction.md
│   └── 02-installation.md
└── 02-architecture/
    └── 01-overview.md
```

- The `NN-` numeric prefix on folders and files controls sort order and is stripped from the displayed title and the URL slug.
- A folder's display name is derived from its name (`getting-started` → "Getting Started"), unless overridden.
- Subfolders can be nested arbitrarily deep — each level becomes another collapsible group in the sidebar.
- Files placed directly in `content/docs/` (no subfolder) appear at the top of the sidebar, ungrouped.

## Supported Markdown

Standard Markdown plus GitHub-flavored extensions: tables, task lists, strikethrough, and fenced code blocks with syntax highlighting.
