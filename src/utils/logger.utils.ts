import fs from 'fs'
import path from 'path'

import { ILogObject, Logger as TSLogger } from 'tslog'

function logToTransport (logObject: ILogObject) {
  const date: Date = new Date()
  const folderPath = path.join(__dirname, '..', '..', 'logs')
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
  const fileName: string =
    String(date.getUTCFullYear()) +
    String(date.getMonth()) +
    String(date.getDate()) +
    '.log'
  const filePath: string = path.join(folderPath, fileName)
  fs.appendFileSync(filePath, JSON.stringify(logObject) + '\n')
}

const Logger: TSLogger = new TSLogger()

Logger.attachTransport(
  {
    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    info: logToTransport,
    warn: logToTransport,
    error: logToTransport,
    fatal: logToTransport
  },
  'debug'
)

export default Logger
