// core packages
const fs = require('fs'),
      path = require('path')

// npm packages
const pug = require('pug'),
      simpleIcons = require('simple-icons')


const basePath = path.join(__dirname, '..')

const attributedIcons = Object.values(simpleIcons).map(icon => {
	return {
		name: icon.title,
		cssClass: icon.title
			.toLowerCase()
			.replace(/[ !’]/g, '')
			.replace(/-/g, '_') // hyphens not supported in ligatures
			.replace(/\./g, 'dot') // dot not supported in css class names
			.replace(/\+/g, 'plus') // plus not supported in css class names
			.replace(/&/g, 'and') // ampersand not supported in css class names
	}
})

pug.renderFile(
	path.join(basePath, 'src', 'html', 'test.pug'),
	{ icons: attributedIcons },
	(err, html) => {
		if(err) throw err

		fs.writeFile(path.join(basePath, 'font', 'testpage.html'), html, err => {
			if(err) throw err
			console.info('Test page built.')
		})
	}
)
