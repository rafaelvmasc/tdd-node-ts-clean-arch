import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

interface SutTypes {
  sut: EmailValidatorAdapter
}
const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return {
    sut
  }
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Should call isEmail with correct email', () => {
    const { sut } = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const emailToValidate = 'any_email@mail.com'
    sut.isValid(emailToValidate)
    expect(isEmailSpy).toBeCalledWith(emailToValidate)
  })
})
