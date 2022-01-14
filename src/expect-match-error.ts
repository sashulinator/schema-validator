export default async function expectMatchError(
  cb: () => void | Error | Record<string, unknown>,
  obj: Error | Record<string, unknown>,
): Promise<void> {
  let error: Error | void | Record<string, unknown>

  try {
    error = await cb()

    if (!error) {
      throw new Error('Function `expectMatchError` should return or throw an error!')
    }
  } catch (e) {
    if (e instanceof Error) {
      error = e
    }
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return expect(JSON.parse(JSON.stringify(obj))).toMatchObject(JSON.parse(JSON.stringify(error)))
  }
}
