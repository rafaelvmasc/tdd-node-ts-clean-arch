import { HttpRequest, HttpResponse } from '../../../presentation/helpers'
import { Controller } from '../../../presentation/protocols/controller'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.perform(httpRequest)
    return httpResponse
  }
}
