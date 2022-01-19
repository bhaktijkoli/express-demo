import { NextFunction, Request, Response } from '@types'

const ctx = (req: Request, _: Response, next: NextFunction) => {
  req.ctx = {
    user: undefined
  }
  next()
}

export default ctx
