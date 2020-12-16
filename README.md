<p align="center">
<a href="https://simpleicons.org/">
<img src="https://simpleicons.org/icons/simpleicons.svg" alt="Simple Icons" width=64 height=64>
</a>
<h3 align="center">Simple Icons: <em>Icon font</em></h3>
<p align="center">
Free SVG icon font for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub. Started by <a href="https://twitter.com/bathtype">Dan Leech</a>.</p>
</p>

## Setup

### From CDN

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/simple-icons-font@v2/font/simple-icons.min.css"
      type="text/css">
```

### NodeJS

```
$ npm install simple-icons-font
```

After installation, the icon font can then be found in `node_modules/simple-icons-font/font` along with stylesheets for a basic setup.

### Manual download

1. [Download the latest version of the package][npm-registry-tarball-link], extract it, and move the content of the `font` folder to your desired location.
1. Reference the CSS file in a `link` tag of your HTML:

```html
<link rel="stylesheet"
      href="/path/to/simple-icons.min.css"
      type="text/css">
```

## Usage

The CSS files of simple-icons-font contains next classes:

- `simpleicons`: Adds the font to the container that will display the icon.
- `simpleicons--color`: Colorizes the icon with the main color of the brand.
- `simpleicons-[ICON SLUG]`: Replace here `[ICON SLUG]` by with the correspondent slug for the icon. Their slugs correpond to filenames, which you can see listed in [simple-icons/icons][simple-icons--icons-dir-link].

### Example

```html
<i class="simpleicons simpleicons--color simpleicons-simpleicons"></i>
```

## Status

[![Build Status][build-status-image]][build-status-link]
[![NPM version][npm-version-image]][npm-package-link]

[build-status-image]: https://img.shields.io/github/workflow/status/simple-icons/simple-icons-font/Verify/develop?logo=github
[build-status-link]: https://github.com/simple-icons/simple-icons-font/actions?query=workflow%3AVerify+branch%3Adevelop
[npm-version-image]: https://img.shields.io/npm/v/simple-icons-font?logo=npm
[npm-package-link]: https://www.npmjs.com/package/simple-icons-font
[simple-icons--icons-dir-link]: https://github.com/simple-icons/simple-icons/tree/develop/icons
[npm-registry-tarball-link]: https://registry.npmjs.org/simple-icons-font/-/simple-icons-font-2.0.0.tgz
