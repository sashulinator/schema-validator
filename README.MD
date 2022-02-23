#SAV - SUPER AWESOME VALIDATOR

## Simple usage

```ts

const v = new SchemaStructureValidator( handleErrors: ... )

const validateAddress = v.only({
  postcode: string,
  coordinates: v.only({
    longitude: or(number, and(string, notEmptyString)),
    latitude: or(number, and(string, notEmptyString)),
  }),
}),

const errors = validateAddress({
  postcode: 446303
  coordinates: {
    longitude: /longitude/
  }
})

console.log(errors)
// you can create your own error builder by passing a function "handleErrors"
// but just as an example:
//
// postcode: {
//   _code: 'assertString',
//   _input: 446303,
//   _inputName: 'postcode',
//   _message: 'is not a string',
// }
// coordinates: {
//   latitude: {
//     _code: 'assertNumber',
//     _input: undefined,
//     _inputName: 'latitude',
//     _message: 'is not a number',
//   },
//   longitude: {
//     _code: 'assertNumber',
//     _input: 42,
//     _inputName: 'longitude',
//     _message: 'is not a number',
//   },
// },

// also you can validate the nested properties
const longitudeError = validateAddress.coordinates.longitude(/longitude/)

console.log(longitudeError)

// longitude: {
//   _code: 'assertNumber',
//   _input: 42,
//   _inputName: 'longitude',
//   _message: 'is not a number',
// },

```
