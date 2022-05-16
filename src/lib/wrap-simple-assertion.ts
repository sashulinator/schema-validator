import { Assertion, Meta, Schema } from '..'
import { emitAssertion } from '../emit-assertion'

export default function passContextToEmitter(
  ctxThis: unknown,
  asserionOrSmthElse: Schema<unknown>,
  inputName: string,
  emitStructureAssertion: (...args: unknown[]) => unknown,
): Schema<unknown> {
  if (typeof asserionOrSmthElse !== 'function') {
    return asserionOrSmthElse
  }

  const assertion = asserionOrSmthElse as Assertion

  return function wrappedAssertion(input: unknown, meta: Meta) {
    if (emitStructureAssertion.name === asserionOrSmthElse.name) {
      return emitAssertion(assertion.bind(ctxThis), input, { ...meta, inputName })
    }

    return emitAssertion(assertion, input, { ...meta, inputName })
  }
}
