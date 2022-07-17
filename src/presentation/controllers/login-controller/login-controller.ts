import { AuthenticationUseCase } from '../../../domain/usecases'
import { MissingParamError } from '../../errors'
import { badRequest, HttpRequest, HttpResponse, serverError, success, unauthorized } from '../../helpers'
import { Controller } from '../../protocols/controller'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: AuthenticationUseCase
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isAuthorized = await this.authentication.perform({ email, password })
      if (!isAuthorized) return unauthorized()
      const { token } = isAuthorized
      return success({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
