import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, HttpRequest, HttpResponse } from '../helpers'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
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
