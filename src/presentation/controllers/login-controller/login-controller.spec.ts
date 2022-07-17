import { AuthenticationUseCase } from '../../../domain/usecases'
import { MissingParamError, ServerError } from '../../errors'
import { badRequest, unauthorized } from '../../helpers'
import { Validation } from '../../helpers/validators/validation'
import { LoginController } from './login-controller'

interface SutTypes {
  sut: LoginController
  authenticationStub: AuthenticationUseCase
  validationStub: Validation
}

const makeAuthenticationStub = (): AuthenticationUseCase => {
  class AuthenticationStub implements AuthenticationUseCase {
    async perform (): Promise<AuthenticationUseCase.Result> {
      return new Promise(resolve => resolve({
        token: 'valid_token'
      }))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
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
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'perform').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'incorrect_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call validateCredentials with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const validateCredentialsSpy = jest.spyOn(authenticationStub, 'perform')
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
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'perform').mockImplementationOnce(async () => {
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

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('field')))
  })
})
