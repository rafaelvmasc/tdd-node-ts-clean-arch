import { AddAccountUseCase } from '../../../domain/usecases'
import { ServerError } from '../../errors'
import { badRequest, HttpRequest, success } from '../../helpers'
import { Validation } from '../../helpers/validators/validation'
import { SignUpController } from './signup-controller'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccountUseCase
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      email: 'any_email@mail.com'
    }
  }
}

const makeAddAccount = (): AddAccountUseCase => {
  class AddAccountStub implements AddAccountUseCase {
    async execute (params: AddAccountUseCase.Params): Promise<AddAccountUseCase.Result> {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'execute')
    const httpRequest = makeFakeRequest()
    await sut.perform(httpRequest)
    const { name, email, password } = httpRequest.body
    expect(addAccountSpy).toBeCalledWith({ name, email, password })
  })

  test('Should return 500 if email validator throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'execute').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(success({
      id: 'valid_id',
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email@mail.com'
    }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.perform(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('Should 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
})
