import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, HttpRequest, HttpResponse } from '../helpers'

export class SignUpController {
  perform (httpRequest: HttpRequest): HttpResponse {
    const requiredField = ['name', 'email', 'password']
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
