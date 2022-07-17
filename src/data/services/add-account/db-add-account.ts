import { AccountEntity } from '../../../domain/entities'
import { AddAccountUseCase } from '../../../domain/usecases'
import { AddAccountRepository } from '../../interfaces/database'
import { PasswordEncrypter } from '../../interfaces/cryptography/password-encrypter'

export class DbAddAccountService implements AddAccountUseCase {
  constructor (
    private readonly encryptPassword: PasswordEncrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute (params: AddAccountUseCase.Params): Promise<AccountEntity> {
    const { name, email, password } = params
    const hashedPassword = await this.encryptPassword.encryptPassword(password)
    const account = await this.addAccountRepository.add({ name, email, password: hashedPassword })
    return account
  }
}
