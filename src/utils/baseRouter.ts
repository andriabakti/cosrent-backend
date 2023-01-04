import { Application, Handler, Router } from 'express'
import { RouteDefinition } from './handlers.decorator';
import { MetadataKeys } from './metadata.keys';

export const router = Router()
export const baseRouter = (controllerClass: any, instance: Application) => {
  const info: Array<{ api: string, handler: string }> = []
  const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any

  const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass)
  const routers: RouteDefinition[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)

  routers.forEach(({method, path, handlerName}) => {
    router[method](path, controllerInstance[String(handlerName)].bind(controllerInstance))
    info.push({
      api: `${method.toLocaleUpperCase()} ${process.env.ROUTER_PREFIX}${basePath + path}`,
      handler: `${controllerClass.name}.${String(handlerName)}`
    })
  })

  instance.use(`${process.env.ROUTER_PREFIX}${basePath}`, router)
}