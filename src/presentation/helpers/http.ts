export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  body?: any
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
