const exec = require('child_process').execSync;

async function main() {
  try {
    await exec('npm uninstall simple-icons');
    await exec('npm install --save-dev --save-exact simple-icons');
  } catch (err) {
    console.error('Failed to update simple-icons to latest version:', err);
  }
}

main();
