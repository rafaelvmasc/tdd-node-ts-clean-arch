import { AddAccountRepository } from '../../interfaces/database'
import { Hasher } from '../../interfaces/cryptography/hasher'
import { DbAddAccountService } from './db-add-account'

interface SutTypes {
  sut: DbAddAccountService
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccountData = (): AddAccountRepository.Params => ({
  name: 'valid_name',
  password: 'valid_password',
  email: 'valid_email'
})

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeaddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      const fakeAccount = {
        email: 'valid_email',
        id: 'valid_id',
        name: 'valid_name',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeaddAccountRepository()
  const sut = new DbAddAccountService(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Service', () => {
  test('Should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.execute(makeFakeAccountData())
    expect(hasherSpy).toHaveBeenCalledWith(makeFakeAccountData().password)
  })

  test('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.execute(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.execute(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      password: 'hashed_password',
      email: 'valid_email'
    })
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.execute(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(makeFakeAccountData())
    expect(result).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      password: 'hashed_password',
      email: 'valid_email'
    })
  })
})
