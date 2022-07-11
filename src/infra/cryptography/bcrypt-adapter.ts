import { PasswordEncrypter } from '../../data/interfaces'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements PasswordEncrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encryptPassword (password: string): Promise<string> {
    const hash = await bcryptjs.hash(password, this.salt)
    return hash
  }
}
