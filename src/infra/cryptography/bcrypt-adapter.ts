import { HashComparer, Hasher } from '../../data/interfaces/cryptography'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (password: string): Promise<string> {
    const hash = await bcryptjs.hash(password, this.salt)
    return hash
  }

  async compare (params: HashComparer.Params): Promise<boolean> {
    const { inputPassword, hashPassword } = params
    const isEqual = await bcryptjs.compare(inputPassword, hashPassword)
    return isEqual
  }
}
