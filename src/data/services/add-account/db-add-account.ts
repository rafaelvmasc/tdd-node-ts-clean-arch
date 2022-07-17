import { AccountEntity } from '../../../domain/entities'
import { AddAccountUseCase } from '../../../domain/usecases'
import { AddAccountRepository } from '../../interfaces/database'
import { Hasher } from '../../interfaces/cryptography/hasher'

export class DbAddAccountService implements AddAccountUseCase {
  constructor (
    private readonly hash: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute (params: AddAccountUseCase.Params): Promise<AccountEntity> {
    const { name, email, password } = params
    const hashedPassword = await this.hash.hash(password)
    const account = await this.addAccountRepository.add({ name, email, password: hashedPassword })
    return account
  }
}
