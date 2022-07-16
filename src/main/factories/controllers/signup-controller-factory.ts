import { SignUpController } from '../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeAddAccountService } from '../usecases/add-account'

export const makeSignUpController = (): Controller => {
  const addAccountService = makeAddAccountService()
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(addAccountService, emailValidator)
  return new LogControllerDecorator(signUpController)
}
