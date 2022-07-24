import { LogMongoRepository } from '../../../infra/database/mongodb/log-repository/log'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logRepository)
}
