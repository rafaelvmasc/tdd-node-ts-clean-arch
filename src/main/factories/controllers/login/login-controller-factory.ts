import { LoginController } from '../../../../presentation/controllers/login-controller/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthenticationService } from '../../usecases/authentication-factory'

export const makeLoginController = (): Controller => {
  return new LoginController(makeAuthenticationService(), makeLoginValidation())
}
