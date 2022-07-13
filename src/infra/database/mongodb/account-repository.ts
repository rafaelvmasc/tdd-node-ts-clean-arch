import { AddAccountRepository } from '../../../data/interfaces'
import { MongoHelper } from './helpers/mongo-helper'

export class AccountRepository implements AddAccountRepository {
  async add (params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const { email, name, password } = params
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(params)
    const { insertedId } = result

    return {
      email,
      name,
      password,
      id: insertedId.toString()
    }
  }
}
