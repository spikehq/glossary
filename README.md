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
│   ├──            # Glossary term markdown files
│   ├── index.hbs           # Home page
│   └── glossary.hbs        # Glossary list page
├── .eleventy.js            # Eleventy configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Creating Glossary Terms

To add a new term to the glossary, create a new markdown file in the `src/` directory. Use the following template:

```markdown
---
term: Term Name
excerpt: A short description of the term.
featured: true|false
featuredHeading: Optional heading to display when featured
related:
  - name: Name of related term
    slug: related-term-slug
---

## What Is [Term Name]

Detailed explanation of the term...

## Why Is [Term Name] Important

Why this term matters...

## Example Of [Term Name]

Real-world example...
```

### Front Matter Explanation:

- `term`: The name of the term as it should appear in headings and titles
- `excerpt`: A short description that appears in term listings
- `featured`: Set to `true` to display on the home page
- `featuredHeading`: Optional custom heading to display when the term is featured
- `related`: List of related term slugs (filenames without the `.md` extension)

### Detailed Documentation

For detailed guidelines on creating and formatting content, please refer to:

- [Glossary Content Guide](./docs/GLOSSARY_CONTENT_GUIDE.md) - Comprehensive guide for writing glossary entries, highlighting content, and connecting related terms
- [Template File](./docs/TEMPLATE.md) - Ready-to-use template for new glossary entries

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
