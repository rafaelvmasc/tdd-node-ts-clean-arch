import validator from 'validator'
import { EmailValidator } from '../../validation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    const isValid = validator.isEmail(email)
    return isValid
  }
}
