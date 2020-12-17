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

The font can be served from a CDN such as [JSDelivr][jsdelivr-link] or [Unpkg][unpkg-link]. Simply use the `simple-icons-font` NPM package and specify a version in the URL like the following:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v2/font/simple-icons.min.css" type="text/css">
<link rel="stylesheet" href="https://unpkg.com/simple-icons-font@2/font/simple-icons.min.css" type="text/css">
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However, this will result in a icons not showing as expected if an icon is removed.

### NodeJS

The font is also available through our npm package. To install, simply run:

```
$ npm install simple-icons-font
```

After installation, the icons font and stylesheet font can be found in `node_modules/simple-icons-font/font`. You can use your favorite bundling tool to include them into your project.

### Manual download

You can also [download the latest version of the package][npm-registry-tarball-link] and copy the content of the `font` folder into your project. Then, reference the CSS file using a `link` tag in your HTML:

```html
<link rel="stylesheet" href="/path/to/simple-icons.min.css" type="text/css">
```

## Usage

Use any of the icons available in simple-icons by adding the following classes to a node in your HTML. Use the `simple-icons--color` class to apply the brand's color to the icon.

```html
<i class="simpleicons simpleicons-[ICON NAME]"></i>
<i class="simpleicons simpleicons-[ICON NAME] simple-icons--color"></i>
```

Where `[ICON NAME]` is replaced by the icon name, for example:

```html
<i class="simpleicons simpleicons-simpleicons"></i>
<i class="simpleicons simpleicons-simpleicons simple-icons--color"></i>
```

In this example we use the `<i>` tag, but any inline HTML tag should work as you expect.


## Status

[![Build Status][build-status-image]][build-status-link]
[![NPM version][npm-version-image]][npm-package-link]

[build-status-image]: https://img.shields.io/github/workflow/status/simple-icons/simple-icons-font/Verify/develop?logo=github
[build-status-link]: https://github.com/simple-icons/simple-icons-font/actions?query=workflow%3AVerify+branch%3Adevelop
[npm-version-image]: https://img.shields.io/npm/v/simple-icons-font?logo=npm
[npm-package-link]: https://www.npmjs.com/package/simple-icons-font
[npm-registry-tarball-link]: https://registry.npmjs.org/simple-icons-font/-/simple-icons-font-2.0.0.tgz
[jsdelivr-link]: https://www.jsdelivr.com/package/npm/simple-icons-font/
[unpkg-link]: https://unpkg.com/browse/simple-icons-font/
