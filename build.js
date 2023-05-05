import {readFile, writeFile} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {devDependencies} = JSON.parse(
  await readFile('./package.json')
);

const unicodeVersion = Object.keys(devDependencies).find((mod) => {
  return (/@unicode\/unicode-\d+\.\d+\.\d+/).test(mod);
}).replace(/^@unicode\/unicode-/u, '');

const latestUnicode = '@unicode/unicode-' + unicodeVersion;

// We could use `regenerate` for all strings, but this seemed easier
const [{default: {source: UnicodeIDStart}}, {default: {source: UnicodeIDContinue}}] = await Promise.all([
  import(latestUnicode + '/Binary_Property/ID_Start/regex.js'),
  import(latestUnicode + '/Binary_Property/ID_Continue/regex.js')
]);

const ZWNJ = '\u200C';
const ZWJ = '\u200D';

const IdentifierStart = '(?:' + UnicodeIDStart + '|[$_])';
const IdentifierPart = '(?:' + UnicodeIDContinue + '|[$_' + ZWNJ + ZWJ + '])';
const IdentifierName = IdentifierStart + IdentifierPart + '*';

const whole_IdentifierName = '^' + IdentifierName + '$';

/*
module.exports = {
  ZWNJ,
  ZWJ,
  HexDigit,
  HexDigits,
  Hex4Digits,
  UnicodeEscapeSequence,

  UnicodeIDStart,
  UnicodeIDContinue,
  IdentifierStart,
  IdentifierPart,
  IdentifierName,

  whole_IdentifierName
};
*/

await Promise.all([
  writeFile(
    join(__dirname, 'dist', 'es-identifiers.cjs'),
    // `module.exports = ${JSON.stringify(module.exports)};
    `module.exports.IdentifierName = /${whole_IdentifierName}/;`
  ),
  writeFile(
    join(__dirname, 'dist', 'es-identifiers-browser.js'),
    // `window.ESIdentifiers = ${JSON.stringify(module.exports)};
    `window.ESIdentifiers = {IdentifierName: /${whole_IdentifierName}/};`
  ),
  writeFile(
    join(__dirname, 'dist', 'es-identifiers-es6.js'),
    // `window.ESIdentifiers = ${JSON.stringify(module.exports)};
    `export default {IdentifierName: /${whole_IdentifierName}/};`
  )
]);

console.log(`/whole_IdentifierName/`, eval(`/${whole_IdentifierName}/`));
// const regex = /<%= set.toString() %>/gim;
