// core packages
const fs = require('fs'),
      path = require('path')

// npm packages
const simpleIcons = require('simple-icons')

// utils
const { titleToFilename } = require('../lib/utils')


const basePath = path.join(__dirname, '..')

const attributedIcons = Object.values(simpleIcons).map(icon => {
	return {
		color: icon.hex,
		cssClass: titleToFilename(icon.title),
		ligature: titleToFilename(icon.title)
	}
})

fs.readFile(path.join(basePath, 'src', 'css', 'base.css'), (err, baseCss) => {
	if(err) throw err

	attributedIcons.forEach(icon => {
		baseCss += '\n'
		+   `.simpleicons-${icon.cssClass}::before { content: '${icon.ligature}'; }\n`
		+   `.simpleicons-${icon.cssClass}.simpleicons--color::before { color: #${icon.color}; }\n`
	})

	fs.writeFile(path.join(basePath, 'font', 'font.css'), baseCss, err => {
		if(err) throw err
		console.info('CSS built.')
	})
})
