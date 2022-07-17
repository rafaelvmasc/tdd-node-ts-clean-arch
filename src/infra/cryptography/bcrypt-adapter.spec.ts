import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
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
    const hashSpy = jest.spyOn(bcryptjs, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should call bcrypt compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcryptjs, 'compare')
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
})
