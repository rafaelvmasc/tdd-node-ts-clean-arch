import { HttpRequest } from '../../presentation/helpers'
import { Controller } from '../../presentation/protocols/controller'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.perform(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
