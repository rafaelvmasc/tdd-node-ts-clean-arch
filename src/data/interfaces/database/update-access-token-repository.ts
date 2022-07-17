export interface UpdateAccessTokenRepository {
  updateToken: (token: UpdateAccessTokenRepository.Params) => Promise<void>
}

export namespace UpdateAccessTokenRepository {
  export type Params = {
    token: string
    id: string
  }
}
