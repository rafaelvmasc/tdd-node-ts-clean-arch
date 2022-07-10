import { PasswordEncrypter } from '../../data/interfaces'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements PasswordEncrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encryptPassword (password: string): Promise<string> {
    await bcryptjs.hash(password, this.salt)
    return new Promise(resolve => resolve('teste'))
  }
}
