import Logger from '@utils/logger.utils'
import { NextFunction, Request, Response } from 'express'

const logging = (request: Request, response: Response, next: NextFunction) => {
  const startedAt = new Date()
  request.on('close', () => {
    const method = request.method
    const url = request.url
    const status = response.statusCode
    const resposneTime = (new Date() as any) - (startedAt as any)
    Logger.info(`${method} ${url} ${status} ${resposneTime}ms`)
  })
  next()
}

export default logging
