import { HttpRequest, HttpResponse } from '../helpers'

export interface Controller {
  perform: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
