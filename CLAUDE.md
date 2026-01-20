# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website for Uli Fahrer built with Jekyll. Hosted on GitHub Pages at uli-fahrer.de.

## Development Commands

### Local Development

```bash
# Serve locally with live reload
jekyll servce --livereload --port 4001
```

This starts the Jekyll development server.  The site will be available at http://localhost:4001.

### Building the Site

Jekyll builds the site automatically. The output goes to the _site/ directory (which is ignored by git for GitHub Pages deployments).

# Technology

- Jekyll web framework
- Bootstrap framework for frontend components and grid layout
- Font Awesome for icons
- CSS for custom styling

## Architecture

This is a standard Jekyll site with:

- **Layouts** (`_layouts/`): `default.html` is the base template; other layouts extend it
- **Includes** (`_includes/`): Reusable partials (header, footer, head, scripts)
- **Data files** (`_data/`): YAML files for projects and publications - these drive the portfolio sections
- **Posts** (`_posts/`): Blog posts in markdown with YYYY-MM-DD-title.md naming
- **Static assets**: `css/`, `js/`, `img/`, `webfonts/`

## Content Structure

- Navigation includes: Home, Publications, Projects, Blog

## Key Configuration

- `_config.yml`: Site settings, permalink structure, kramdown/rouge for markdown/syntax highlighting
- `Gemfile`: Uses Jekyll 4.4.1 directly (not github-pages gem due to Ruby 3.4.x compatibility issues)
