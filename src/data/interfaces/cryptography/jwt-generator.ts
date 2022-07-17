export interface JWTGenerator {
  genToken: (id: JWTGenerator.Params) => Promise<JWTGenerator.Result>
}

export namespace JWTGenerator {
  export type Params = string

  export type Result = string
}
