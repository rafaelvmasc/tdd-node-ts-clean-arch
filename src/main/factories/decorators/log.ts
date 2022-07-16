import { HttpRequest, HttpResponse } from '../../../presentation/helpers'
import { Controller } from '../../../presentation/protocols/controller'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.perform(httpRequest)
    return new Promise(resolve => resolve({ body: {}, statusCode: 1 }))
  }
}
