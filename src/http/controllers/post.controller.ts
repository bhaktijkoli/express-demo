import db from '@db'
import { Request, Response } from '@types'

const NOT_AUTHORIZED = 'You are not authorized to perform this action'

const add = async (req: Request, res: Response) => {
  const { title, description } = req.body
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
  const { id } = req.params
  const post = await db.post.findFirst({
    where: { id }
  })
  if (post.userId !== req.ctx.user.id) {
    res.status(400).json({ message: NOT_AUTHORIZED })
  }
  await db.post.delete({
    where: {
      id
    }
  })
  res.status(200).json({ data: post })
}

export default {
  add,
  remove
}
