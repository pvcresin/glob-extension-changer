# glob-extension-changer

A simple command line interface to change the file extension using the glob pattern.

## Usage

Dry run with `--check` flag.

```sh
npx glob-extension-changer 'path/to/file/**/*.js' --extension .ts --check
```

Actually rename it.

```sh
npx glob-extension-changer 'path/to/file/**/*.js' --extension .ts
```

## Options

Just run `glob-extension-changer --help`.

```sh
Usage: glob-extension-changer [options] [glob]

Options:
  -v, --version                output the current version
  -x, --extension [extension]  specify the extension after conversion
  -c, --check                  print the result after conversion
  -h, --help                   display help for command
```
