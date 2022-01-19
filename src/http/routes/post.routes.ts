import { Express } from 'express'
import postController from '@controllers/post.controller'
import authMiddleware from '@middlewares/auth.middleware'

export default (app: Express) => {
  app.get('/api/posts/:id', [authMiddleware], postController.get)
  app.get('/api/all_posts', [authMiddleware], postController.all)
  app.post('/api/posts', [authMiddleware], postController.add)
  app.delete('/api/posts/:id', [authMiddleware], postController.remove)
  app.post('/api/like/:id', [authMiddleware], postController.like)
  app.post('/api/unlike/:id', [authMiddleware], postController.unlike)
  app.post('/api/comment/:id', [authMiddleware], postController.comment)
}
