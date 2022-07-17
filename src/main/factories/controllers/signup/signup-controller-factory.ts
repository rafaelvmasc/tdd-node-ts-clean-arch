import { LogMongoRepository } from '../../../../infra/database/mongodb/log-repository/log'
import { SignUpController } from '../../../../presentation/controllers/signup-controller/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log'
import { makeAddAccountService } from '../../usecases/add-account'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const addAccountService = makeAddAccountService()
  const logRepository = new LogMongoRepository()
  const signUpController = new SignUpController(addAccountService, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logRepository)
}
