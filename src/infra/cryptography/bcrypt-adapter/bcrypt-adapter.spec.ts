import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

interface SutTypes {
  sut: BCryptAdapter
}
const salt = 12

const makeSut = (): SutTypes => {
  const sut = new BCryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    expect(promise).rejects.toThrow()
  })

  test('Should call bcrypt compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    const input = {
      inputPassword: 'password',
      hashPassword: 'hashed_password'
    }
    await sut.compare(input)
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  })

  test('Should return true on compare success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare({
      inputPassword: 'password',
      hashPassword: 'hashed_password'
    })
    expect(isValid).toBe(true)
  })

  test('Should return false on compare failure', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValid = await sut.compare({
      inputPassword: 'password',
      hashPassword: 'hashed_password'
    })
    expect(isValid).toBe(false)
  })

  test('Should throw if compare throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare({
      inputPassword: 'any_value',
      hashPassword: 'any_hash'
    })
    expect(promise).rejects.toThrow()
  })
})
