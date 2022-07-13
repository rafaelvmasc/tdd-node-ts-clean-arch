import { ValidateCredentialsUseCase } from '../../domain/usecases'
import { MissingParamError } from '../errors'
import { LoginController } from './login-controller'

interface SutTypes {
  sut: LoginController
  validateCredentialsStub: ValidateCredentialsUseCase
}

const makeValidateCredentialsStub = (): ValidateCredentialsUseCase => {
  class ValidateCredentialsStub implements ValidateCredentialsUseCase {
    async perform (): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidateCredentialsStub()
}

const makeSut = (): SutTypes => {
  const validateCredentialsStub = makeValidateCredentialsStub()
  const sut = new LoginController(validateCredentialsStub)
  return {
    sut,
    validateCredentialsStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should return 401 if credentials are not valid', async () => {
    const { sut, validateCredentialsStub } = makeSut()
    jest.spyOn(validateCredentialsStub, 'perform').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'incorrect_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })
})
