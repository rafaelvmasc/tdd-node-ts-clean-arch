export class SignUpController {
  perform (httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing params: name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing params: email')
      }
    }
    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new Error('Missing params: password')
      }
    }
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return {
        statusCode: 400,
        body: new Error('Invalid params: passwordConfirmation')
      }
    }
  }
}
