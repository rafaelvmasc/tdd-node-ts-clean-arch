import { CredentialsEntity } from '../../domain/entities'
import { ValidateCredentialsUseCase } from '../../domain/usecases'
import { JWTGenerator, ValidateUserCredentialsRepository } from '../interfaces'

export class DbValidateCredentialsService implements ValidateCredentialsUseCase {
  constructor (
    private readonly validateUserCredentialsRepository: ValidateUserCredentialsRepository,
    private readonly jwtGenerator: JWTGenerator
  ) {}

  async perform (params: CredentialsEntity): Promise<ValidateCredentialsUseCase.Result> {
    const { email, password } = params
    const isUserValid = await this.validateUserCredentialsRepository.checkUser({ email, password })
    const token = await this.jwtGenerator.genToken({ email })
    return isUserValid
      ? {
          token
        }
      : isUserValid
  }
}
