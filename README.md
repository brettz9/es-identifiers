# es-identifiers

Regular expressions of ECMAScript's (Unicode-based) `IdentifierName` production (per
latest available Unicode version, currently 10.0.0).

## Node usage

```js
const {IdentifierName} = require('es-identifiers');
IdentifierName.test(aPurportedIdentifier);
```

## Browser usage

```html
<script src="node_modules/es-identifiers/dist/es-identifiers-browser.js">
```

```js
ESIdentifiers.IdentifierName.test(aPurportedIdentifier);
```
