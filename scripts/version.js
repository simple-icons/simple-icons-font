// core packages
const path = require('path'),
      util = require('util'),
      exec = util.promisify(require('child_process').exec)

async function main() {
	const packageJson = require(path.join(__dirname, '..', 'package.json'))
	const { stdout, stderr } = await exec(`npm i -E simple-icons@${packageJson.version}`)

	if(stderr) console.error(`error: ${stderr}`)
}

main()
