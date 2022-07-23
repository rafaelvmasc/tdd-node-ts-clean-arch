import { AddAccountUseCase, LoadUserUseCase } from '../../../domain/usecases'
import { badRequest, conflict, HttpRequest, HttpResponse, serverError, success } from '../../helpers/http/http'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccountUseCase,
    private readonly loadUser: LoadUserUseCase,
    private readonly validation: Validation
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password, name } = httpRequest.body
      const user = await this.loadUser.execute({ email })
      if (user) return conflict()
      const result = await this.addAccount.execute({ email, password, name })

      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
