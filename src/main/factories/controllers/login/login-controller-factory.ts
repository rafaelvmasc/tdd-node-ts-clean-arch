import { LoginController } from '../../../../presentation/controllers/login-controller/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthenticationService } from '../../usecases/authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeAuthenticationService()
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
