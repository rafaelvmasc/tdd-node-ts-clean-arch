export class SignUpController {
  perform (httpRequest: any): any {
    return {
      statusCode: 400,
      body: new Error('Missing params: name')
    }
  }
}
