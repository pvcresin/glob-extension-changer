#!/usr/bin/env node

const path = require('path');
const { name, version } = require('./package.json');
const { Command } = require('commander');
const glob = require('glob');

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

if (program.args.length > 1) {
  console.error('Currently only one glob pattern is supported.');
  process.exit(1);
}

const pattern = program.args.slice(0, 1).join('');

function changeExtension(filePath) {
  const file = path.parse(filePath);
  const oldFilePath = path.join(file.dir, file.base);
  const newFileName = `${file.name}${options.extension}`;
  const newFilePath = path.join(file.dir, newFileName);
  console.log(`  ${oldFilePath} -> ${newFilePath}`);
  return newFilePath;
}

glob(pattern, {}, function (err, filePaths) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  filePaths.forEach((filePath) => changeExtension(filePath));
  console.log(`${filePaths.length} files`);
});
