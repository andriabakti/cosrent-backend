import { MetadataKeys } from "./metadata.keys";
import 'reflect-metadata'

export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export interface RouteDefinition {
  method: Methods,
  path: string,
  handlerName: string | symbol
}

const methodDecoratorFactory = (method: Methods) => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const contollerClass = target.constructor

      const routers: RouteDefinition[] = Reflect.hasMetadata(
        MetadataKeys.ROUTERS, contollerClass) ?
        Reflect.getMetadata(MetadataKeys.ROUTERS, contollerClass) : []

      routers.push({
        method,
        path,
        handlerName: propertyKey
      })

      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, contollerClass)
    }
  }
}

export const Get = methodDecoratorFactory(Methods.GET)
export const Post = methodDecoratorFactory(Methods.POST)
export const Put = methodDecoratorFactory(Methods.PUT)
export const Patch = methodDecoratorFactory(Methods.PATCH)
export const Delete = methodDecoratorFactory(Methods.DELETE)