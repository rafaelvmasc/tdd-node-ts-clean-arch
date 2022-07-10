import { AccountEntity } from '../../domain/entities'
import { AddAccountUseCase } from '../../domain/usecases'
import { PasswordEncrypter } from '../interfaces/password-encrypter'

export class DbAddAccountService implements AddAccountUseCase {
  constructor (
    private readonly encryptPassword: PasswordEncrypter
  ) {}

  async execute (params: AddAccountUseCase.Params): Promise<AccountEntity> {
    const { password } = params
    await this.encryptPassword.encryptPassword(password)
    return {
      email: 'a',
      id: 'a',
      name: 'a',
      password: 'a'
    }
  }
}
