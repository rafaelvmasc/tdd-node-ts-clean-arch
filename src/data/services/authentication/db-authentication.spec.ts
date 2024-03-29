import { AccountEntity } from '../../../domain/entities'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../interfaces/database'
import { HashComparer, Encrypter } from '../../interfaces/cryptography'
import { DbAuthenticationUseCase } from './db-authentication'

interface SutTypes {
  sut: DbAuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  encrypterStub: Encrypter
  hashComparerStub: HashComparer
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeJwtGeneratorStub = (): Encrypter => {
  class JwtGeneratorStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return new Promise(resolve => resolve('valid_token'))
    }
  }
  return new JwtGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateToken (params: UpdateAccessTokenRepository.Params): Promise<void> {

    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (params: LoadAccountByEmailRepository.Params): Promise<LoadAccountByEmailRepository.Result> {
      const fakeAccount: AccountEntity = {
        name: 'any_name',
        id: 'any_id',
        password: 'hashed_password',
        email: 'any_email@mail.com'
      }
      return new Promise((resolve) => resolve(fakeAccount))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (params: HashComparer.Params): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const encrypterStub = makeJwtGeneratorStub()
  const hashComparerStub = makeHashComparer()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthenticationUseCase(loadAccountByEmailRepositoryStub, updateAccessTokenRepositoryStub, hashComparerStub, encrypterStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    encrypterStub,
    hashComparerStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbValidateCredentials Service', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    await sut.perform(params)

    expect(loadByEmailSpy).toHaveBeenCalledWith({
      email: 'any_email'
    })
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.perform(params)
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    const token = await sut.perform(params)
    expect(token).toBeFalsy()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const params = {
      email: 'valid_email',
      password: 'valid_password'
    }
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.perform(params)
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const params = {
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.perform(params)

    expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const params = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const token = await sut.perform(params)
    expect(token).toEqual({
      token: 'valid_token'
    })
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    await sut.perform(params)
    expect(compareSpy).toHaveBeenCalledWith({
      inputPassword: 'any_password',
      hashPassword: 'hashed_password'
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.perform(params)
    expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )
    const token = await sut.perform({
      email: 'any_email',
      password: 'any_password'
    })
    expect(token).toBeNull()
  })

  test('Should call UpdateAccessTokenRepository with correct id', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken')
    await sut.perform({
      email: 'any_email',
      password: 'any_password'
    })
    expect(updateTokenSpy).toHaveBeenCalledWith({
      token: 'valid_token',
      id: 'any_id'
    })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const params = {
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.perform(params)
    expect(promise).rejects.toThrow()
  })
})
