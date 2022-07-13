import { ValidateCredentialsUseCase } from '../../domain/usecases'
import { MissingParamError } from '../errors'
import { badRequest, HttpRequest, HttpResponse, success, unauthorized } from '../helpers'
import { Controller } from '../protocols/controller'

export class LoginController implements Controller {
  constructor (
    private readonly validateCredentialsStub: ValidateCredentialsUseCase
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email, password } = httpRequest.body
    const isAuthorized = await this.validateCredentialsStub.perform({ email, password })
    if (!isAuthorized) return unauthorized()
    return success({})
  }
}
