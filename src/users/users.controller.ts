import { Request, Response } from 'express'
import Controller from '../utils/controller.decorator'
import { Get } from '../utils/handlers.decorator'

@Controller('/users')
export default class UserController {
  @Get('/')
  public index(_req: Request, res: Response): void {
    res.send('Ini adalah endpoint index user')
  }
}