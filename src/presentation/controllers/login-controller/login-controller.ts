import { AuthenticationUseCase } from '../../../domain/usecases'
import { badRequest, HttpRequest, HttpResponse, serverError, success, unauthorized } from '../../helpers/http/http'
import { Validation } from '../../helpers/validators/validation'
import { Controller } from '../../protocols/controller'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: AuthenticationUseCase,
    private readonly validation: Validation
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password } = httpRequest.body
      const token = await this.authentication.perform({ email, password })
      if (!token) return unauthorized()
      return success(token)
    } catch (error) {
      return serverError(error)
    }
  }
}
