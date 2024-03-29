import { LogErrorRepository } from '../../data/interfaces/database'
import { HttpRequest, HttpResponse } from '../../presentation/helpers/http/http'
import { Controller } from '../../presentation/protocols/controller'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.perform(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
