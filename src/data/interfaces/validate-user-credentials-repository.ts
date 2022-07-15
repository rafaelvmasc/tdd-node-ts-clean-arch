import { CredentialsEntity } from '../../domain/entities'

export interface ValidateUserCredentialsRepository {
  checkUser: (params: ValidateUserCredentialsRepository.Params) => Promise<ValidateUserCredentialsRepository.Result>
}

export namespace ValidateUserCredentialsRepository {
  export type Params = CredentialsEntity

  export type Result = boolean
}
