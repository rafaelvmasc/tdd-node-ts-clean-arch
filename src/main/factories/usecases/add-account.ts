import { DbAddAccountService } from '../../../data/services/db-add-account'
import { AddAccountUseCase } from '../../../domain/usecases'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountRepository } from '../../../infra/database/mongodb/account-repository'

export const makeAddAccountService = (): AddAccountUseCase => {
  const encrypter = new BCryptAdapter(12)
  const repository = new AccountRepository()
  return new DbAddAccountService(encrypter, repository)
}
