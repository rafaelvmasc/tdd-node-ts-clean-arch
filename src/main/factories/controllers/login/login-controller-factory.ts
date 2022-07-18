import { DbAuthenticationUseCase } from '../../../../data/services/authentication/db-authentication'
import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountRepository } from '../../../../infra/database/mongodb/account-repository/account-repository'
import { LogMongoRepository } from '../../../../infra/database/mongodb/log-repository/log'
import { LoginController } from '../../../../presentation/controllers/login-controller/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import env from '../../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountRepository()
  const dbAuthentication = new DbAuthenticationUseCase(accountMongoRepository, accountMongoRepository, bCryptAdapter, jwtAdapter)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
