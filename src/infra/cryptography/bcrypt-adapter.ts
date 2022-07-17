import { Hasher } from '../../data/interfaces/cryptography'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  async hash (password: string): Promise<string> {
    const hash = await bcryptjs.hash(password, this.salt)
    return hash
  }
}
