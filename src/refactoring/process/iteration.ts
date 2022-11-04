import { Scene } from '../types'
import { process } from './process'

export function iteration<TErrorCollection>(
  inputName: string | number,
  path: (string | number)[],
  input: unknown,
  schemaItem: Scene['schemaItem'],
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene.path = [...path, inputName]
  scene.input = input
  scene.schemaItem = schemaItem
  scene.inputName = inputName

  return process(scene)
}
