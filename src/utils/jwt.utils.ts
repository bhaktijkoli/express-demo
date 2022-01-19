import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import db from '@db'
import jwt from 'jsonwebtoken'

import { User } from '.prisma/client'
import Logger from './logger.utils'

const check = async (token: string) => {
  try {
    const { id }: any = jwt.verify(token, getPublicKey(), {
      algorithms: ['RS256']
    })
    const user = await db.user.findFirst({
      where: { id }
    })
    return user
  } catch (error) {
    if (error.name !== 'JsonWebTokenError') {
      Logger.error(error)
    }
  }
  return null
}

const create = (user: User) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  }
  return jwt.sign(payload, getPrivateKey(), {
    expiresIn: 60 * 1000,
    algorithm: 'RS256'
  })
}

const getPrivateKey = () => {
  const privateKeyFile = path.join(
    __dirname,
    '..',
    '..',
    'keys',
    'private.pem'
  )
  return fs.readFileSync(privateKeyFile, 'utf-8')
}

const getPublicKey = () => {
  const publicKeyFile = path.join(__dirname, '..', '..', 'keys', 'public.pem')
  return fs.readFileSync(publicKeyFile, 'utf-8')
}

const generateKeys = async () => {
  // Generate Keys
  const keysFolder = path.join(__dirname, '..', '..', 'keys')
  if (fs.existsSync(keysFolder) === false) {
    fs.mkdirSync(keysFolder)
  }
  const publicKeyFile = path.join(keysFolder, 'public.pem')
  const privateKeyFile = path.join(keysFolder, 'private.pem')

  if (
    fs.existsSync(publicKeyFile) === false ||
    fs.existsSync(privateKeyFile) === false
  ) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })
    fs.writeFileSync(publicKeyFile, publicKey.toString())
    fs.writeFileSync(privateKeyFile, privateKey.toString())
    Logger.info('Generated Key Files')
  }
}

export default {
  create,
  check,
  generateKeys
}
