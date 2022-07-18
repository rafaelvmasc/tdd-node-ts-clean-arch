import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

jest.mock('jsonwebtoken', () => ({
  async sign () {
    return 'jwt_token'
  }
}))

describe('Jwt Adapter', () => {
  test('Should call sign method with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith('any_id', 'secret')
  })

  test('Should return a token on sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.encrypt('any_id')
    expect(token).toBe('jwt_token')
  })

  test('Should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_id')
    expect(promise).rejects.toThrow()
  })
})
