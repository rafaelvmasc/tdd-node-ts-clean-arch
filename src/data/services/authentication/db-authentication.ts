import { CredentialsEntity } from '../../../domain/entities'
import { AuthenticationUseCase } from '../../../domain/usecases'
import { LoadAccountByEmailRepository } from '../../interfaces/database'
import { HashComparer, JWTGenerator } from '../../interfaces/cryptography'

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly jwtGenerator: JWTGenerator
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
        const token = await this.jwtGenerator.genToken(account.id)
        return { token }
      }
    }
    return null
  }
}
