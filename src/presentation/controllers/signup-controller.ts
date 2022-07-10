import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, HttpRequest, HttpResponse } from '../helpers'

export class SignUpController {
  perform (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return {
        statusCode: 400,
        body: new InvalidParamError('passwordConfirmation')
      }
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
