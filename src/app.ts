import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import Logger from '@utils/logger.utils'
import createError from 'http-errors'
import authRoutes from '@routes/auth.routes'
import followRoutes from '@routes/follow.routes'

import ctx from '@middlewares/ctx.middleware'
import logging from '@middlewares/logging.middleware'

const start = () => {
  // Create Express instance
  const app = express()

  // View Engine Setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'hbs')

  // Middlwares
  app.use(logging)
  app.use(ctx)
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Base Route
  app.get('/', (_: Request, res: Response) => {
    res.send('Welcome to API')
  })

  // Get Port From ENV
  const port = parseInt(process.env.PORT || '3000')
  app.set('port', port)

  // Routes
  authRoutes(app)
  followRoutes(app)

  // Start Listening
  app.listen(port, () => {
    Logger.debug(`App listening at http://localhost:${port}`)
  })

  // Catch 404 and forward to error handler
  app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError(404))
  })

  // Error Handler
  app.use((err: any, req: Request, res: Response, _: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })
}

export { start }
