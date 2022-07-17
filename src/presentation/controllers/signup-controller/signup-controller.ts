import { AddAccountUseCase } from '../../../domain/usecases'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, HttpRequest, HttpResponse, serverError, success } from '../../helpers'
import { Validation } from '../../helpers/validators/validation'
import { EmailValidator } from '../../protocols'
import { Controller } from '../../protocols/controller'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccountUseCase,
    private readonly emailValidator: EmailValidator,
    private readonly validation: Validation
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation, name } = httpRequest.body
      if (password !== passwordConfirmation) {
        return {
          statusCode: 400,
          body: new InvalidParamError('passwordConfirmation')
        }
      }
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const result = await this.addAccount.execute({ email, password, name })

      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
