import { CredentialsEntity } from '../../../domain/entities'

export interface JWTGenerator {
  genToken: (params: JWTGenerator.Params) => Promise<JWTGenerator.Result>
}

export namespace JWTGenerator {
  export type Params = Omit<CredentialsEntity, 'password'>

  export type Result = string
}
