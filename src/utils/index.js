import _ from 'lodash'

export const pickKeys = (obj = {}, arr = []) => {
  return _.pick(obj, arr)
}

export const omitKeys = (obj = {}, arr = []) => {
  return _.omit(obj, arr)
}
