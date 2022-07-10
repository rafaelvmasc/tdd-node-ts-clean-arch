import { PasswordEncrypter } from '../interfaces/password-encrypter'
import { DbAddAccountService } from './db-add-account'

interface SutTypes {
  sut: DbAddAccountService
  encrypterStub: PasswordEncrypter
}

const makePasswordEncrypter = (): PasswordEncrypter => {
  class EncrypterStub implements PasswordEncrypter {
    async encryptPassword (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makePasswordEncrypter()
  const sut = new DbAddAccountService(encrypterStub)
  return {
    sut,
    encrypterStub
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
})
