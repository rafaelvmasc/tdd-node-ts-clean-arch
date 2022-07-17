import { AddAccountUseCase } from '../../../domain/usecases'
import { badRequest, HttpRequest, HttpResponse, serverError, success } from '../../helpers/http/http'
import { Validation } from '../../helpers/validators/validation'
import { Controller } from '../../protocols/controller'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccountUseCase,
    private readonly validation: Validation
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password, name } = httpRequest.body
      const result = await this.addAccount.execute({ email, password, name })

      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
