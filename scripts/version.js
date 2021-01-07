// core packages
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const packageJson = require('./../package.json');

async function main() {
  const { stdout, stderr } = await exec(
    `npm i -E simple-icons@${packageJson.version}`
  );

  if (stderr) console.error(`error: ${stderr}`);
}

main();
