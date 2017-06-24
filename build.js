const unicodeVersion = '10.0.0';

String.prototype.padStart = require('string.prototype.padstart').getPolyfill();
const fs = require('fs');
const path = require('path');
const regenerate = require('regenerate');

const latestUnicode = 'unicode-' + unicodeVersion;

const UnicodeIDStart = regenerate(
    require(latestUnicode + '/Binary_Property/ID_Start/code-points')
);
const UnicodeIDContinue = regenerate(
    require(latestUnicode + '/Binary_Property/ID_Continue/code-points')
);

const ZWNJ = '\\u200C';
const ZWJ = '\\u200D';

/*
// We need to be more precise
const HexDigit = '[0-9a-fA-F]';
// The commented out line below is technically the grammar, with a SyntaxError
//   to occur if larger than U+10FFFF, but we will prevent the error by
//   establishing the limit in regular expressions
// const HexDigits = HexDigit + HexDigit + '*';
const HexDigits = '0*(?:' + HexDigit + '{1,5}|10' + HexDigit + '{4})*';
const Hex4Digits = '(?:' + HexDigits + '){4}';
const UnicodeEscapeSequence = '(?:u' + Hex4Digits + '|u\\{' + HexDigits + '\\})';
*/

// a-zA-Z0-9, surrogates
// const allowUpperCaseHex = (hexDigits) => hexDigits.replace(/[a-f]/g, (n0) => '[' + n0 + n0.toUpperCase() + ']');

const buildRange = (start, last) => {
    let startHex = start.toString(16);
    if (start === last) {
        return '|' + startHex;
    }
    const lastHex = last.toString(16);
    startHex = startHex.padStart(lastHex.length, '0');

    let str = '';
    for (const [i, ch] of Object.entries(startHex)) {
        let chInt = parseInt(ch, 16);
        const lastInt = parseInt(lastHex[i], 16);
        while (chInt < lastInt) {
            str += ch;
            chInt++;
        }
    }

    00A0
    CDEE

    00A[0-9a-f]|
    [1-9ab][0-9a-f]{3}|
    C[0-9a-c][0-9a-f]{2}|
    CD[0-9a-d][0-9a-f]
    CDE[0-9a-e]

    return '|';
};

const getUnicodeEscapeSequence = (regenInst, ...extra) => {
    const ues = regenerate(regenInst, ...extra);

    const cps = ues.toArray();
    let res = '';
    let start = cps[0];
    let last = cps[0];
    for (let i = 1; i < cps.length; i++) {
        const cp = cps[i];
        if (last + 1 === cp) {
            last++;
            continue;
        }
        res += buildRange(start, last);
        // res.push([start, last]);
        start = cp;
        last = cp;
    }
    console.log('res', res);
    return '\\\\u(?:' +
        '(?:' +
            ues.toArray().map((cp) => {
                const HexDigits = cp.toString(16);
                const Hex4Digits = HexDigits.padStart(4, '0');
                return Hex4Digits;
                // return allowUpperCaseHex(Hex4Digits);
            }).join('|') +
        ')|' +
        '\\{0*(?:' +
            ues.toArray().map((cp) => {
                const HexDigits = cp.toString(16);
                return HexDigits;
                // return allowUpperCaseHex(HexDigits);
            }).join('|') +
        ')\\}'
    ')';
};

const UnicodeEscapeSequenceStart = getUnicodeEscapeSequence(UnicodeIDStart, '$', '_');
const UnicodeEscapeSequencePart = getUnicodeEscapeSequence(UnicodeIDContinue, '$', '_', ZWNJ, ZWJ);

// const IdentifierStart = regenerate(UnicodeIDStart, '$', '_', UnicodeEscapeSequenceStart);
// const IdentifierPart = regenerate(UnicodeIDContinue, '$', '_', UnicodeEscapeSequencePart, ZWNJ, ZWJ);
// const IdentifierName = IdentifierStart.toString() + IdentifierPart.toString() + '*';

const IdentifierStart = '(?:' + UnicodeIDStart + '|[$_]|' + UnicodeEscapeSequenceStart + ')';
const IdentifierPart = '(?:' + UnicodeIDContinue + '|[$_]|' + UnicodeEscapeSequencePart + '|' + ZWNJ + '|' + ZWJ + ')';
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
    `module.exports.IdentifierName = /${whole_IdentifierName}/i;`
);
fs.writeFileSync(
    path.join(__dirname, 'dist', 'es-identifiers-browser.js'),
    // `window.ESIdentifiers = ${JSON.stringify(module.exports)};
    `window.ESIdentifiers = {IdentifierName: /${whole_IdentifierName}/i};`
);

// console.log('whole_IdentifierName', whole_IdentifierName);
// console.log(eval(new RegExp(whole_IdentifierName, 'i'))); // .test('\\u0000')));
// const regex = /<%= set.toString() %>/gim;
