import db from '@db'
import { Request, Response } from '@types'

const NOT_AUTHORIZED = 'You are not authorized to perform this action'
const ALREADY_LIKED = 'You have already liked this post'
const NOT_LIKED = 'You have not liked this post before'

const get = async (req: Request, res: Response) => {
  // Check if Post Exists
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id },
    select: {
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      comments: {
        select: {
          message: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      likes: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  })
  if (post === null) {
    res.status(404)
    return
  }
  res.status(200).json({ data: post })
}

const all = async (req: Request, res: Response) => {
  const data = await db.post.findMany({
    select: {
      title: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  })
  res.status(200).json({ data })
}

const add = async (req: Request, res: Response) => {
  // Get Title, Description from Body
  const { title, description } = req.body
  // Create Post
  const data = await db.post.create({
    data: {
      title,
      description,
      userId: req.ctx.user.id
    }
  })
  res.status(200).json({ data })
}

const remove = async (req: Request, res: Response) => {
  // Check if Post Exists
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id }
  })
  if (post === null) {
    res.status(404)
    return
  }
  // Check if User is the owner of the post
  if (post.userId !== req.ctx.user.id) {
    res.status(400).json({ message: NOT_AUTHORIZED })
    return
  }
  // Delete the Post
  await db.post.delete({
    where: {
      id
    }
  })
  res.status(200).json({ data: post })
}

const like = async (req: Request, res: Response) => {
  // Find Post
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id }
  })
  if (post === null) {
    res.status(404)
    return
  }
  // Check if user has already liked the post
  const alreadyLiked = await db.like.findFirst({
    where: {
      postId: post.id,
      userId: req.ctx.user.id
    }
  })

  if (alreadyLiked !== null) {
    res.status(400).json({ message: ALREADY_LIKED })
  }
  // Create Like
  await db.like.create({
    data: {
      postId: post.id,
      userId: req.ctx.user.id
    }
  })
  res.status(200).json({ success: true })
}

const unlike = async (req: Request, res: Response) => {
  // Find Post
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id }
  })
  if (post === null) {
    res.status(404)
    return
  }
  // Check if user has already liked the post
  const alreadyLiked = await db.like.findFirst({
    where: {
      postId: post.id,
      userId: req.ctx.user.id
    }
  })

  if (alreadyLiked === null) {
    res.status(400).json({ message: NOT_LIKED })
  }

  // Delete Like
  await db.like.delete({
    where: {
      postId_userId: {
        postId: post.id,
        userId: req.ctx.user.id
      }
    }
  })
  res.status(200).json({ success: true })
}

const comment = async (req: Request, res: Response) => {
  // Find Post
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id }
  })
  if (post === null) {
    res.status(404)
    return
  }
  // Get Comment from Body
  const { comment } = req.body
  // Create Comment
  const data = await db.comment.create({
    data: {
      message: comment,
      postId: post.id,
      userId: req.ctx.user.id
    }
  })
  res.status(200).json({ data })
}

export default {
  get,
  all,
  add,
  remove,
  like,
  unlike,
  comment
}
