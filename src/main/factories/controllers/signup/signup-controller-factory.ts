import { makeAuthenticationService } from '../../usecases/authentication-factory'
import { SignUpController } from '../../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeAddAccountService } from '../../usecases/add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  return new SignUpController(makeAddAccountService(),makeAuthenticationService(), makeSignUpValidation())
}
