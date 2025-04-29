# How to modify content

All glossary terms are written in Markdown, which allows for rich formatting including:

- Headings
- Lists
- Bold and italic text
- Links
- Code blocks
- Images

This makes it easy to create structured and well-formatted glossary entries.

## Creating New Glossary Terms

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