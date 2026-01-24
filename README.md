# tooa.github.io

## Development

```bash
# Install dependencies from Gemfile
$ bundle install

# Start local development server
$ jekyll serve --livereload --port 4001

# Update Gemfile.lock
$ bundle update
```

## Content

### Blog

Use blockquotes with Kramdown IAL for callouts in blog posts. Available types: `aside`, `tip`, `tease`, `fact`.

```markdown
> This is an aside message
{: .callout .callout-aside}

> This is a tip
{: .callout .callout-tip}
```

Code highlighting: [Themes](https://github.com/mzlogin/rouge-themes?tab=readme-ov-file#github)

Frontmatter:

- `updated` (optional): Shows "last updated on" date for the article when set
