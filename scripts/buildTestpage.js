// core packages
const fs = require('fs'),
      path = require('path')

// npm packages
const pug = require('pug')


const basePath = path.join(__dirname, '..')

pug.renderFile(
	path.join(basePath, 'preview', 'html', 'testpage.pug'),
	{
		icons: Object.values(require('simple-icons')).map(icon => {
			return {
				name: icon.title,
				color: icon.hex,
				ligature: icon.title
					.replace(/[ !’]/g, '')
					.replace(/-/g, '_') // hyphens not supported
			}
		})
	},
	(err, html) => {
		if(err) throw err

		fs.writeFile(path.join(basePath, 'preview', 'testpage.html'), html, err => {
			if(err) throw err
			console.info('Test page built.')
		})
	}
)
