// core packages
const fs = require('fs'),
      path = require('path')

// npm packages
const pug = require('pug'),
      simpleIcons = require('simple-icons')

// utils
const { titleToFilename } = require('./utils')


const basePath = path.join(__dirname, '..')

const attributedIcons = Object.values(simpleIcons).map(icon => {
	return {
		name: icon.title,
		cssClass: titleToFilename(icon.title)
	}
})

pug.renderFile(
	path.join(basePath, 'preview', 'html', 'testpage.pug'),
	{ icons: attributedIcons },
	(err, html) => {
		if(err) throw err

		fs.writeFile(path.join(basePath, 'preview', 'testpage.html'), html, err => {
			if(err) throw err
			console.info('Test page built.')
		})
	}
)
