<p align="center">
<a href="https://simpleicons.org/">
<img src="https://simpleicons.org/icons/simpleicons.svg" alt="Simple Icons" width=64 height=64>
</a>
<h3 align="center">Simple Icons: <em>Icon font</em></h3>
<p align="center">
Free SVG icon font for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>

<p align="center">
<a href="https://github.com/simple-icons/simple-icons-font/actions?query=workflow%3AVerify+branch%3Adevelop"><img src="https://img.shields.io/github/workflow/status/simple-icons/simple-icons-font/Verify/develop?logo=github" alt="Build status" /></a>
<a href="https://www.npmjs.com/package/simple-icons-font"><img src="https://img.shields.io/npm/v/simple-icons-font?logo=npm" alt="NPM version" /></a>
<a href="https://packagist.org/packages/simple-icons/simple-icons-font"><img src="https://img.shields.io/packagist/v/simple-icons/simple-icons-font?logo=packagist&logoColor=white" alt="Build status" /></a>
</p>

## Setup

### CDN Setup

The font can be served from a CDN such as [JSDelivr][jsdelivr-link] or [Unpkg][unpkg-link]. Simply use the `simple-icons-font` NPM package and specify a version in the URL like the following:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v4/font/simple-icons.min.css" type="text/css">
<link rel="stylesheet" href="https://unpkg.com/simple-icons-font@4/font/simple-icons.min.css" type="text/css">
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However this may cause an icon to disappear if it has been removed in the latest version.

### Node Setup

The font is also available through our npm package. To install, simply run:

```
$ npm install simple-icons-font
```

After installation, the icons font and stylesheet font can be found in `node_modules/simple-icons-font/font`. You can use your favorite bundling tool to include them into your project.

### PHP Setup

The font is also available through our Packagist package. To install, simply run:

```
$ composer require simple-icons-font
```

The font can then be used by linking to the stylesheet in your HTML or PHP file (see example in [Manual Setup](#manual-setup)).

### Manual Setup

You can also [download the latest version of the package][latest-release] and copy the content of the `font` folder into your project. Then, reference the CSS file using a `link` tag in your HTML:

```html
<link rel="stylesheet" href="/path/to/simple-icons.min.css" type="text/css">
```

## Usage

> :information_source: We ask that all users read our [legal disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) before using icons from Simple Icons.

Use any of the icons available in simple-icons by adding the following classes to a node in your HTML. Use the `si--color` class to apply the brand's color to the icon.

```html
<i class="si si-[ICON NAME]"></i>
<i class="si si-[ICON NAME] si--color"></i>
```

Where `[ICON NAME]` is replaced by the icon name, for example:

```html
<i class="si si-simpleicons"></i>
<i class="si si-simpleicons si--color"></i>
```

In this example we use the `<i>` tag, but any inline HTML tag should work as you expect.

[latest-release]: https://github.com/simple-icons/simple-icons-font/releases/latest
[jsdelivr-link]: https://www.jsdelivr.com/package/npm/simple-icons-font/
[unpkg-link]: https://unpkg.com/browse/simple-icons-font/
