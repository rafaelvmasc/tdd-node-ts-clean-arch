export interface UpdateAccessTokenRepository {
  updateToken: (params: UpdateAccessTokenRepository.Params) => Promise<void>
}

export namespace UpdateAccessTokenRepository {
  export type Params = {
    token: string
    id: string
  }
}
