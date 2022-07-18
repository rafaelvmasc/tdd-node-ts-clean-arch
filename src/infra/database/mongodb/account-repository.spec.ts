import { Collection } from 'mongodb'
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

let accountCollection: Collection

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const accountCreated = await sut.add(accountData)
    expect(accountCreated).toBeTruthy()
    expect(accountCreated.id).toBeTruthy()
    expect(accountCreated.name).toBe('any_name')
    expect(accountCreated.email).toBe('any_email')
    expect(accountCreated.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    const account = await sut.loadByEmail({
      email: 'any_email'
    })
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email')
    expect(account?.password).toBe('any_password')
  })

  test('Should return null on loadByEmail failure', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail({
      email: 'any_email'
    })
    expect(account).toBeFalsy()
  })

  test('Should update the account access token on updateAccessToken success', async () => {
    const { sut } = makeSut()
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    const fakeAccount = await accountCollection.findOne({ _id: insertedId })
    expect(fakeAccount?.accessToken).toBeFalsy()
    const payload = {
      id: fakeAccount?._id,
      token: 'any_token'
    }
    await sut.updateToken(payload)
    const account = await accountCollection.findOne({ _id: fakeAccount?._id })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toEqual('any_token')
  })
})
