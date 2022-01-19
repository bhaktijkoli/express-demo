import { Express } from 'express'
import followController from '@controllers/follow.controller'
import authMiddleware from '@middlewares/auth.middleware'

export default (app: Express) => {
  app.post('/api/follow/:id', [authMiddleware], followController.follow)
  app.post('/api/unfollow/:id', [authMiddleware], followController.unfollow)
}
