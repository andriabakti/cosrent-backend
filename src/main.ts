// express
import express, { Application, Handler, Request, Response } from 'express'
// plugins
import dotenv from 'dotenv'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { controllers } from './controller'
import { MetadataKeys } from './utils/metadata.keys'
import { IRouter } from './utils/handlers.decorator'
import 'reflect-metadata'

class App {
  public instance: Application

  constructor() {
    this.instance = express()
    this.plugins()
    this.routes()
    dotenv.config()
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

    const info: Array<{ api: string, handler: string }> = []
    controllers.forEach((controllerClass) => {
      const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any

      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass)
      const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)

      const exRouter = express.Router()

      routers.forEach(({method, path, handlerName}) => {
        exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance))
        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          handler: `${controllerClass.name}.${String(handlerName)}`
        })
      })

      this.instance.use(basePath, exRouter)
    })
  }
}

export default new App()