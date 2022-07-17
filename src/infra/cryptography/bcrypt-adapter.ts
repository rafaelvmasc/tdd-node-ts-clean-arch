import { HashComparer, Hasher } from '../../data/interfaces/cryptography'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash
  }

  async compare (params: HashComparer.Params): Promise<boolean> {
    const { inputPassword, hashPassword } = params
    const isEqual = await bcrypt.compare(inputPassword, hashPassword)
    return isEqual
  }
}
