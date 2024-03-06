import _ from 'lodash'

export const pickKeys = (object = {}, arrKeys = []) => {
  return _.pick(object, arrKeys)
}

export const omitKeys = (object = {}, arrKeys = []) => {
  return _.omit(object, arrKeys)
}
