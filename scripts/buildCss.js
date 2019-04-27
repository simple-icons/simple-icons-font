// core packages
const fs = require('fs'),
      path = require('path')

// npm packages
const simpleIcons = require('simple-icons')


const basePath = path.join(__dirname, '..')

const attributedIcons = Object.values(simpleIcons).map(icon => {
	return {
		color: icon.hex,
		cssClass: icon.title
			.toLowerCase()
			.replace(/[ !’]/g, '')
			.replace(/-/g, '_') // hyphens not supported in ligatures
			.replace(/\./g, 'dot') // dot not supported in css class names
			.replace(/\+/g, 'plus') // plus not supported in css class names
			.replace(/&/g, 'and') // ampersand not supported in css class names
		,
		ligature: icon.title
			.replace(/[ !’]/g, '')
			.replace(/-/g, '_') // hyphens not supported in ligatures
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
