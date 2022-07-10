import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

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
})
