import { NextFunction, Request, Response } from '@types'
import jwtUtils from '@utils/jwt.utils'

const ctx = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  if (authorization !== undefined) {
    const token = authorization.replace('Bearer ', '')
    const user = await jwtUtils.check(token)
    if (user !== null) {
      req.ctx.user = user
      next()
      return
    }
  }
  res.sendStatus(401)
}

export default ctx
