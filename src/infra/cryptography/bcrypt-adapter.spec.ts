import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
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
    await sut.encryptPassword('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encryptPassword('any_value')
    expect(hash).toBe('hash')
  })
})
