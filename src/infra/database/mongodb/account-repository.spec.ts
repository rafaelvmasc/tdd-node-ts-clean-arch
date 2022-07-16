import { AccountRepository } from './account-repository'
import { MongoHelper } from './helpers/mongo-helper'

interface SutTypes {
  sut: AccountRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountRepository()
  return {
    sut
  }
}

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const accountCreated = await sut.add(accountData)
    expect(accountCreated).toBeTruthy() // significa que nao é nulo/undefined
    expect(accountCreated.id).toBeTruthy()
    expect(accountCreated.name).toBe('any_name')
    expect(accountCreated.email).toBe('any_email')
    expect(accountCreated.password).toBe('any_password')
  })
})
