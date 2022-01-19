import { config } from 'dotenv'
import { start } from './app'
import loaders from './loaders'
config();

(() => {
  start()
  loaders()
})()
