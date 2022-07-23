import { AccountEntity } from '../entities'

export interface LoadUserUseCase {
  execute: (params: LoadUserUseCase.Params) => Promise<LoadUserUseCase.Result>
}

export namespace LoadUserUseCase {
  export type Params = {
    email: string
  }

  export type Result = Omit<AccountEntity, 'password'> | null
}
