#!/usr/bin/env node
const HTMLSource = require('@atjson/source-html');
const OffsetSource = require('@atjson/offset-annotations');
const colors = require('colors');
var argv = require('yargs/yargs')(process.argv.slice(2))
  .command(
    '"string of html" --pretty-print',
    'convert string of html to annotated Atjson. --pretty-print is optional.'
  )
  .boolean(['pretty-print'])
  .demandCommand(1)
  .help('h')
  .alias('h', 'help').argv;

function HTMLToAtjson(html) {
  const source = HTMLSource.default
    .fromRaw(html)
    .convertTo(OffsetSource.default)
    .canonical()
    .toJSON();

  const annotations = source.annotations
    .filter((item) => !item.type.startsWith('-html'))
    .map((item) => {
      const { type, start, end, attributes } = item;
      return {
        type,
        start,
        end,
        attributes,
      };
    });

  delete source['schema'];
  const Annotated = { ...source, annotations };
  const output = argv.prettyPrint
    ? JSON.stringify(Annotated, null, 2)
    : JSON.stringify(Annotated);

  return process.stdout.write(colors.green(output));
}

HTMLToAtjson(`${argv._}`);
