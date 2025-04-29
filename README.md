<img src="hero.png" alt="Incident Response Glossary by Spike.sh"/>

# Incident Response Glossary

This is the largest Incident Response Glossary with 500+ terms explained. We built this glossary because we often found ourselves explaining the same terms to new teammates, and we wanted a single source of truth for anyone working in ops.

Demo → [spike.sh/glossary](https://spike.sh/glossary)

> **PRs are welcome!** Whether you want to contribute new terms or improve the website itself, we welcome content writers and developers alike.

---

## Table of Contents
- [Contributing a New Term ✍️ ](#contributing-a-new-term)
- [Developer Setup](#developer-setup)
  - [Project Structure](#project-structure)
  - [Customization](#customization)
- [Thank You](#thank-you)

---

## Contributing a New Term

To contribute a term or suggest improvements to existing ones, please see our full guide in [CONTRIBUTING.md](CONTRIBUTING.md).

Here's a quick overview:

1. Go to `/src/` and add a new markdown file (e.g., `incident-management.md`)
2. Use this format:

```markdown
---
term: Incident Management
excerpt: Coordinating efforts to handle and resolve incidents efficiently.
related:
  - incident-response
  - post-incident-review
---

## What Is Incident Management
Explain the term...

## Why Is Incident Management Important
Explain why it matters...

## Example Of Incident Management
Give a practical example...

```
3. Commit your file and open a pull request. That's it!

---
## Developer setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies with `npm install` or `yarn`

### Development

Start the development server with automatic Sass compilation when files change:

```bash
npm run dev
```
```bash
yarn run dev
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

### Project Structure

```
.
├── src/                    
│   ├── _includes/          
│   │   └── layouts/        # Layout templates
│   ├── assets/             # Static assets
│   │   ├── css/            # Compiled CSS (don't edit directly)
│   │   ├── js/             
│   │   ├── images/         
│   │   └── scss/           # Sass source files
│   │       ├── base/       # Base styles, variables, reset
│   │       ├── components/ # Component-specific styles
│   │       └── layout/     # Layout styles
│   ├── data/               # Global data files
│   ├──            # +++  Glossary term markdown files   +++
│   ├── index.hbs           # Home page
│   └── glossary.hbs        # Glossary list page
├── .eleventy.js            
├── package.json            
└── README.md               
```

### Customization
- Sass: `src/assets/scss/`
  - `base/_variables.scss` for colors & breakpoints
  - `components/`, `layout/` for other styling
- Layouts: `src/_includes/layouts/`
- Data: `src/data/site.js`
- Glossary terms can be filtered by first letter using `src/assets/js/glossary.js`

--- 

# Thank You 🙏
Thanks for checking out the Incident Response Glossary!

This project is a small way for us at [Spike](https://spike.sh) to give back to the DevOps and SRE community.

If you find it useful, feel free to share it, contribute, or just explore and learn.

Every term helps someone build more reliable systems — and that’s what we’re here for.

Happy learning!

Follow us for more:

- [Twitter / X](https://twitter.com/SpikedHQ)  
- [LinkedIn](https://linkedin.com/company/spike-hq)
- [r/spikesh on Reddit](https://www.reddit.com/r/spikesh)