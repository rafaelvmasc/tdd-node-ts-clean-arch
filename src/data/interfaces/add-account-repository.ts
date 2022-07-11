import { AccountEntity } from '../../domain/entities'

export interface AddAccountRepository {
  add: (params: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = AccountEntity
}
