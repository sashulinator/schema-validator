#SAV - SUPER AWESOME VALIDATOR

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

