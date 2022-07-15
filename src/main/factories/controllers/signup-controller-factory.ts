import { SignUpController } from '../../../presentation/controllers/signup-controller/signup-controller'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeAddAccountService } from '../usecases/add-account'

export const makeSignUpController = (): SignUpController => {
  const addAccountService = makeAddAccountService()
  const emailValidator = new EmailValidatorAdapter()
  return new SignUpController(addAccountService, emailValidator)
}
