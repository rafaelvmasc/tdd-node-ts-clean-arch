import { CredentialsEntity } from '../../../domain/entities'
import { AuthenticationUseCase } from '../../../domain/usecases'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../interfaces/database'
import { HashComparer, Encrypter } from '../../interfaces/cryptography'

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async perform (params: CredentialsEntity): Promise<AuthenticationUseCase.Result> {
    const { email, password } = params
    const account = await this.loadAccountByEmail.loadByEmail({ email })
    if (account) {
      const isValid = await this.hashComparer.compare({
        inputPassword: password,
        hashPassword: account.password
      })
      if (isValid) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateToken({
          id: account.id,
          token
        })
        return { token }
      }
    }
    return null
  }
}
