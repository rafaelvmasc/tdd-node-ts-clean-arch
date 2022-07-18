import { HttpRequest, HttpResponse } from '../helpers/http/http'

export interface Controller {
  perform: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
