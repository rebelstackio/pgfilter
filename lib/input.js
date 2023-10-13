import fs from 'fs'
import { inputFromSTDIN } from './utils.js'
import splitter from '../lib/splitter/index.js'
import matcher from '../lib/matcher/index.js'
import Analyzer from '../lib/analyzer/index.js'

const _stdin = (analyzer, pgfilterCLIParseOpts) => {
  process.stdin.setEncoding('utf8')
  process.stdin.pipe(
    splitter(null, null, {
      maxLength: pgfilterCLIParseOpts.bufferLength,
      skipOverflow: pgfilterCLIParseOpts.skipOverflow
    })
  ).pipe(
    matcher(analyzer)
  ).pipe(process.stdout)
}

const _file = (analyzer, pgfilterCLIParseOpts) => {
  const inputfile = pgfilterCLIParseOpts.backup_file
  fs.createReadStream(inputfile).setEncoding('utf-8').pipe(
    splitter(null, null, {
      maxLength: pgfilterCLIParseOpts.bufferLength,
      skipOverflow: pgfilterCLIParseOpts.skipOverflow
    })
  ).pipe(
    matcher(analyzer)
  ).pipe(process.stdout)
}

export const init = function _init (pgfilterCLIParseOpts) {
  const analyzer = new Analyzer(pgfilterCLIParseOpts.file, pgfilterCLIParseOpts.verbose)
  if (inputFromSTDIN(pgfilterCLIParseOpts)) {
    _stdin(analyzer, pgfilterCLIParseOpts)
  } else {
    _file(analyzer, pgfilterCLIParseOpts)
  }
}

export default init
