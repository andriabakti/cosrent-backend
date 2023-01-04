// express
import express, { Application, Handler, Request, Response } from 'express'
// plugins
import dotenv from 'dotenv'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { baseRouter } from './utils/baseRouter'
import 'reflect-metadata'
import { routers } from './utils/index.router'

class App {
  public instance: Application

  constructor() {
    dotenv.config()
    this.instance = express()
    this.plugins()
    this.routes()
  }

  protected plugins(): void {
    this.instance
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(morgan('dev'))
      .use(compression())
      .use(helmet())
      .use(cors())
  }

  protected routes(): void {
    this.instance.route('/').get((_req: Request, res: Response) => {
      res.send('root endpoint')
    })

    routers.forEach((controllerClass) => {
      baseRouter(controllerClass, this.instance)
    })
  }
}

export default new App()