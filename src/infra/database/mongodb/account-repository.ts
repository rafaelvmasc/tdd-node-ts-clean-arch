import { AddAccountRepository, LoadAccountByEmailRepository } from '../../../data/interfaces/database'
import { MongoHelper } from './helpers/mongo-helper'

export class AccountRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const { email, name, password } = params
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(params)
    const { insertedId } = result

    return {
      email,
      name,
      password,
      id: insertedId.toString()
    }
  }

  async loadByEmail (params: LoadAccountByEmailRepository.Params): Promise<LoadAccountByEmailRepository.Result> {
    const { email } = params
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
}
