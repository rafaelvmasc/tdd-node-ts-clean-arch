import { makeAuthenticationService } from '../../usecases/authentication-factory'
import { LogMongoRepository } from '../../../../infra/database/mongodb/log-repository/log'
import { SignUpController } from '../../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeAddAccountService } from '../../usecases/add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const addAccountService = makeAddAccountService()
  const logRepository = new LogMongoRepository()
  const authentication = makeAuthenticationService()
  const signUpController = new SignUpController(addAccountService,authentication, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logRepository)
}
