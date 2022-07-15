import { ValidateCredentialsUseCase } from '../../../domain/usecases'
import { MissingParamError, ServerError } from '../../errors'
import { LoginController } from './login-controller'

interface SutTypes {
  sut: LoginController
  validateCredentialsStub: ValidateCredentialsUseCase
}

const makeValidateCredentialsStub = (): ValidateCredentialsUseCase => {
  class ValidateCredentialsStub implements ValidateCredentialsUseCase {
    async perform (): Promise<ValidateCredentialsUseCase.Result> {
      return new Promise(resolve => resolve({
        token: 'valid_token'
      }))
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
    expect(httpResponse.body).toEqual({ token: 'valid_token' })
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

  test('Should call validateCredentials with correct values', async () => {
    const { sut, validateCredentialsStub } = makeSut()
    const validateCredentialsSpy = jest.spyOn(validateCredentialsStub, 'perform')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.perform(httpRequest)
    expect(validateCredentialsSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if ValidateCredentials service throws', async () => {
    const { sut, validateCredentialsStub } = makeSut()
    jest.spyOn(validateCredentialsStub, 'perform').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
