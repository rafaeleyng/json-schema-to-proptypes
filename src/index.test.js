/* eslint-env jest */
import jsonSchemaToPropTypes, { SchemaSymbol } from '.'

describe('jsonSchemaToPropTypes', () => {
  let schema
  let validators

  beforeEach(() => {
    schema = {
      type: 'object',
      description: 'PropTypes for some component',
      properties: {
        id: {
          type: 'string',
        },
      },
    }

    validators = jsonSchemaToPropTypes(schema)
  })

  it('throws if json schema is not an object', () => {
    const otherSchema = ''
    expect(() => jsonSchemaToPropTypes(otherSchema)).toThrowErrorMatchingSnapshot()
  })

  it('throws if json schema\'s type is not "object"', () => {
    const otherSchema = {
      type: 'string',
    }

    expect(() => jsonSchemaToPropTypes(otherSchema)).toThrowErrorMatchingSnapshot()
  })

  it('creates a proptype validator for each prop', () => {
    Object.keys(schema.properties).forEach((propKey) => {
      expect(validators[propKey]).toBeDefined()
      expect(typeof validators[propKey]).toBe('function')
    })
  })

  it('exposes the schema that it is using to validate', () => {
    const propTypes = jsonSchemaToPropTypes(schema)
    expect(propTypes[SchemaSymbol]).toEqual(schema)
  })

  it('hides the schema from enumerable properties', () => {
    const propTypes = jsonSchemaToPropTypes(schema)
    expect(Object.keys(propTypes)).toEqual(['id'])
  })

  it('can take existing proptypes as an argument', () => {
    const newSchema = {
      [SchemaSymbol]: schema,
    }

    const propTypes = jsonSchemaToPropTypes(newSchema)
    expect(Object.keys(propTypes)).toEqual(['id'])
  })

  it('deep merges multiple schemas together', () => {
    const updates = {
      properties: {
        name: {
          type: 'string',
        },
      },
    }

    const propTypes = jsonSchemaToPropTypes(schema, updates)
    expect(Object.keys(propTypes)).toEqual(['id', 'name'])
  })

  describe('validator', () => {
    it('validates correctly based on the property it references', () => {
      const propTypes = jsonSchemaToPropTypes(schema)
      expect(propTypes.id({ id: 15 }, 'id')).toMatchSnapshot()
      expect(propTypes.id({ id: 'hello' }, 'id')).toMatchSnapshot()
    })

    it('respects required properties', () => {
      const propTypes = jsonSchemaToPropTypes({
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
          b: { type: 'string' },
        },
      })

      expect(propTypes.a({}, 'a')).toMatchSnapshot()
      expect(propTypes.b({}, 'b')).toMatchSnapshot()
    })

    it('error on deep (nested) validation errors', () => {
      const propTypes = jsonSchemaToPropTypes({
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              b: { type: 'string' },
            },
          },
          c: { type: 'number' },
        },
      })
      expect(propTypes.a({ a: { b: 1 }, c: 1 }, 'a')).toMatchSnapshot()
      expect(propTypes.c({ a: { b: '1' }, c: 'dsasd' }, 'c')).toMatchSnapshot()
    })
  })
})
