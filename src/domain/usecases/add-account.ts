import { AccountEntity } from '../entities'

export interface AddAccountUseCase {
  execute: (params: AddAccountUseCase.Params) => Promise<AddAccountUseCase.Result>
}

export namespace AddAccountUseCase {
  export type Params = {
    name: string
    password: string
    email: string
  }

  export type Result = AccountEntity
}
