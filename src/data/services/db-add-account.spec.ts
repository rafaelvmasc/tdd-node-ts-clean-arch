import { AddAccountRepository } from '../interfaces'
import { PasswordEncrypter } from '../interfaces/password-encrypter'
import { DbAddAccountService } from './db-add-account'

interface SutTypes {
  sut: DbAddAccountService
  encrypterStub: PasswordEncrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makePasswordEncrypter = (): PasswordEncrypter => {
  class EncrypterStub implements PasswordEncrypter {
    async encryptPassword (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeaddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      const fakeAccount = {
        email: 'valid_email',
        id: 'valid_id',
        name: 'valid_name',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makePasswordEncrypter()
  const addAccountRepositoryStub = makeaddAccountRepository()
  const sut = new DbAddAccountService(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Service', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encryptPassword')
    const params = {
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email'
    }
    await sut.execute(params)
    expect(encrypterSpy).toHaveBeenCalledWith(params.password)
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encryptPassword').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const params = {
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email'
    }
    const promise = sut.execute(params)
    expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const params = {
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email'
    }
    await sut.execute(params)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      password: 'hashed_password',
      email: 'valid_email'
    })
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const params = {
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email'
    }
    const promise = sut.execute(params)
    expect(promise).rejects.toThrow()
  })
})
