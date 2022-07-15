import { CredentialsEntity } from '../entities'

export interface ValidateCredentialsUseCase {
  perform: (params: ValidateCredentialsUseCase.Params) => Promise<ValidateCredentialsUseCase.Result>
}

export namespace ValidateCredentialsUseCase {
  export type Params = CredentialsEntity

  export type Result = {
    token: string
  } | false
}
