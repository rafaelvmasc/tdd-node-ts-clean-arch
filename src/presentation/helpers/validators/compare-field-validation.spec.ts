import { InvalidParamError } from '../../errors'
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
})
