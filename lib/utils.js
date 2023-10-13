import fs from 'fs'

const COPY_REGEX = /^COPY [\w.\w|\w]+ \((.+)\) FROM stdin;$/gm
const END_COPY_REGEX = /^\\\.$/gm
const UTF8 = 'utf-8'

const matchRegex = function _matchRegex (line, regex) {
  const result = line.match(regex)
  return !!result && result.length > 0
}

export const isStartOfCopyStatement = function _isStartOfCopyStatement (line, regex = COPY_REGEX) {
  return matchRegex(line, regex)
}

export const isEndOfCopyStatement = function _isEndOfCopyStatement (line, regex = END_COPY_REGEX) {
  return matchRegex(line, regex)
}

export const splitCopyStatement = function _splitCopyStatement (line) {
  const tokens = line.split(' ')
  return [
    tokens[0],
    tokens[1],
    tokens.slice(2, tokens.length - 2).join(' '),
    tokens[tokens.length - 2],
    tokens[tokens.length - 1]
  ]
}

export const isAFilterFn = function _isAFilterFn (fnName) {
  const tkns = fnName.split('.')
  if (tkns.length === 3) {
    return tkns[0] === 'pgfilter' && tkns[1] === 'filter'
  } else {
    return false
  }
}

export const handleSysErrors = (err, arg = 'argument') => {
  switch (true) {
    case err.code === 'ENOENT':
      err.message = `'${arg}' must be a valid file path`
      break
    case err.code === 'EACCES':
      err.message = `'${arg}' needs read permissions`
      break
    case err instanceof SyntaxError:
      err.message = `'${arg}' must be a valid JSON document`
      break
  }
  return err
}

export const validJSONFile = (file, arg, encode = UTF8) => {
  let parsed; let err = null
  try {
    parsed = JSON.parse(fs.readFileSync(file, encode))
  } catch (error) {
    err = handleSysErrors(error, arg)
  }

  if (err) {
    throw err
  }

  return parsed
}

export const validFile = (file, arg) => {
  let err = null
  try {
    fs.accessSync(file, fs.constants.R_OK)
  } catch (error) {
    err = handleSysErrors(error, arg)
  }

  if (err) {
    throw err
  }

  return file
}

export const validBackupFile = (file, arg) => {
  if (file === null) {
    return file
  }

  return validFile(file, arg)
}

export const validBuffer = (buffer, arg) => {
  if (buffer !== undefined) {
    let err = null
    if (isNaN(buffer)) {
      err = handleSysErrors(
        new TypeError(`'${arg}' must be a integer`),
        arg
      )
    }
    if (err) {
      throw err
    }
    return Math.round(buffer)
  }
  return buffer
}

export const inputFromSTDIN = (yargsParsedOpts, prop = 'backup_file') => {
  if (Object.prototype.hasOwnProperty.call(yargsParsedOpts, prop)) {
    return yargsParsedOpts[prop] === null
  } else {
    return true
  }
}
