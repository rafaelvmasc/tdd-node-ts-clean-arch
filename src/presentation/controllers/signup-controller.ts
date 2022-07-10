import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, HttpRequest, HttpResponse, serverError } from '../helpers'
import { EmailValidator } from '../protocols'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      const isEmailValid = await this.emailValidator.isValid(httpRequest.body.email)
      if (!isEmailValid) return badRequest(new InvalidParamError('email'))
      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return serverError()
    }
  }
}
