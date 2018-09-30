import merge from 'lodash.merge'
import Ajv from 'ajv'

const ajv = new Ajv({ schemaId: 'id', logger: false })
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

export const SchemaSymbol = Symbol.for('react-json-schema-proptypes')

function getSchema(schema) {
  return schema[SchemaSymbol] || schema
}

export default function(mainSchema, ...otherSchemas) {
  if (typeof mainSchema !== 'object') {
    throw new TypeError('Schema must be of type \'object\'')
  }

  const schema = merge({}, getSchema(mainSchema), ...otherSchemas.map(getSchema))

  if (schema.type !== 'object') {
    throw new Error(`Schema must define an object type (currently: ${schema.type})`)
  }

  const propTypes = { [SchemaSymbol]: schema }

  if (schema.properties) {
    const validate = ajv.compile(schema)

    for (let prop in schema.properties) {
      if (schema.properties.hasOwnProperty(prop)) {
        propTypes[prop] = function(props, propName, componentName) {
          const valid = validate(props)

          if (valid) {
            return null
          }

          const propError = validate.errors.find((e) => new RegExp(`^\.${propName}(\.|$)`).test(e.dataPath) || new RegExp(`^${propName}$`).test(e.params.missingProperty))
          if (!propError) {
            return null
          }

          return new Error(`'${propError.dataPath}' ${propError.message}, found ${JSON.stringify(props[propName])} instead. Check propTypes of component ${componentName}`)
        }
      }
    }
  }

  return propTypes
}
