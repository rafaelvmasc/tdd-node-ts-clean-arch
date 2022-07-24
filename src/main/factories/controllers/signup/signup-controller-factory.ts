import { makeAuthenticationService } from '../../usecases/authentication-factory'
import { SignUpController } from '../../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeAddAccountService } from '../../usecases/add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeSignUpController = (): Controller => {
  const addAccountService = makeAddAccountService()
  const authentication = makeAuthenticationService()
  const signUpController = new SignUpController(addAccountService,authentication, makeSignUpValidation())
  return makeLogControllerDecorator(signUpController)
}
