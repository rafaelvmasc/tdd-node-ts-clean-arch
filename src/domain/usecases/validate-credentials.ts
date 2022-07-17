import { CredentialsEntity } from '../entities'

export interface AuthenticationUseCase {
  perform: (params: AuthenticationUseCase.Params) => Promise<AuthenticationUseCase.Result>
}

export namespace AuthenticationUseCase {
  export type Params = CredentialsEntity

  export type Result = {
    token: string
  } | false
}
