export interface HashComparer {
  compare: (params: HashComparer.Params) => Promise<HashComparer.Result>
}

export namespace HashComparer {
  export type Params = {
    inputPassword: string
    hashPassword: string
  }

  export type Result = boolean
}
