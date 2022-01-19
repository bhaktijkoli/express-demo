import db from '@db'
import jwtUtils from '@utils/jwt.utils'
import Logger from '@utils/logger.utils'
import bcrypt from 'bcryptjs'
import usersData from '../data/users.json'

export default async () => {
  // Users
  const userCount = await db.user.count()
  if (userCount === 0) {
    const salt = bcrypt.genSaltSync(10)
    for (const { name, email } of usersData) {
      await db.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(email, salt)
        }
      })
    }
    Logger.debug('Dummy users created')
  }
  // JWT Keys
  await jwtUtils.generateKeys()
}
