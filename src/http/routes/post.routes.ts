import { Express } from 'express'
import postController from '@controllers/post.controller'
import authMiddleware from '@middlewares/auth.middleware'

export default (app: Express) => {
  app.post('/api/posts', [authMiddleware], postController.add)
  app.delete('/api/posts/:id', [authMiddleware], postController.remove)
}
