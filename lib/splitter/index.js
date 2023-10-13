import split2 from 'split2'

export const splitter = function splitter (matcher = null, mapper = null, options = {}) {
  return split2(matcher, mapper, options)
}
