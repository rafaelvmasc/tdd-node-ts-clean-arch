import { SignUpController } from '../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeAddAccountService } from '../services/add-account'

export const makeSignUpController = (): Controller => {
  const addAccountService = makeAddAccountService()
  const emailValidator = new EmailValidatorAdapter()
  return new SignUpController(addAccountService, emailValidator)
}
