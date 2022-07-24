import { DbAuthenticationUseCase } from '../../../data/services/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountRepository } from '../../../infra/database/mongodb/account-repository/account-repository'
import env from '../../config/env'

export const makeAuthenticationService = (): DbAuthenticationUseCase => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountRepository()
  return new DbAuthenticationUseCase(accountMongoRepository, accountMongoRepository, bCryptAdapter, jwtAdapter)
}
