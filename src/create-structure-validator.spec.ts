import {
  and,
  ANY_KEY,
  buildErrorTree,
  createStructureValidator,
  ignorePattern,
  keyDoesNotExist,
  notEmptyString,
  or,
  string,
  withValue,
  wrap,
} from '.'

const wrap1 = wrap.bind({
  handleError: buildErrorTree,
}) as typeof wrap

const schemaValidator = wrap1({
  id: string,
  title: and(string, notEmptyString, withValue(/\W+/, ignorePattern)),
  type: string,
  comps: wrap({
    [ANY_KEY]: wrap({
      id: string,
      compSchemaId: and(string, notEmptyString),
      name: or(string, keyDoesNotExist),
      props: or(
        {
          label: or(string, keyDoesNotExist),
        },
        keyDoesNotExist,
      ),
      children: or([string], keyDoesNotExist),
    }),
  }),
})

const validFields = {
  id: 'string',
  title: 'string',
  type: 'string',
  comps: {
    testId: {
      id: 'string',
      compSchemaId: 'string',
      name: 'string',
      props: {
        label: 'string',
      },
      children: ['string'],
    },
  },
}

describe(`${createStructureValidator.name}`, () => {
  describe(`array`, () => {
    //
    const validator = wrap1([string])

    it('valid', async () => {
      const error = validator(['string'])

      expect(error).toBeUndefined()
    })

    it('invalid', async () => {
      const error = validator([1])

      expect(error).toEqual({ '0': { _code: 'assertString', _input: 1, _inputName: '0', _message: 'is not a string' } })
    })

    it('complext schema is valid', async () => {
      const error = schemaValidator(validFields)

      expect(error).toEqual(undefined)
    })

    it('complext schema is invalid', async () => {
      const error = schemaValidator({ ...validFields, type: 12 })

      expect(error).toEqual({
        type: { _code: 'assertString', _input: 12, _inputName: 'type', _message: 'is not a string' },
      })
    })

    it('complext schema is invalid deep', async () => {
      const error = schemaValidator({
        ...validFields,
        comps: { someId: { compSchemaId: 'compId', id: 'id', props: { label: 1 } } },
      })

      expect(error).toEqual({
        comps: {
          someId: {
            props: {
              label: {
                _code: 'assertString',
                _input: 1,
                _inputName: 'label',
                _message: 'is not a string',
              },
            },
          },
        },
      })
    })
  })

  it('validate through chain', async () => {
    const error: any = schemaValidator.id(1)

    expect({ ...error }).toEqual({ _code: 'assertString', _input: 1, _inputName: 'id', _message: 'is not a string' })
  })
})
