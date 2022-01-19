import db from '@db'
import type { Request, Response } from '@types'
import bcrypt from 'bcryptjs'
import jwtUtils from '@utils/jwt.utils'

const MESSAGE = 'Invalid email or password'

const authenticate = async (req: Request, res: Response) => {
  // Get Email and Password from Body
  const { email, password } = req.body
  // Find User
  const user = await db.user.findFirst({
    where: {
      email
    }
  })
  if (user === null) {
    res.status(400).json({ message: MESSAGE })
    return
  }
  // Compare Password
  if (bcrypt.compareSync(password, user.password) === false) {
    res.status(400).json({ message: MESSAGE })
    return
  }
  // Create JWT Access Token
  const accessToken = await jwtUtils.create(user)
  res.status(200).json({ accessToken })
}

const user = async (req: Request, res: Response) => {
  const user = await db.user.findFirst({
    where: {
      id: req.ctx.user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  })
  const followers = await db.follows.count({
    where: {
      followingId: user.id
    }
  })
  const followings = await db.follows.count({
    where: {
      followerId: user.id
    }
  })
  const data = { ...user, followers, followings }
  res.status(200).json({ data })
}

export default {
  authenticate,
  user
}
