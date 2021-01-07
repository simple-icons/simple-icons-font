const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const PACKAGE_JSON_FILE = path.resolve(__dirname, '..', 'package.json');
const PACKAGE_LOCK_FILE = path.resolve(__dirname, '..', 'package-lock.json');

function stringifyJson(object) {
  return JSON.stringify(object, null, 2);
}

function updateSimpleIconsDependency() {
  try {
    execSync('npm uninstall simple-icons');
    execSync('npm install --save-dev --save-exact simple-icons');
  } catch (err) {
    console.error('Failed to update simple-icons to latest version:', err);
    return err;
  }
}

function updateVersionNumber() {
  try {
    const packageFileRaw = fs.readFileSync(PACKAGE_JSON_FILE).toString();
    const packageLockRaw = fs.readFileSync(PACKAGE_LOCK_FILE).toString();

    const packageFile = JSON.parse(packageFileRaw);
    const packageLock = JSON.parse(packageLockRaw);

    const currentVersion = packageFile.version;
    const simpleIconsVersion = packageFile.devDependencies['simple-icons'];
    if (semver.gt(simpleIconsVersion, currentVersion)) {
      packageFile.version = simpleIconsVersion;
      packageLock.version = simpleIconsVersion;
    } else {
      throw new Error(`Version already exists (${currentVersion})`);
    }

    fs.writeFileSync(PACKAGE_JSON_FILE, stringifyJson(packageFile) + '\n');
    fs.writeFileSync(PACKAGE_LOCK_FILE, stringifyJson(packageLock) + '\n');
    return [simpleIconsVersion, null];
  } catch (err) {
    console.error('Failed to version bump this package:', err);
    return [null, err];
  }
}

function main() {
  const errorA = updateSimpleIconsDependency();
  if (errorA) {
    return;
  }

  const [newVersion, errorB] = updateVersionNumber();
  if (errorB) {
    return;
  }

  console.log(`::set-output name=NEW_VERSION::${newVersion}`);
}

main();
