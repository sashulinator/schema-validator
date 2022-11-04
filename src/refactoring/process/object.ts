import { isObject } from '../../is'
import { ANY_KEY } from '../../types'
import { catchError } from '../catch-error'
import { ValidationError } from '../errors/validation'
import { Scene } from '../types'
import { process } from './process'

export function processObject<TErrorCollection>(
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  if (!isObject(scene.input)) {
    return catchError(
      new ValidationError({
        message: 'is not an object',
        code: processObject.name,
        input: scene.input,
        inputName: scene.path[scene.path.length - 1],
        path: scene.path,
      }),
      scene,
    )
  }

  const schemaEntries = Object.entries(scene.schemaItem)
  const inputEntries = Object.entries(scene.input)

  const isAnyKey = schemaEntries.length === 1 && schemaEntries[0][0] === ANY_KEY

  if (isAnyKey) {
    for (let index = 0; index < inputEntries.length; index += 1) {
      const [inputName, input] = inputEntries[index]
      const [, schemaItem] = schemaEntries[0]
      return handleIteration(inputName, input, schemaItem)
    }
  } else {
    for (let index = 0; index < schemaEntries.length; index += 1) {
      const [inputName, schemaItem] = schemaEntries[index]
      const input = scene.input[inputName]

      if (ANY_KEY === inputName) {
        throw new Error('Schema with "ANY_KEY" must contain only one value with this key')
      }

      return handleIteration(inputName, input, schemaItem)
    }
  }

  // Private

  function handleIteration(inputName: string, input: unknown, schemaItem: Scene['schemaItem']) {
    const path: string[] = [...scene.path, inputName]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scene.inputObject = scene.input as any
    scene.input = input
    scene.schemaItem = schemaItem
    scene.inputName = inputName
    scene.path = path

    return process(scene)
  }
}
