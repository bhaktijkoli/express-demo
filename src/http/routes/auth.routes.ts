import { Express } from 'express'
import authController from '@controllers/auth.controller'
import authMiddleware from '@middlewares/auth.middleware'

export default (app: Express) => {
  app.post('/api/authenticate', authController.authenticate)
  app.get('/api/user', [authMiddleware], authController.user)
}
