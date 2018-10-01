# json-schema-to-proptypes

Transform [JSON Schema](https://json-schema.org/) schemas to [PropTypes](https://www.npmjs.com/package/prop-types).

This package was imported from and is a subset of https://github.com/dowjones/react-json-schema-proptypes. Doesn't depend on `React` nor on `PropTypes` packages.

Supports JSON Schema draft-04 schemas conversion to a custom PropType function that will validate against that schema.


## Usage

Install with:

```
npm install json-schema-to-proptypes
```

Use like:

```javascript
import jsonSchemaToPropTypes from 'json-schema-to-proptypes'

const mySchema = {
  type: 'object',
  required: ['a'],
  properties: {
    a: { type: 'string' },
    b: { type: 'string' }
  }
}

const myPropTypes = jsonSchemaToPropTypes(mySchema)
// use myPropTypes however you want, with React etc
```
