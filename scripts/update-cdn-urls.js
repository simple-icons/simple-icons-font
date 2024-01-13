/**
 * @fileoverview
 * Updates the CDN URLs in the README.md to match the major version in the
 * NPM package manifest. Does nothing if the README.md is already up-to-date.
 */

import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getDirnameFromImportMeta } from 'simple-icons/sdk';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..');
const packageJsonFile = path.resolve(rootDir, 'package.json');
const readmeFile = path.resolve(rootDir, 'README.md');

const getMajorVersion = (version) => {
  const majorVersionAsString = version.split('.')[0];
  return parseInt(majorVersionAsString);
};

const getManifest = async () => {
  const manifestRaw = await fs.readFile(packageJsonFile, 'utf-8');
  return JSON.parse(manifestRaw);
};

const updateVersionIfNecessary = async (majorVersion) => {
  return (await fs.readFile(readmeFile, 'utf8')).replace(
    /simple-icons-font@v[0-9]+/g,
    `simple-icons-font@v${majorVersion}`,
  );
};

const main = async () => {
  try {
    const manifest = await getManifest();
    let version = manifest.devDependencies['simple-icons'];
    const majorVersion = getMajorVersion(version);
    const newContent = await updateVersionIfNecessary(majorVersion);
    await fs.writeFile(readmeFile, newContent);
  } catch (error) {
    console.error('Failed to update CDN version number:', error);
    process.exit(1);
  }
};

await main();
