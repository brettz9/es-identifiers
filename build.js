const unicodeVersion = '10.0.0';

const fs = require('fs');
const path = require('path');

const latestUnicode = 'unicode-' + unicodeVersion;

// We could use `regenerate` for all strings, but this seemed easier
const UnicodeIDStart = require(latestUnicode + '/Binary_Property/ID_Start/regex.js').source;
const UnicodeIDContinue = require(latestUnicode + '/Binary_Property/ID_Continue/regex.js').source;

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

fs.writeFileSync(
    path.join(__dirname, 'dist', 'es-identifiers.js'),
    // `module.exports = ${JSON.stringify(module.exports)};
    `module.exports.IdentifierName = /${whole_IdentifierName}/;`
);
fs.writeFileSync(
    path.join(__dirname, 'dist', 'es-identifiers-browser.js'),
    // `window.ESIdentifiers = ${JSON.stringify(module.exports)};
    `window.ESIdentifiers = {IdentifierName: /${whole_IdentifierName}/};`
);
fs.writeFileSync(
    path.join(__dirname, 'dist', 'es-identifiers-es6.js'),
    // `window.ESIdentifiers = ${JSON.stringify(module.exports)};
    `export default {IdentifierName: /${whole_IdentifierName}/};`
);

console.log(`/whole_IdentifierName/`, eval(`/${whole_IdentifierName}/`));
// const regex = /<%= set.toString() %>/gim;
