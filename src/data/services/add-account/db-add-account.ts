import { AddAccountUseCase } from '../../../domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository } from '../../interfaces/database'
import { Hasher } from '../../interfaces/cryptography/hasher'

export class DbAddAccountService implements AddAccountUseCase {
  constructor (
    private readonly hash: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async execute (params: AddAccountUseCase.Params): Promise<AddAccountUseCase.Result> {
    const { name, email, password } = params
    const accountExists = await this.loadByEmailRepository.loadByEmail({ email })
    if (!accountExists) {
      const hashedPassword = await this.hash.hash(password)
      const account = await this.addAccountRepository.add({ name, email, password: hashedPassword })
      return account
    }
    return null
  }
}
