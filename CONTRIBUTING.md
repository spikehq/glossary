# Glossary Content Guide

This guide will help you get started on how to create and format glossary content, highlighting important information, and connecting related terms.

## Table of Contents
- [Creating a New Term](#creating-a-new-term)
- [Front Matter Structure](#front-matter-structure)
- [Content Structure](#content-structure)
- [Highlighting and Featuring Content](#highlighting-and-featuring-content)
  - [Featured Headings](#featured-headings)
- [Adding Related Terms](#adding-related-terms)
- [Best Practices](#best-practices)
- [Examples](#examples)
  - [Basic Term Example](#basic-term-example)
  - [Term Example](#term-example)
  - [Term with Related Content Example](#term-with-related-content-example)

## Creating a New Term

To add a new term to the glossary, create a new markdown file in the `src/` directory. 
The filename should be the lowercase, hyphenated version of the term (e.g., `incident-management.md`).

You can copy the template file [TEMPLATE.md](TEMPLATE.md) as a starting point.

**Markdown support**
All terms support:
- Headings
- Lists
- Emphasis
- Links
- Code blocks
- Images


## Front Matter Structure

The front matter (the section between `---` at the top of the file) contains metadata about your term:
```
- term: The name of the term as it should appear in headings and titles
- excerpt: A short description (50-60 words) that appears in term listings and search results
- featuredHeading (optional): A heading inside your content that should get the same accent the "… With Spike" section gets
- related (optional): List of slugs for related terms (these must match the filenames of other terms without the `.md` extension). Leave it out and the three terms that follow yours alphabetically are shown instead.
```
Example front matter:
```yaml
---
term: Incident Response
excerpt: A structured approach to addressing and managing the aftermath of a security breach or cyberattack.
related:
  - incident-management
  - alert-correlation
---
```

## Content Structure

Each term should follow a consistent structure with these sections:

1. **What Is [Term]**: Provide a comprehensive definition of the term
2. **Why Is [Term] Important**: Explain the significance and benefits
3. **Example Of [Term]**: Share a practical, real-world example

You can add additional sections if needed, but these three are required for consistency.

### END RESULT

```markdown
---
term: Term Name
excerpt: A short description of the term.
related:
  - related-term-slug
---

## What Is [Term Name]

Detailed explanation of the term...

## Why Is [Term Name] Important

Why this term matters...

## Example Of [Term Name]

Real-world example...
```

---

## Highlighting and Featuring Content

### Featured Headings

Any `##` heading in your content that mentions **Spike** is set apart automatically with an accent rule — that's how the "How To … With Spike" section is highlighted on every term page.

To give another heading the same treatment, name it in `featuredHeading`:

```yaml
---
term: Zero Trust Architecture
excerpt: ...
featuredHeading: Why Zero Trust Matters For On-Call
---
```

Separate multiple headings with commas. Keep each one concise (under 10 words) and focused on the term's significance in incident management.

## Adding Related Terms

The "related terms" feature creates connections between glossary entries, helping users discover relevant concepts and building a comprehensive knowledge network. When you connect terms, they appear in the "Further reading" section at the bottom of a term's page.

To add related terms to a glossary entry:

1. Open the term's markdown file (e.g., `incident-response.md`)
2. In the front matter, add the `related` property with a list of term slugs:

```yaml
---
term: Incident Response
related:
  - incident-management
  - alert-correlation
  - post-incident-review
---
```

The slugs must match the filenames of other terms (without the `.md` extension). For example, to reference `incident-management.md`, use `incident-management` as the slug.

When adding related terms:

1. **Keep the list focused** - Include 2-5 closely related terms, not every possible connection
2. **Check for bidirectional relationships** - If Term A relates to Term B, Term B should typically also relate to Term A
3. **Consider reader journeys** - What terms would a reader want to explore next after reading this entry?
4. **Include a mix of relationship types** - See the next section
5. **Verify that all slugs exist** - Only link to terms that have been created
6. **Update relationships when adding new terms** - When creating a new term, update related terms to reference it

## Examples

### Basic Term Example

```markdown
---
term: Alert
excerpt: An Alert is a notification triggered when a monitored system, application, or service exceeds predefined thresholds or exhibits abnormal behavior.
---
# EXAMPLE CONTENT
Lorem ipsum...
```

### Term with Related Content Example

```markdown
---
term: Alert Correlation
excerpt: Alert correlation is the process of analyzing and connecting multiple alerts to identify patterns and reduce alert noise.
related:
  - name: Zero Trust for incidents
    slug: zero-trust-security
---
## Example content
Lorem ipsum...
```