# unicode-identifiers

Regular expressions of ECMAScript's `IdentifierName` production (per
latest available Unicode version, currently 10.0.0).

## Node usage

```js
const {IdentifierName} = require('unicode-identifiers');
IdentifierName.test(aPurportedIdentifier);
```

## Browser usage

```html
<script src="node_modules/unicode-identifiers/dist/unicode-identifiers-browser.js">
```

```js
UnicodeIdentifiers.IdentifierName.test(aPurportedIdentifier);
```
