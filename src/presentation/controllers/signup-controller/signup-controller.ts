import { AddAccountUseCase } from '../../../domain/usecases'
import { badRequest, conflict, HttpRequest, HttpResponse, serverError, success } from '../../helpers/http/http'
import { Validation } from '../../protocols/validation'
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
      if (!result) return conflict(`${email} is already in use`)

      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
