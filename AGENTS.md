# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Personal portfolio website for Robin (Zihao) Lin built with vanilla HTML, CSS, JavaScript, and jQuery. The site uses Gulp as a build tool to compile SCSS to CSS and minify JavaScript.

## Development Commands

### Build and Watch
```bash
# Install dependencies
npm install

# Watch for changes and automatically rebuild (recommended for development)
npm run watch
# Internally runs: gulp watch
# This watches js/scripts.js and scss/styles.scss and rebuilds on changes
```

### Manual Build Tasks
```bash
# Compile SCSS to CSS (scss/styles.scss → css/styles.css)
npx gulp styles

# Minify JavaScript (js/scripts.js → js/scripts.min.js)
npx gulp scripts
```

## Architecture

### Build System (Gulp)
The project uses Gulp 4 with the following pipeline:
- **Styles task**: Compiles `scss/styles.scss` → `css/styles.css` (compressed output)
- **Scripts task**: Minifies `js/scripts.js` → `js/scripts.min.js` (with uglify)
- **Watch task**: Monitors source files and triggers appropriate tasks on changes

### File Structure
- **index.html**: Single-page application with all content (About, Experience, Education, Contact sections)
- **scss/styles.scss**: Main stylesheet with SCSS variables and mixins. Contains all component styles in a single file organized by section
- **js/scripts.js**: jQuery-based interactions including smooth scrolling, mobile menu toggle, and dynamic timeline generation
- **css/**: Generated CSS files (not edited directly)
- **images/**: Static image assets
- **documents/**: PDF files (resume, reports)
- **libs/**: Third-party libraries (Font Awesome, Bootstrap via CDN in HTML)

### Key Components
- **Header/Navigation**: Fixed header with smooth scroll anchor links to page sections
- **Lead Section**: Hero section with typewriter animation effect (CSS-based, defined inline in index.html)
- **Experience Timeline**: Dynamically generated vertical timeline built by jQuery from data-date attributes
- **Responsive Design**: Mobile-first approach with Bootstrap grid and custom mobile menu

### Styling Approach
- SCSS variables for theming (base colors, backgrounds, text colors) defined at top of styles.scss
- Mixins for transitions and placeholder styling
- Color scheme: Primary blue (#3498db), with defined text and heading colors
- No CSS frameworks beyond Bootstrap grid (custom components throughout)

### JavaScript Patterns
- jQuery-based IIFE pattern for scoping
- Progressive enhancement: removes 'no-js' class on load
- Timeline auto-generation from simple markup (data-date attributes)
- Smooth scroll animations calculated based on page position

## Important Notes
- The site has no backend - contact form uses Formspree (https://formspree.io)
- All analytics tracked via Google Analytics (gtag.js) in index.html head
- Generated files (css/styles.css, js/scripts.min.js) are committed to git
- When making style changes, edit scss/styles.scss, not css/styles.css
- When making script changes, edit js/scripts.js (scripts.min.js is auto-generated)
