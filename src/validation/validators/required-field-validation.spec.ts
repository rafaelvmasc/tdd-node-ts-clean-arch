import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return MissingParamError if a required field is not provided', () => {
    const fieldName = 'field'
    const sut = new RequiredFieldValidation(fieldName)
    const input = {
      email: 'any_email@mail.com'
    }
    const error = sut.validate(input)
    expect(error).toEqual(new MissingParamError(fieldName))
  })

  test('Should return null if validation is ok', () => {
    const fieldName = 'field'
    const sut = new RequiredFieldValidation(fieldName)
    const input = {
      field: 'any_value'
    }
    const error = sut.validate(input)
    expect(error).toBeFalsy()
  })
})
