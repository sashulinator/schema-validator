# SAV - SUPER AWESOME VALIDATOR

## Simple validators

```ts
const addressValidator = only({
  street: string,
  building: and(string, notEmptyString),
})

const userValidator = only({
  username: and(string, notEmptyString),
  fullname: or(string, _undefined),
  password: and(string, notEmptyString),
  email: withValue(/@.*\.*./, matchPattern),
  address: addressValidator
})
```

## Simple usage

```ts
userValidator.bind({
  handleError: createAwesomeErrorStructure
})

const errors = userValidator({
  username: 'sashulinator',
  password: 'p@ssword',
  email: 'test@test.test',
  fullname: 'Alexander',
  address: {
    street: 'red light',
    building: 42,
  }
})

console.log(errors)
// the errors structure depends on your "createAwesomeErrorStructure" function
// but it could be something like this:
// {
//   address: {
//     building: {
//       _code: 'assertString',
//       _input: 42,
//       _inputName: 'building',
//       _message: 'is not a string',
//     }
//   }
// }
//
// or
//
// [
//   {
//       _path: 'address.building'
//       _code: 'assertString',
//       _input: 1,
//       _inputName: 'building',
//       _message: 'is not a string',
//    }
// ]
```

## Features

### Your own error structure
In UI we use different form state managers and they demand different error structure

```ts
const buildErrorArray = (
  myErrorCollection: ValidationError[] = [],
  validationErrorOrMyErrorCollection?: ValidationError | ValidationError[],
): ValidationError[] => {
  if (validationErrorOrMyErrorCollection instanceof ValidationError) {
    myErrorCollection.push(validationErrorOrMyErrorCollection)
  } else if (Array.isArray(validationErrorOrMyErrorCollection)) {
    return [...myErrorCollection, ...validationErrorOrMyErrorCollection]
  }

  return myErrorCollection
}

const bindedWrap1 = wrap.bind({ handleError: buildErrorArray }) as typeof wrap

const credentialsValidator = bindedWrap1({
  username: and(string, notEmptyString),
  password: and(string, notEmptyString),
})

credentialsValidator.bind({ handleError: buildAnotherErrorStructureInThisStepIfYouWouldLike })({
  username: 'sashulinator',
  password: 'p@ssword',
})
```

### Access to nested fields

```ts
const validator = only(required({
  test: only({
    test42: string
  })
}))

const error = validator.test.test42(1)
// {
//   _message: 'is not a string',
//   _inputName: 'test42',
//   _input: 1,
//   _code: 'assertString',
// }
```

### Functions to build error structure
If you use [final-form](https://www.npmjs.com/package/final-form) you will like `buildErrorTree` function

```ts
import { buildErrorTree, buildErrorArray } from '@savchenko91/schema-validator'

const bindedWrap = wrap.bind({ handleError: buildErrorTree }) as typeof wrap
const bindedWrap2 = wrap.bind({ handleError: buildErrorArray }) as typeof wrap
```

### Your own structure validator

If you would like to create your own structure validator like `only` and `require`, you should use `createStructureValidator`

```ts
import { createStructureValidator, ValidationError, string } from '@savchenko91/schema-validator'

export const objectNotEmpty = createStructureValidator((schema, input, meta) => {
  if (isObject(input) && Object.keys(input) === 0) {
    return new ValidationError({
      inputName: meta?.inputName,
      input: '{}',
      code: 'emptyObject',
      message: 'object is empty',
    })
  }

  return undefined
})

const validator = objectNotEmpty.bind({ handleError })({
  test: string
}
```


