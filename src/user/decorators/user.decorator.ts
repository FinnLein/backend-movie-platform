import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../user.model'

type TypeData = keyof UserModel

export const User = createParamDecorator((data: TypeData, xtc: ExecutionContext) => {
    const request = xtc.switchToHttp().getRequest()
    const user = request.user

    return data ? user[data] : user
})
