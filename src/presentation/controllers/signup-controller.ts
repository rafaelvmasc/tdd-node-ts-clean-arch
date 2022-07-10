import { InvalidParamError, MissingParamError } from '../errors'

export class SignUpController {
  perform (httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new MissingParamError('password')
      }
    }
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return {
        statusCode: 400,
        body: new InvalidParamError('passwordConfirmation')
      }
    }
  }
}
