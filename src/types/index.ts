import { User } from '@prisma/client'
import * as Express from 'express'

export interface Request extends Express.Request {
  ctx: {
    user: User | undefined;
  };
}

export type Response = Express.Response;
export type NextFunction = Express.NextFunction;
