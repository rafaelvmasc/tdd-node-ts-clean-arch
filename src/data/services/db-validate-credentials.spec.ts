import { CredentialsEntity } from '../../domain/entities'
import { JWTGenerator, ValidateUserCredentialsRepository } from '../interfaces'
import { DbValidateCredentialsService } from './db-validate-credentials'

interface SutTypes {
  sut: DbValidateCredentialsService
  validateUserCredentialsRepositoryStub: ValidateUserCredentialsRepository
  jwtGeneratorStub: JWTGenerator
}

const makeJwtGeneratorStub = (): JWTGenerator => {
  class JwtGeneratorStub implements JWTGenerator {
    async genToken (params: CredentialsEntity): Promise<string> {
      return new Promise(resolve => resolve('valid_token'))
    }
  }
  return new JwtGeneratorStub()
}

const makeValidateUserCredentialsRepositoryStub = (): ValidateUserCredentialsRepository => {
  class ValidateUserCredentialsRepositoryStub implements ValidateUserCredentialsRepository {
    async checkUser (params: ValidateUserCredentialsRepository.Params): Promise<ValidateUserCredentialsRepository.Result> {
      return new Promise((resolve) => resolve(true))
    }
  }
  return new ValidateUserCredentialsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const validateUserCredentialsRepositoryStub = makeValidateUserCredentialsRepositoryStub()
  const jwtGeneratorStub = makeJwtGeneratorStub()
  const sut = new DbValidateCredentialsService(validateUserCredentialsRepositoryStub, jwtGeneratorStub)
  return {
    sut,
    validateUserCredentialsRepositoryStub,
    jwtGeneratorStub
  }
}

describe('DbValidateCredentials Service', () => {
  test('Should call validateUserCredentialsRepository with correct values', async () => {
    const { sut, validateUserCredentialsRepositoryStub } = makeSut()
    const checkUserSpy = jest.spyOn(validateUserCredentialsRepositoryStub, 'checkUser')
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    await sut.perform(params)

    expect(checkUserSpy).toHaveBeenCalledWith(params)
  })

  test('Should call JWTGenerator with correct values', async () => {
    const { sut, jwtGeneratorStub } = makeSut()
    const params = {
      email: 'valid_email',
      password: 'valid_password'
    }
    const genTokenSpy = jest.spyOn(jwtGeneratorStub, 'genToken')
    await sut.perform(params)
    expect(genTokenSpy).toHaveBeenCalledWith({
      email: 'valid_email'
    })
  })

  // test('Should throw if JWTGenerator throws', async () => {
  //   const { sut, jwtGeneratorStub } = makeSut()
  //   jest.spyOn(jwtGeneratorStub, 'genToken')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const params = {
  //     email: 'valid_email',
  //     password: 'valid_password'
  //   }
  //   const promise = await sut.perform(params)

  //   expect(promise).rejects.toThrow()
  // })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const params = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const result = await sut.perform(params)
    expect(result).toEqual({
      token: 'valid_token'
    })
  })

  // test('Should throw if validateUserCredentialsRepository throws', async () => {
  //   const { sut, validateUserCredentialsRepositoryStub } = makeSut()
  //   jest.spyOn(validateUserCredentialsRepositoryStub, 'checkUser')
  //     .mockReturnValueOnce(
  //       new Promise((resolve, reject) => reject(new Error()))
  //     )
  //   const params = {
  //     email: 'any_email',
  //     password: 'any_password'
  //   }
  //   const promise = await sut.perform(params)
  //   expect(promise).rejects.toThrow()
  // })
})
