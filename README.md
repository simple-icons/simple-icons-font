<p align="center">
<img src="https://cdn.simpleicons.org/simpleicons/000/fff" alt="Node" width=70 />
<h3 align="center">Simple Icons: <em>Icon font</em></h3>
<p align="center">
Free SVG icon font for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/simple-icons-font"><img src="https://img.shields.io/npm/v/simple-icons-font?logo=npm" alt="NPM version" /></a>
<a href="https://packagist.org/packages/simple-icons/simple-icons-font"><img src="https://img.shields.io/packagist/v/simple-icons/simple-icons-font?logo=packagist&logoColor=white" alt="Build status" /></a>
<a href="https://formulae.brew.sh/cask/font-simple-icons"><img src="https://img.shields.io/homebrew/cask/v/font-simple-icons?logo=homebrew&logoColor=white" alt="Homebrew Cask" /></a>
</p>

## Setup

> :information_source: We ask that all users read our [legal disclaimer](https://github.com/simple-icons/simple-icons/blob/master/DISCLAIMER.md) before using icons from Simple Icons.

### CDN Setup

The font can be served from a CDN such as [JSDelivr][jsdelivr-link] or [Unpkg][unpkg-link]. Simply use the `simple-icons-font` NPM package and specify a version in the URL like the following:

#### JSDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v15/font/simple-icons.min.css" type="text/css">
```

#### Unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/simple-icons-font@v15/font/simple-icons.min.css" type="text/css">
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However this may cause an icon to disappear if it has been removed in the latest version.

### Homebrew Setup <img src="https://cdn.simpleicons.org/homebrew/000/fff" alt="Homebrew" align=left width=24>

The font is also available through Homebrew Cask. To install, simply run:

```shell
brew install font-simple-icons
```

After installation, the font will be available in your system's font library, and you can use it in any application that supports custom fonts.

### Node Setup <img src="https://cdn.simpleicons.org/nodedotjs/000/fff" alt="Node" align=left width=24>

The font is also available through our npm package. To install, simply run:

```shell
npm install simple-icons-font
```

After installation, the icons font and stylesheet font can be found in `node_modules/simple-icons-font/font`. You can use your favorite bundling tool to include them into your project.

### PHP Setup <img src="https://cdn.simpleicons.org/php/000/fff" alt="PHP" align=left width=24>

The font is also available through our Packagist package. To install, simply run:

```shell
composer require simple-icons/simple-icons-font
```

The font can then be used by linking to the stylesheet in your HTML or PHP file (see example in [Manual Setup](#manual-setup)).

### Manual Setup

You can also [download the latest version of the package][latest-release] and copy the content of the `font` folder into your project. Then, reference the CSS file using a `link` tag in your HTML:

```html
<link rel="stylesheet" href="/path/to/simple-icons.min.css" type="text/css">
```

## Usage

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

Or use the fit style font, all font will rendered in the same height:

```html
<i class="si-fit si-simpleicons"></i>
<i class="si-fit si-simpleicons si--color"></i>
```

In this example we use the `<i>` tag, but any inline HTML tag should work as you expect.

## Custom Builds

You can specify which icons need to be build for a smaller file size.

1. Clone and install dependencies:

```shell
git clone git@github.com:simple-icons/simple-icons-font.git
cd simple-icons-font
npm install
```

2. Use the environment variable `SI_FONT_SLUGS_FILTER` to filter icons to include:

```shell
SI_FONT_SLUGS_FILTER=github,simpleicons npm run build
```

Next environment variables are available to customize the build:

- `SI_FONT_SLUGS_FILTER`: Comma separated string of slugs to include in the build. See [all slugs].
- `SI_FONT_PRESERVE_UNICODES`: By default, the build will retain the same unicode of an icon as the full build. You can set it to `false` to disable this.

For example, if you set `SI_FONT_PRESERVE_UNICODES` to `false`, the unicode will still start at `0xea01` and keep increasing even you skipped some icons:

```shell
SI_FONT_SLUGS_FILTER=github,simpleicons SI_FONT_PRESERVE_UNICODES=false npm run build
#=> github      \u{EA01}
#=> simpleicons \u{EA02}
```

[latest-release]: https://github.com/simple-icons/simple-icons-font/releases/latest
[jsdelivr-link]: https://www.jsdelivr.com/package/npm/simple-icons-font/
[unpkg-link]: https://unpkg.com/browse/simple-icons-font/
[all slugs]: https://github.com/simple-icons/simple-icons/blob/develop/slugs.md
