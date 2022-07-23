export class ServerError extends Error {
  constructor (stack?: string) {
    super()
    this.name = 'ServerError'
    this.stack = stack
  }
}
