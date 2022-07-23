import { Encrypter } from '../../../data/interfaces/cryptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign(value, this.secret)
    return token
  }
}
