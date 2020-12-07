// core packages
const path = require('path')

// npm packages
const SimpleIcons = require('simple-icons'),
      IconFontBuildr = require('icon-font-buildr')

// local packages
const svgo = require('./svgo');


// Exclude the Elsevier icon for now, it seems to be too big
delete SimpleIcons['Elsevier'];

// script
const builder = new IconFontBuildr({
	sources: [
		path.join(path.dirname(require.resolve('simple-icons')), 'icons', '[icon].svg')
	],
	icons: Object.values(SimpleIcons).map(icon => ({
		icon: icon.slug, // source file name, e.g. "about-dot-me"
		ligatures: [icon.slug]
	})),
	output: {
		ligatures: true,
		icons: null,
		fonts: path.join(__dirname, '..', 'font'),
		fontName: 'SimpleIcons',
		formats: [
			'woff',
			'woff2'
		]
	}
})

module.exports = svgo()
  .then(() => console.log('Simple Icons SVGs optimized'))
  .then(() => builder.build())
  .then(() => console.log('Font created successfully!'))
  .catch(err => console.error('An error occurred while creating the font:', err))
