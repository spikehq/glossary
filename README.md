# Spike.sh Glossary with 11ty and Sass

A glossary website built with 11ty (Eleventy), Handlebars templating, Sass for styling, and Markdown for content.

## Features

- Responsive design
- Sass-based modular CSS architecture
- Markdown support for term definitions
- Alphabetical filtering of glossary terms
- Featured terms highlighting on the home page
- Related terms recommendations
- Easy to add new terms through markdown files

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server with Sass compilation:

```bash
npm run dev
```

For the best development experience with automatic Sass compilation when files change:

```bash
npm run dev:watch
```

Or you can run Sass compilation and the development server separately:

```bash
npm run sass        # Compile Sass to CSS once
npm run sass:watch  # Watch Sass files for changes and compile automatically
npm start           # Start the 11ty development server
```

The site will be available at [http://localhost:8080](http://localhost:8080).

### Build for Production

Build the site for production:

```bash
npm run sass && npm run build
```

The built site will be in the `_site` directory.

## Project Structure

```
.
├── src/                    # Source files
│   ├── _includes/          # Templates and partials
│   │   └── layouts/        # Layout templates
│   ├── assets/             # Static assets
│   │   ├── css/            # Compiled CSS (don't edit directly)
│   │   ├── js/             # JavaScript files
│   │   ├── images/         # Image assets
│   │   └── scss/           # Sass source files
│   │       ├── base/       # Base styles, variables, reset
│   │       ├── components/ # Component-specific styles
│   │       └── layout/     # Layout styles
│   ├── data/               # Global data files
│   ├── glossary/           # Glossary term markdown files
│   ├── index.hbs           # Home page
│   └── glossary.hbs        # Glossary list page
├── .eleventy.js            # Eleventy configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Creating Glossary Terms

To add a new term to the glossary, create a new markdown file in the `src/glossary/` directory. Use the following template:

```markdown
---
title: Term Name
layout: layouts/glossary-item.hbs
excerpt: A short description of the term.
featured: true|false
related:
  - title: Related Term 1
    slug: related-term-1
  - title: Related Term 2
    slug: related-term-2
---

# Term Name

Detailed explanation of the term...

## Subheading

More content...
```

### Front Matter Explanation:

- `title`: The name of the term
- `layout`: Always use `layouts/glossary-item.hbs`
- `excerpt`: A short description that appears in term listings
- `featured`: Set to `true` to display on the home page
- `related`: List of related terms with their titles and slugs

## Customization

- **Styling**: Edit the Sass files in `src/assets/scss/` directory:
  - `base/_variables.scss`: Color variables, breakpoints, etc.
  - `components/`: Component-specific styles
  - `layout/`: Layout styles
- **Layouts**: Modify templates in `src/_includes/layouts/`
- **Global Data**: Update site-wide data in `src/data/site.js`
- **Configuration**: Adjust settings in `.eleventy.js`

## Alphabetical Filtering

The glossary page includes alphabetical filtering that allows users to filter terms by their first letter. This is implemented with JavaScript in `src/assets/js/glossary.js`.

## Responsive Design

The site is fully responsive and works well on mobile, tablet, and desktop devices.

## Markdown Support

All glossary terms are written in Markdown, which allows for rich formatting including:

- Headings
- Lists
- Bold and italic text
- Links
- Code blocks
- Images

This makes it easy to create structured and well-formatted glossary entries.
