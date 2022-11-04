import { Scene } from '../types'
import { process } from './process'

export function iteration<TErrorCollection>(
  inputName: string,
  input: unknown,
  schemaItem: Scene['schemaItem'],
  scene: Scene<TErrorCollection>,
): Promise<TErrorCollection | undefined> | TErrorCollection | undefined {
  const path: string[] = [...scene.path, inputName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene.inputObject = scene.input as any
  scene.input = input
  scene.schemaItem = schemaItem
  scene.inputName = inputName
  scene.path = path

  return process(scene)
}
