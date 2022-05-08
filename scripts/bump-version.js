#!/usr/bin/env node
/**
 * @fileoverview
 * Update the simple-icons dependency to the latest version and the version of
 * this package accordingly. Upon success, the new version is outputted.
 */

import { execSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_JSON_FILE = path.join(ROOT_DIR, 'package.json');
const PACKAGE_LOCK_FILE = path.join(ROOT_DIR, 'package-lock.json');

const PACKAGE_JSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_FILE, 'utf8'));
const PACKAGE_LOCK = JSON.parse(fs.readFileSync(PACKAGE_LOCK_FILE, 'utf8'));

const stringifyJson = (object) => {
  return JSON.stringify(object, null, 2);
};

const getSimpleIconsDependencyLatestVersion = () => {
  const versions = JSON.parse(
    execSync('npm view simple-icons --json').toString(),
  ).versions;
  return versions[versions.length - 1];
};

const updateSimpleIconsDependency = () => {
  execSync('npm uninstall simple-icons');
  execSync('npm install --save-dev --save-exact simple-icons');
};

const main = () => {
  const siLatestVersion = getSimpleIconsDependencyLatestVersion();
  const siInstalledVersion = PACKAGE_JSON.devDependencies['simple-icons'];

  if (semver.gt(siLatestVersion, siInstalledVersion)) {
    PACKAGE_JSON.version = siLatestVersion;
    PACKAGE_LOCK.version = siLatestVersion;

    fs.writeFileSync(PACKAGE_JSON_FILE, `${stringifyJson(PACKAGE_JSON)}\n`);
    fs.writeFileSync(PACKAGE_LOCK_FILE, `${stringifyJson(PACKAGE_LOCK)}\n`);

    updateSimpleIconsDependency();

    console.log(siLatestVersion);
  } else {
    console.error(`Version already exists (${siInstalledVersion})`);
  }
};

main();
