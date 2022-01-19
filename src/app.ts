import express, { Request, Response } from 'express'
import Logger from '@utils/logger.utils'

const start = () => {
  // Create Express instance
  const app = express()

  // Middlwares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Base Route
  app.get('/', (_: Request, res: Response) => {
    res.send('Welcome to API')
  })

  // Get Port From ENV
  const port = parseInt(process.env.PORT || '3000')
  app.set('port', port)

  // Start Listening
  app.listen(port, () => {
    Logger.debug(`App listening at http://localhost:${port}`)
  })
}

export { start }
