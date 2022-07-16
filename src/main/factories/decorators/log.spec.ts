import { HttpRequest, HttpResponse } from '../../../presentation/helpers'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
      const fakeHttpResponse = {
        statusCode: 200,
        body: {
          name: 'Rafael'
        }
      }
      return new Promise(resolve => resolve(fakeHttpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call injected controller perform method', async () => {
    const { sut, controllerStub } = makeSut()
    const performSpy = jest.spyOn(controllerStub, 'perform')
    const httpRequest = {
      body: {
        email: 'any_email',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.perform(httpRequest)
    expect(performSpy).toHaveBeenCalledWith(httpRequest)
  })
})
