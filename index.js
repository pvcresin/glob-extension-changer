#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { name, version } = require('./package.json');
const { Command } = require('commander');
const { sync } = require('glob');
const { promisify } = require('util');

const rename = promisify(fs.rename);

const program = new Command(name);

program
  .version(version, '-v, --version', 'output the current version')
  .usage('[options] [glob]')
  .requiredOption('-x, --extension [extension]', 'specify the extension after conversion')
  .option('-c, --check', 'print the result after conversion')
  .parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

if (program.args.length !== 1) {
  console.error('Currently only one glob pattern is supported.');
  process.exit(1);
}

const pattern = program.args.slice(0, 1).join('');

const filePaths = sync(pattern, { nodir: true });

const extensionInfos = filePaths
  .map((filePath) => {
    const file = path.parse(filePath);
    const oldFilePath = path.join(file.dir, file.base);
    const newFilePath = path.join(file.dir, `${file.name}${options.extension}`);
    const isTargetFile = oldFilePath !== newFilePath;

    if (isTargetFile) {
      console.log(`  ${oldFilePath} -> ${newFilePath}`);
    }
    return { oldFilePath, newFilePath, isTargetFile };
  })
  .filter(({ isTargetFile }) => isTargetFile);

if (extensionInfos.length === 0) {
  console.log(`There were no files to be renamed.`);
  process.exit(0);
}

// check only (= dry run)
if (options.check) {
  console.log(`${extensionInfos.length} files will be renamed.`);
} else {
  Promise.all(
    extensionInfos.map(({ oldFilePath, newFilePath }) => rename(oldFilePath, newFilePath)),
  )
    .then(() => {
      console.log(`${extensionInfos.length} files have been renamed.`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
