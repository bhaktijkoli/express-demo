import db from '@db'
import { Request, Response } from '@types'

const USER_NOT_FOUND = 'User not found'
const USER_CANT_FOLLOW_SELF = 'Cant follow yourself'
const ALREADY_FOLLOWING = 'Already following'
const NOT_FOLLOWING = 'Not following'

const follow = async (req: Request, res: Response) => {
  // Find User to Follow
  const { id } = req.params
  const user = await db.user.findFirst({
    where: {
      id
    }
  })
  if (user === null) {
    res.status(400).json({ message: USER_NOT_FOUND })
    return
  }
  if (user.id === req.ctx.user.id) {
    res.status(400).json({ message: USER_CANT_FOLLOW_SELF })
    return
  }
  // Check if user is already following
  const alreadyFollowing = await db.follows.findFirst({
    where: {
      followingId: user.id,
      followerId: req.ctx.user.id
    }
  })
  if (alreadyFollowing !== null) {
    res.status(400).json({ message: ALREADY_FOLLOWING })
    return
  }
  // Create Following
  await db.follows.create({
    data: {
      followingId: user.id,
      followerId: req.ctx.user.id
    }
  })
  res.status(200).json({ success: true })
}

const unfollow = async (req: Request, res: Response) => {
  // Find User to Follow
  const { id } = req.params
  const user = await db.user.findFirst({
    where: {
      id
    }
  })
  if (user === null) {
    res.status(400).json({ message: USER_NOT_FOUND })
    return
  }
  if (user.id === req.ctx.user.id) {
    res.status(400).json({ message: USER_CANT_FOLLOW_SELF })
    return
  }
  // Check if user is following
  const alreadyFollowing = await db.follows.findFirst({
    where: {
      followingId: user.id,
      followerId: req.ctx.user.id
    }
  })
  if (alreadyFollowing === null) {
    res.status(400).json({ message: NOT_FOLLOWING })
    return
  }
  // Delete Following
  await db.follows.delete({
    where: {
      followerId_followingId: alreadyFollowing
    }
  })
  res.status(200).json({ success: true })
}

export default {
  follow,
  unfollow
}
