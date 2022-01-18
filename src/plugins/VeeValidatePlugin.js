import { defineRule, Field, Form, ErrorMessage, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import store from '@/store'

export default (app) => {
  defineRule('isRequired', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let collection, field, previousValue

    if (Array.isArray(args)) {
      ;[collection, field] = args
    } else {
      ;({ collection, field, previousValue } = args)
    }

    if (value === previousValue) return true

    const querySnapshot = await store.dispatch('fetchDocsByQuery', {
      resource: collection,
      whereCondition: {
        key: field,
        operator: '==',
        value
      }
    })

    const docExists = querySnapshot.docs.length > 0
    return !docExists
  })

  configure({
    // Generates an English message locale generator
    generateMessage: localize({
      en: {
        messages: {
          isRequired: '{field} is required',
          min: '{field} must be at least 0:{min} characters long',
          unique: '{field} is not available'
        }
      }
    })
  })

  app.component('VField', Field)
  app.component('VForm', Form)
  app.component('VErrorMessage', ErrorMessage)
}
