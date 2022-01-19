import { config } from 'dotenv'
import { start } from './app'
config();

(() => {
  start()
})()
