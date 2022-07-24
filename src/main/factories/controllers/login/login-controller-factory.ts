import { LogMongoRepository } from '../../../../infra/database/mongodb/log-repository/log'
import { LoginController } from '../../../../presentation/controllers/login-controller/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthenticationService } from '../../usecases/authentication-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeAuthenticationService()
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
