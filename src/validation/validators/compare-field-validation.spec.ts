import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldValidation } from './compare-field-validation'

describe('Compare Field Validation', () => {
  test('Should return InvalidParamError if fields comparison fails', () => {
    const sut = new CompareFieldValidation('field', 'compareField')
    const input = {
      field: 'field',
      compareField: 'compareValue'
    }
    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError('compareField'))
  })

  test('Should return null if field comparison is ok', () => {
    const sut = new CompareFieldValidation('field', 'compareField')
    const error = sut.validate({
      field: 'value',
      compareField: 'value'
    })
    expect(error).toBeFalsy()
  })
})
